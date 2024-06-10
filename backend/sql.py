import base64
from fastapi import HTTPException, UploadFile, Response, status
from db_connection import session
from db_models import (
    User,
    Exercise,
    Individual_rating,
    Average_rating,
    Training_plan,
    Training_plan_history,
    User_current_performance,
    Day,
    Exercise2Training_plan,
    Tags,
    Tags2Exercises,
    Exercise_history,
)
from sqlalchemy.exc import IntegrityError, NoResultFound
from datetime import datetime, timedelta
from sqlalchemy.dialects.mysql import insert
from sqlalchemy import select, and_, literal, delete, update, case
from typing import Dict, List, Optional, Union
from db_parser import (
    parse_trainings,
    parse_exercises,
    parse_past_or_future_trainings,
    parse_exercise_for_dialog,
)
from custom_types import (
    WEEKDAY_MAP,
    post_trainingSchedule,
    post_trainingSchedule_Exercises,
    Post_ExercisesAdd,
    Exercise_cardio_frontend,
    Exercise_weighted_frontend,
    Post_Calendar_w_weight,
    Post_Calendar,
)


async def get_overview(partners: Dict):
    user_data = (
        session.execute(
            select(
                User.c.profile_picture,
                User.c.username,
                User.c.user_id,
                User.c.bio,
                User.c.nickname,
            ).where(User.c.user_id.in_(partners.keys()))
        )
        .mappings()
        .fetchall()
    )

    return [
        {
            "bio": data.get("bio"),
            "nickname": data.get("nickname"),
            "partner_name": data.get("username"),
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
            raise HTTPException(
                status_code=413, detail="Image size exceeds 16 MB")
        image_data = bytes(await profile_picture.read())
        user_data["profile_picture"] = image_data
    try:
        session.execute(
            User.update().where(User.c.user_id == user_id).values(user_data)
        )
        session.commit()
    except Exception as e:
        session.rollback()
        raise e


def get_user(name):
    result = session.execute(select(User).where(
        User.c.username == name)).fetchone()
    if result is not None:
        return result._asdict()

    return result


def insert_new_user(username: str, password: str):
    try:
        stmt = insert(User).values(
            username=username,
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
    return session.execute(select(User.c.username).select_from(User)).scalars().all()


async def save_exercise_rating(rating: int, exercise_id: int, user_id: int):
    if exercise_id:
        try:
            session.execute(
                insert(Individual_rating)
                .values(exercise_id=exercise_id, user_id=user_id, rating=rating)
                .on_duplicate_key_update(rating=rating)
            )
        except IntegrityError:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Exercise not found"
            )
        session.commit()
        return True
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Invalid exercise ID"
    )


def get_exercise_for_dialog(exercise_id: int, user_id: int):
    return parse_exercise_for_dialog(
        session.execute(
            select(
                Training_plan.c.training_id,
                Training_plan.c.training_name,
                Exercise.c.exercise_id,
            )
            .select_from(Training_plan)
            .where(Training_plan.c.user_id == user_id)
            .join(
                Exercise2Training_plan,
                Exercise2Training_plan.c.training_id == Training_plan.c.training_id,
                isouter=True,
            )
            .join(
                Exercise,
                Exercise2Training_plan.c.exercise_id == Exercise.c.exercise_id,
                isouter=True,
            )
        )
        .mappings()
        .fetchall(),
        exercise_id,
    )


async def find_trainingspartner(plz: str, matched_people: List[int]):
    try:
        partner = session.execute(
            select(
                User.c.username,
                User.c.user_id,
                User.c.profile_picture,
                User.c.nickname,
                User.c.bio,
            ).where(
                and_(
                    User.c.plz == plz,
                    User.c.searching_for_partner,
                    User.c.user_id.not_in(matched_people),
                )
            )
        ).first()
        if partner:
            return partner._asdict()
        else:
            return None
    except NoResultFound:
        return None


def get_general_exercise_info(exercise_id: int, user_id: int):
    info = session.execute(
        select(
            Exercise.c.exercise_id,
            Exercise.c.exercise_name,
            Exercise.c.description.label("exercise_text"),
            Individual_rating.c.rating.label("user_rating"),
        )
        .select_from(Exercise)
        .join(
            Individual_rating,
            and_(
                Individual_rating.c.exercise_id == Exercise.c.exercise_id,
                Individual_rating.c.user_id == user_id,
            ),
            isouter=True,
        )
        .where(Exercise.c.exercise_id == exercise_id)
    ).first()
    if info:
        return info._asdict()
    else:
        raise HTTPException(status_code=404, detail="Exercise not found")


def get_trainings(user_id: int):
    return parse_trainings(
        session.execute(
            select(
                Training_plan.c.training_id,
                Training_plan.c.training_name,
                Day.c.weekday,
                Exercise.c.exercise_name,
                Exercise.c.exercise_id,
                Exercise.c.constant_unit_of_measure,
                User_current_performance.c.minutes,
                User_current_performance.c.number_of_repetition,
                User_current_performance.c.number_of_sets,
                User_current_performance.c.trackable_unit_of_measure,
                User_current_performance.c.value_trackable_unit_of_measure,
            )
            .select_from(Training_plan)
            .join(
                Day,
                and_(
                    Day.c.training_id == Training_plan.c.training_id,
                    Day.c.user_id == Training_plan.c.user_id,
                ),
                isouter=True,
            )
            .join(
                Exercise2Training_plan,
                Exercise2Training_plan.c.training_id == Training_plan.c.training_id,
                isouter=True,
            )
            .join(
                Exercise,
                Exercise2Training_plan.c.exercise_id == Exercise.c.exercise_id,
                isouter=True,
            )
            .join(
                User_current_performance,
                and_(
                    Exercise.c.exercise_id == User_current_performance.c.exercise_id,
                    User_current_performance.c.training_id
                    == Training_plan.c.training_id,
                    User_current_performance.c.user_id == Training_plan.c.user_id,
                ),
                isouter=True,
            )
            .where(
                and_(
                    Training_plan.c.user_id == user_id,
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
                Exercise.c.exercise_name,
                Exercise.c.exercise_id,
                Exercise.c.constant_unit_of_measure,
                Average_rating.c.rating,
                Exercise.c.preview_image,
                Average_rating.c.total_exercise_ratings,
                Tags.c.tag_name,
                Tags2Exercises.c.is_primary_tag,
            )
            .select_from(Exercise)
            .join(
                Tags2Exercises,
                Exercise.c.exercise_id == Tags2Exercises.c.exercise_id,
                isouter=True,
            )
            .join(
                Tags,
                Tags.c.tag_id == Tags2Exercises.c.tag_id,
                isouter=True,
            )
            .join(
                Average_rating,
                Average_rating.c.exercise_id == Exercise.c.exercise_id,
                isouter=True,
            )
        )
        .mappings()
        .fetchall()
    )


def get_all_unique_tags():
    return session.execute(select(Tags.c.tag_name).select_from(Tags)).scalars().all()


def get_base_exercises(user_id: int):
    return (
        session.execute(
            select(
                Exercise.c.exercise_id,
                Exercise.c.exercise_name,
                Exercise.c.constant_unit_of_measure.label("exercise_type"),
            ).select_from(Exercise)
        )
        .mappings()
        .fetchall()
    )


def get_past_trainings_from_start_date(start_date: datetime, user_id: int):
    end_date = start_date + timedelta(days=6)
    return parse_past_or_future_trainings(
        session.execute(
            select(
                Training_plan_history.c.day,
                Training_plan_history.c.training_name,
                Training_plan_history.c.training_plan_history_id.label(
                    "training_id"),
                Exercise_history.c.excercise_history_id.label("exercise_id"),
                Exercise.c.exercise_name,
                Exercise_history.c.completed,
                Exercise.c.constant_unit_of_measure,
                Exercise_history.c.minutes,
                Exercise_history.c.number_of_repetition,
                Exercise_history.c.number_of_sets,
                Exercise_history.c.value_trackable_unit_of_measure,
                Exercise_history.c.trackable_unit_of_measure,
            )
            .select_from(Training_plan_history)
            .where(
                and_(
                    Training_plan_history.c.user_id == user_id,
                    Training_plan_history.c.day.between(start_date, end_date),
                )
            )
            .join(
                Exercise_history,
                Training_plan_history.c.training_plan_history_id
                == Exercise_history.c.training_plan_history_id,
                isouter=True,
            )
            .join(
                Exercise,
                Exercise.c.exercise_id == Exercise_history.c.exercise_id,
            )
        )
        .mappings()
        .fetchall(),
        start_date,
    )


def get_weekdays(date_diff: bool):
    if date_diff:
        return WEEKDAY_MAP.keys()
    days_start_ind = 6 - datetime.now().weekday()

    return [list(WEEKDAY_MAP.keys())[i * -1] for i in range(days_start_ind, 0, -1)]


def get_future_trainings_from_cur_date(
    user_id: int, date_diff: bool, start_date: datetime
):
    return parse_past_or_future_trainings(
        session.execute(
            select(
                Day.c.weekday.label("day"),
                Training_plan.c.training_name,
                Training_plan.c.training_id,
                Exercise.c.exercise_id,
                Exercise.c.exercise_name,
                literal(False).label("completed"),
                Exercise.c.constant_unit_of_measure,
                User_current_performance.c.minutes,
                User_current_performance.c.number_of_repetition,
                User_current_performance.c.number_of_sets,
                User_current_performance.c.value_trackable_unit_of_measure,
                User_current_performance.c.trackable_unit_of_measure,
            )
            .select_from(Day)
            .where(Day.c.user_id == user_id, Day.c.weekday.in_(get_weekdays(date_diff)))
            .join(Training_plan, Training_plan.c.training_id == Day.c.training_id)
            .join(
                Exercise2Training_plan,
                Training_plan.c.training_id == Exercise2Training_plan.c.training_id,
                isouter=True,
            )
            .join(
                Exercise,
                Exercise2Training_plan.c.exercise_id == Exercise.c.exercise_id,
            )
            .join(
                User_current_performance,
                and_(
                    User_current_performance.c.exercise_id == Exercise.c.exercise_id,
                    User_current_performance.c.user_id == user_id,
                    User_current_performance.c.training_id == Day.c.training_id,
                ),
                isouter=True,
            )
        )
        .mappings()
        .fetchall(),
        start_date,
    )


def save_trainings_data(trainings_data: post_trainingSchedule, user_id: int):
    exercise_ids = (
        session.execute(select(Exercise.c.exercise_id).select_from(Exercise))
        .scalars()
        .all()
    )

    if not {ex.exerciseId for ex in trainings_data.exercises}.issubset(exercise_ids):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE, detail="ExerciseId not found"
        )
    try:
        if trainings_data.trainingId < 0:
            insert_training = session.execute(
                insert(Training_plan).values(
                    training_name=trainings_data.name, user_id=user_id
                )
            )

            insert_Exercises2Trainings_plans(
                insert_training.inserted_primary_key[0], trainings_data.exercises
            )

            insert_days(
                trainings_data.onDays, user_id, insert_training.inserted_primary_key[0]
            )

            update_user_performance(
                trainings_data.exercises,
                user_id,
                insert_training.inserted_primary_key[0],
            )

            session.commit()
            return Response(status_code=status.HTTP_201_CREATED)
        else:
            if (
                not session.execute(
                    select(Training_plan.c.user_id).where(
                        Training_plan.c.training_id == trainings_data.trainingId
                    )
                ).scalar_one()
                == user_id
            ):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="No permission to edit training",
                )
            session.execute(
                update(Training_plan)
                .where(Training_plan.c.training_id == trainings_data.trainingId)
                .values(training_name=trainings_data.name)
            )

            current_days = (
                session.execute(
                    select(Day.c.weekday).where(
                        and_(
                            Day.c.training_id == trainings_data.trainingId,
                            Day.c.user_id == user_id,
                        )
                    )
                )
                .scalars()
                .all()
            )

            session.execute(
                delete(Day).where(
                    and_(
                        Day.c.user_id == user_id,
                        Day.c.training_id == trainings_data.trainingId,
                        Day.c.weekday.in_(
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
                    "training_id": trainings_data.trainingId,
                }
                for day in trainings_data.onDays
                if day not in current_days
            ]
            if len(days_to_insert) > 0:
                session.execute(insert(Day).values(days_to_insert))

            current_exercises2trainings = (
                session.execute(
                    select(Exercise2Training_plan.c.exercise_id).where(
                        Exercise2Training_plan.c.training_id
                        == trainings_data.trainingId,
                    )
                )
                .scalars()
                .all()
            )

            new_exercises = [ex.exerciseId for ex in trainings_data.exercises]

            session.execute(
                delete(Exercise2Training_plan).where(
                    Exercise2Training_plan.c.exercise_id.in_(
                        [
                            ex_id
                            for ex_id in current_exercises2trainings
                            if ex_id not in new_exercises
                        ]
                    )
                )
            )

            update_user_performance(
                trainings_data.exercises, user_id, trainings_data.trainingId
            )

            exercises_to_insert = [
                {
                    "training_id": trainings_data.trainingId,
                    "exercise_id": ex_id,
                }
                for ex_id in new_exercises
                if ex_id not in current_exercises2trainings
            ]
            if len(exercises_to_insert) > 0:
                session.execute(
                    insert(Exercise2Training_plan).values(exercises_to_insert)
                )
            session.commit()

            return Response(status_code=status.HTTP_202_ACCEPTED)

    except HTTPException as e:
        session.rollback()
        raise e
    except Exception as e:
        raise e
        session.rollback()
        return False


def update_user_performance(
    exercises: List[post_trainingSchedule_Exercises], user_id: int, training_id
):
    performances = [
        {
            "user_id": user_id,
            "exercise_id": exercise.exerciseId,
            "training_id": training_id,
            **get_user_performance_exercise(dict(exercise.exercise)),
        }
        for exercise in exercises
    ]
    insert_stmt = insert(User_current_performance).values(performances)
    if len(performances) > 0:
        session.execute(
            insert_stmt.on_duplicate_key_update(
                minutes=insert_stmt.inserted.minutes,
                number_of_repetition=insert_stmt.inserted.number_of_repetition,
                number_of_sets=insert_stmt.inserted.number_of_sets,
            )
        )


def get_user_performance_exercise(
    exercise: Union[Exercise_cardio_frontend, Exercise_weighted_frontend],
):
    return {
        "minutes": exercise["minutes"] if "minutes" in exercise else None,
        "number_of_repetition": exercise["repetitionAmount"]
        if "repetitionAmount" in exercise
        else None,
        "number_of_sets": exercise["setAmount"] if "setAmount" in exercise else None,
    }


def insert_days(days: List[str], user_id: int, training_id: int):
    day_values = [
        {
            "weekday": day,
            "user_id": user_id,
            "training_id": training_id,
        }
        for day in days
    ]
    if len(days) > 0:
        session.execute(insert(Day).values(day_values))
        session.commit()


def insert_Exercises2Trainings_plans(
    training_id: int, exercises: List[post_trainingSchedule_Exercises]
):
    if len(exercises) > 0:
        session.execute(
            insert(Exercise2Training_plan).values(
                [
                    {
                        "training_id": training_id,
                        "exercise_id": ex.exerciseId,
                    }
                    for ex in exercises
                ]
            )
        )
        session.commit()


def save_calendar_data(
    trainings: List[Union[Post_Calendar_w_weight, Post_Calendar]], user_id: int
):
    completed_case = case(
        *[
            (
                (
                    Exercise_history.c.excercise_history_id == exercise.exerciseId,
                    exercise.completed,
                )
            )
            for exercise in trainings
        ],
    )

    weight_case = case(
        *[
            (
                Exercise_history.c.excercise_history_id == exercise.exerciseId,
                exercise.weight
                if isinstance(exercise, Post_Calendar_w_weight)
                else None,
            )
            for exercise in trainings
        ]
    )

    exercise_ids = [exercise.exerciseId for exercise in trainings]

    session.execute(
        (
            update(Exercise_history)
            .where(
                and_(
                    Exercise_history.c.excercise_history_id.in_(exercise_ids),
                    Exercise_history.c.user_id
                    == user_id,  # prevents that other users can edit trainingsplan if they know the id
                )
            )
            .values(
                completed=completed_case, value_trackable_unit_of_measure=weight_case
            )
        )
    )

    session.commit()


def get_exercise_name_by_id(exercise_id: int):
    return session.execute(
        select(Exercise.c.exercise_name).where(
            Exercise.c.exercise_id == exercise_id)
    ).scalar_one()


def save_exercise_to_trainings(exercise_add: Post_ExercisesAdd, user_id: int):
    training_ids_to_insert = [d.trainingId for d in exercise_add.in_training]

    if len(training_ids_to_insert) > 0:
        session.execute(
            insert(Exercise2Training_plan).values(
                [
                    {"training_id": id_, "exercise_id": exercise_add.exercise_id}
                    for id_ in training_ids_to_insert
                ]
            )
        )
        session.commit()

    if len(training_ids_to_insert) > 0:
        performance_to_insert = [
            {
                "user_id": user_id,
                "exercise_id": exercise_add.exercise_id,
                "training_id": id_,
                **get_user_performance_exercise(dict(exercise_add.exercise)),
            }
            for id_ in training_ids_to_insert
        ]
        if len(performance_to_insert) > 0:
            session.execute(
                insert(User_current_performance).values(performance_to_insert)
            )
        session.commit()


def delete_training(training_id, user_id):
    session.execute(
        delete(Training_plan).where(
            and_(
                Training_plan.c.training_id == training_id,
                Training_plan.c.user_id == user_id,
            )
        )
    )
    session.commit()

    return True
