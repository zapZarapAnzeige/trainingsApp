import base64
from fastapi import HTTPException, UploadFile, Response, status
from db_connection import session
from db_models import (
    Users,
    Exercises,
    Individual_Exercise_Ratings,
    Overall_Exercise_Ratings,
    Trainings_plan,
    Trainings_plan_history,
    User_current_performance,
    Days,
    Exercises2Trainings_plans,
    Tags,
    Exercises_history,
)
from datetime import datetime, timedelta
from sqlalchemy.dialects.mysql import insert
from sqlalchemy import select, and_, distinct, literal, delete, update
from sqlalchemy.exc import NoResultFound
from typing import Dict, List, Optional
from db_parser import parse_trainings, parse_exercises, parse_past_or_future_trainings
from custom_types import (
    WEEKDAY_MAP,
    post_trainingSchedule,
    post_trainingSchedule_Exercises,
    post_Exercise_trainings_converted,
)


async def get_overview(partners: Dict):
    user_data = (
        session.execute(
            select(
                Users.c.profile_picture,
                Users.c.user_name,
                Users.c.user_id,
                Users.c.bio,
                Users.c.nickname,
            ).where(Users.c.user_id.in_(partners.keys()))
        )
        .mappings()
        .fetchall()
    )

    return [
        {
            "bio": data.get("bio"),
            "nickname": data.get("nickname"),
            "partner_name": data.get("user_name"),
            **partners[data.get("user_id")],
            "profile_picture": base64.b64encode(data.get("profile_picture")).decode(
                "utf-8"
            )
            if data.get("profile_picture")
            else None,
        }
        for data in user_data
    ]


async def update_user_data(
    profile_picture: Optional[UploadFile], user_id: int, user_data: Dict
):
    if profile_picture:
        max_size_bytes = 16 * 1024 * 1024  # 16 MB max size for medium blob
        if profile_picture.size > max_size_bytes:
            raise HTTPException(status_code=413, detail="Image size exceeds 16 MB")
        image_data = bytes(await profile_picture.read())
        user_data["profile_picture"] = image_data
    try:
        session.execute(
            Users.update().where(Users.c.user_id == user_id).values(user_data)
        )
        session.commit()
    except Exception as e:
        print(e)
        session.rollback()


def get_profile_pic(user_id: int):
    a = session.execute(
        select(Users.c.profile_picture).where(Users.c.user_id == user_id)
    ).scalar_one()

    return Response(content=a, media_type="image/jpeg")


def get_user(name):
    result = session.execute(select(Users).where(Users.c.user_name == name)).fetchone()
    if result is not None:
        return result._asdict()

    return result


def insert_new_user(username: str, password: str):
    try:
        stmt = insert(Users).values(
            user_name=username,
            password=password,
            expired=False,
            searching_for_partner=False,
        )
        operation = session.execute(stmt)
        session.commit()
        return operation.is_insert
    except Exception as ex:
        session.rollback()
        raise ex


def get_all_usernames():
    return session.execute(select(Users.c.user_name).select_from(Users)).scalars().all()


async def save_exercise_rating(rating: int, exercise: str, user_id: int):
    exercise_id = session.execute(
        select(Exercises.c.exercise_id).where(Exercises.c.exercise_name == exercise)
    ).scalar_one()
    if exercise_id:
        session.execute(
            insert(Individual_Exercise_Ratings)
            .values(exercise_id=exercise_id, user_id=user_id, rating=rating)
            .on_duplicate_key_update(rating=rating)
        )
        session.commit()
        return True
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Invalid exercise ID"
    )


def get_exercise_for_dialog(exercise_name: str, user_id: int):
    result = (
        session.execute(
            select(
                Trainings_plan.c.trainings_id,
                Trainings_plan.c.trainings_name,
                Exercises.c.exercise_name,
            )
            .select_from(Trainings_plan)
            .where(and_(Trainings_plan.c.user_id == user_id))
            .join(
                Exercises2Trainings_plans,
                Exercises2Trainings_plans.c.trainings_id
                == Trainings_plan.c.trainings_id,
                isouter=True,
            )
            .join(
                Exercises,
                Exercises2Trainings_plans.c.exercise_id == Exercises.c.exercise_id,
                isouter=True,
            )
        )
        .mappings()
        .fetchall()
    )
    in_training = {}
    not_in_training = {}
    for val in result:
        if val["exercise_name"] == exercise_name:
            in_training[val["trainings_id"]] = val
        else:
            not_in_training[val["trainings_id"]] = val

    for k in list(not_in_training.keys()):
        if k in in_training.keys():
            del not_in_training[k]
    return {
        "in_training": list(in_training.values()),
        "not_in_training": list(not_in_training.values()),
    }


def get_exercise_not_in_training(exercise_name: str, user_id: int):
    pass


async def find_trainingspartner(plz: str, matched_people: List[int]):
    try:
        partner = session.execute(
            select(
                Users.c.user_name,
                Users.c.user_id,
                Users.c.profile_picture,
                Users.c.nickname,
                Users.c.bio,
            ).where(
                and_(
                    Users.c.plz == plz,
                    Users.c.searching_for_partner,
                    Users.c.user_id.not_in(matched_people),
                )
            )
        ).first()
        print(partner)
        if partner:
            return partner._asdict()
        else:
            return None
    except NoResultFound:
        return None


def get_general_exercise_info(exercise: str, user_id: int):
    info = session.execute(
        select(
            Exercises.c.exercise_id,
            Exercises.c.exercise_name,
            Exercises.c.description,
            Individual_Exercise_Ratings.c.rating,
        )
        .select_from(Exercises)
        .join(
            Individual_Exercise_Ratings,
            and_(
                Individual_Exercise_Ratings.c.exercise_id == Exercises.c.exercise_id,
                Individual_Exercise_Ratings.c.user_id == user_id,
            ),
            isouter=True,
        )
        .where(Exercises.c.exercise_name == exercise)
    ).first()
    if info:
        return info._asdict()
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")


def get_trainings(user_id: int):
    return parse_trainings(
        session.execute(
            select(
                Trainings_plan.c.trainings_id,
                Trainings_plan.c.trainings_name,
                Days.c.weekday,
                Exercises.c.exercise_name,
                Exercises.c.exercise_id,
                Exercises.c.constant_unit_of_measure,
                User_current_performance.c.minutes,
                User_current_performance.c.number_of_repetition,
                User_current_performance.c.number_of_sets,
                User_current_performance.c.trackable_unit_of_measure,
                User_current_performance.c.value_trackable_unit_of_measure,
            )
            .select_from(Trainings_plan)
            .join(
                Days,
                and_(
                    Days.c.trainings_id == Trainings_plan.c.trainings_id,
                    Days.c.user_id == Trainings_plan.c.user_id,
                ),
                isouter=True,
            )
            .join(
                Exercises2Trainings_plans,
                Exercises2Trainings_plans.c.trainings_id
                == Trainings_plan.c.trainings_id,
                isouter=True,
            )
            .join(
                Exercises,
                Exercises2Trainings_plans.c.exercise_id == Exercises.c.exercise_id,
                isouter=True,
            )
            .join(
                User_current_performance,
                Exercises.c.exercise_id == User_current_performance.c.exercise_id,
                isouter=True,
            )
            .where(
                and_(
                    Trainings_plan.c.user_id == user_id,
                )
            )
        )
        .mappings()
        .fetchall()
    )


def get_all_exercises_for_user(user_id: int):
    return parse_exercises(
        session.execute(
            select(
                Exercises.c.exercise_name,
                Exercises.c.exercise_id,
                Exercises.c.constant_unit_of_measure,
                Overall_Exercise_Ratings.c.rating,
                Overall_Exercise_Ratings.c.total_exercise_ratings,
                User_current_performance.c.minutes,
                User_current_performance.c.number_of_repetition,
                User_current_performance.c.number_of_sets,
                User_current_performance.c.value_trackable_unit_of_measure,
                User_current_performance.c.trackable_unit_of_measure,
                Tags.c.tag_name,
                Tags.c.is_primary_tag,
            )
            .select_from(Exercises)
            .join(Tags, Exercises.c.exercise_id == Tags.c.exercise_id, isouter=True)
            .join(
                Overall_Exercise_Ratings,
                Overall_Exercise_Ratings.c.exercise_id == Exercises.c.exercise_id,
                isouter=True,
            )
            .join(
                User_current_performance,
                and_(
                    User_current_performance.c.exercise_id == Exercises.c.exercise_id,
                    User_current_performance.c.user_id == user_id,
                ),
                isouter=True,
            )
        )
        .mappings()
        .fetchall()
    )


def get_all_unique_tags():
    return (
        session.execute(select(distinct(Tags.c.tag_name)).select_from(Tags))
        .scalars()
        .all()
    )


def get_base_exercises(user_id: int):
    return parse_exercises(
        session.execute(
            select(
                Exercises.c.exercise_id,
                Exercises.c.exercise_name,
                Exercises.c.constant_unit_of_measure,
                User_current_performance.c.minutes,
                User_current_performance.c.number_of_repetition,
                User_current_performance.c.number_of_sets,
                User_current_performance.c.value_trackable_unit_of_measure,
                User_current_performance.c.trackable_unit_of_measure,
            )
            .select_from(Exercises)
            .join(
                User_current_performance,
                and_(
                    User_current_performance.c.exercise_id == Exercises.c.exercise_id,
                    User_current_performance.c.user_id == user_id,
                ),
                isouter=True,
            )
        )
        .mappings()
        .fetchall(),
        True,
    )


def get_past_trainings_from_start_date(start_date: datetime, user_id: int):
    end_date = start_date + timedelta(weeks=1)
    cur_date = datetime.now()
    if cur_date < end_date:
        # not neccessary but makes query faster
        end_date = cur_date
    return parse_past_or_future_trainings(
        session.execute(
            select(
                Trainings_plan_history.c.day,
                Trainings_plan_history.c.trainings_name,
                Trainings_plan_history.c.trainings_plan_history_id.label(
                    "trainings_id"
                ),
                Exercises_history.c.exercises_history_id.label("exercise_id"),
                Exercises.c.exercise_name,
                Exercises_history.c.completed,
                Exercises.c.constant_unit_of_measure,
                Exercises_history.c.minutes,
                Exercises_history.c.number_of_repetition,
                Exercises_history.c.number_of_sets,
                Exercises_history.c.value_trackable_unit_of_measure,
                Exercises_history.c.trackable_unit_of_measure,
            )
            .select_from(Trainings_plan_history)
            .where(
                and_(
                    Trainings_plan.c.user_id == user_id,
                    Trainings_plan_history.c.day.between(start_date, end_date),
                )
            )
            .join(
                Exercises_history,
                Trainings_plan_history.c.trainings_plan_history_id
                == Exercises_history.c.trainings_plan_history_id,
                isouter=True,
            )
            .join(
                Exercises,
                Exercises_history.c.exercise_id == Exercises_history.c.exercise_id,
            )
        )
        .mappings()
        .fetchall()
    )


def get_weekdays():
    days_start_ind = 6 - datetime.now().weekday()

    return [WEEKDAY_MAP.keys()[i * -1] for i in range(days_start_ind, 0, -1)]


def get_future_trainings_from_cur_date(user_id: int):
    return parse_past_or_future_trainings(
        session.execute(
            select(
                Days.c.weekday.label("day"),
                Trainings_plan.c.trainings_name,
                Trainings_plan.c.trainings_id,
                Exercises.c.exercise_id,
                Exercises.c.exercise_name,
                literal(False).label("completed"),
                Exercises.c.constant_unit_of_measure,
                User_current_performance.c.minutes,
                User_current_performance.c.number_of_repetition,
                User_current_performance.c.number_of_sets,
                User_current_performance.c.value_trackable_unit_of_measure,
                User_current_performance.c.trackable_unit_of_measure,
            )
            .select_from(Days)
            .where(Days.c.user_id == user_id, Days.c.weekday.in_(get_weekdays()))
            .join(Trainings_plan, Trainings_plan.c.trainings_id == Days.c.trainings_id)
            .join(
                Exercises2Trainings_plans,
                Trainings_plan.c.trainings_id
                == Exercises2Trainings_plans.c.trainings_id,
                isouter=True,
            )
            .join(
                Exercises,
                Exercises2Trainings_plans.c.exercise_id == Exercises.c.exercise_id,
            )
            .join(
                User_current_performance,
                and_(
                    User_current_performance.c.exercise_id == Exercises.c.exercise_id,
                    User_current_performance.c.user_id == user_id,
                ),
                isouter=True,
            )
        )
        .mappings()
        .fetchall()
    )


def save_trainings_data(trainings_data: post_trainingSchedule, user_id: int):
    exercise_ids = (
        session.execute(select(Exercises.c.exercise_id).select_from(Exercises))
        .scalars()
        .all()
    )

    if not {ex.exerciseId for ex in trainings_data.exercises}.issubset(exercise_ids):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="ExerciseId not found"
        )
    try:
        if trainings_data.trainingsId < 0:
            insert_training = session.execute(
                insert(Trainings_plan).values(
                    trainings_name=trainings_data.name, user_id=user_id
                )
            )

            insert_days(
                trainings_data.onDays, user_id, insert_training.inserted_primary_key[0]
            )

            insert_Exercises2Trainings_plans(
                insert_training.inserted_primary_key[0], trainings_data.exercises
            )

            session.commit()
            return Response(status_code=status.HTTP_201_CREATED)
        else:
            if (
                not session.execute(
                    select(Trainings_plan.c.user_id).where(
                        Trainings_plan.c.trainings_id == trainings_data.trainingsId
                    )
                ).scalar_one()
                == user_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No permission to edit training",
                )
            # TODO need day_id
            current_days = (
                session.execute(
                    select(Days.c.weekday).where(
                        and_(
                            Days.c.trainings_id == trainings_data.trainingsId,
                            Days.c.user_id == user_id,
                        )
                    )
                )
                .scalars()
                .all()
            )

            session.execute(
                delete(Days).where(
                    and_(
                        Days.c.user_id == user_id,
                        Days.c.trainings_id == trainings_data.trainingsId,
                        Days.c.weekday.in_(
                            day
                            for day in current_days
                            if day not in trainings_data.onDays
                        ),
                    )
                )
            )

            days_to_insert = [
                {
                    "weekday": day,
                    "user_id": user_id,
                    "trainings_id": trainings_data.trainingsId,
                }
                for day in trainings_data.onDays
                if day not in current_days
            ]
            if len(days_to_insert) > 0:
                session.execute(insert(Days).values(days_to_insert))

            current_exercises2trainings = (
                session.execute(
                    select(Exercises2Trainings_plans.c.exercise_id).where(
                        Exercises2Trainings_plans.c.trainings_id
                        == trainings_data.trainingsId,
                    )
                )
                .scalars()
                .all()
            )

            new_exercises = [ex.exerciseId for ex in trainings_data.exercises]

            session.execute(
                delete(Exercises2Trainings_plans).where(
                    Exercises2Trainings_plans.c.exercise_id.in_(
                        [
                            ex_id
                            for ex_id in current_exercises2trainings
                            if ex_id not in new_exercises
                        ]
                    )
                )
            )

            exercises_to_insert = [
                {
                    "trainings_id": trainings_data.trainingsId,
                    "exercise_id": ex_id,
                }
                for ex_id in new_exercises
                if ex_id not in current_exercises2trainings
            ]
            if len(exercises_to_insert) > 0:
                session.execute(
                    insert(Exercises2Trainings_plans).values(exercises_to_insert)
                )
            session.commit()

            return Response(status_code=status.HTTP_202_ACCEPTED)

    except HTTPException as e:
        session.rollback()
        raise e
    except Exception as e:
        print(e)
        session.rollback()
        return False


def insert_days(days: List[str], user_id: int, trainings_id: int):
    session.execute(
        insert(Days).values(
            [
                {
                    "weekday": day,
                    "user_id": user_id,
                    "trainings_id": trainings_id,
                }
                for day in days
            ]
        )
    )


def insert_Exercises2Trainings_plans(
    trainings_id: int, exercises: List[post_trainingSchedule_Exercises]
):
    session.execute(
        insert(Exercises2Trainings_plans).values(
            [
                {
                    "trainings_id": trainings_id,
                    "exercise_id": ex.exerciseId,
                }
                for ex in exercises
            ]
        )
    )


def save_calendar_data(
    trainings: List[post_Exercise_trainings_converted], user_id: int
):
    for exercise in trainings:
        session.execute(
            update(Exercises_history)
            .values(
                completed=exercise.completed,
                value_trackable_unit_of_measure=exercise.weight,
            )
            .where(
                and_(
                    Exercises_history.c.exercises_history_id == exercise.exerciseId,
                    Exercises_history.c.user_id == user_id,
                )
            )
        )
