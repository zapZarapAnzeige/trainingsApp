import base64
from fastapi import HTTPException, UploadFile, Response, status
from db_connection import session
from db_models import (
    Users,
    Excercises,
    Individual_Excercise_Ratings,
    Overall_Excercise_Ratings,
    Trainings_plan,
    Trainings_plan2Days,
    Trainings_plan2Excercise,
)
from sqlalchemy.dialects.mysql import insert
from sqlalchemy import select, and_
from sqlalchemy.exc import NoResultFound
from typing import Dict, List, Optional


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


async def save_excercise_rating(rating: int, excercise: str, user_id: int):
    excercise_id = session.execute(
        select(Excercises.c.excercise_id).where(
            Excercises.c.excercise_name == excercise
        )
    ).scalar_one()
    if excercise_id:
        session.execute(
            insert(Individual_Excercise_Ratings)
            .values(excercise_id=excercise_id, user_id=user_id, rating=rating)
            .on_duplicate_key_update(rating=rating)
        )
        session.commit()
        return {"inserted": True}
    return Response(
        status_code=status.HTTP_404_NOT_FOUND, content="Invalid excercise ID"
    )


def get_excercise_for_dialog(excercise_name: str, user_id: int):
    result = (
        session.execute(
            select(
                Trainings_plan.c.trainings_id,
                Trainings_plan.c.trainings_name,
                Excercises.c.excercise_name,
            )
            .select_from(Trainings_plan)
            .where(and_(Trainings_plan.c.user_id == user_id))
            .join(
                Trainings_plan2Excercise,
                Trainings_plan2Excercise.c.trainings_id
                == Trainings_plan.c.trainings_id,
                isouter=True,
            )
            .join(
                Excercises,
                Trainings_plan2Excercise.c.excercise_id == Excercises.c.excercise_id,
                isouter=True,
            )
        )
        .mappings()
        .fetchall()
    )
    in_training = {}
    not_in_training = {}
    for val in result:
        if val["excercise_name"] == excercise_name:
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


def get_excercise_not_in_training(excercise_name: str, user_id: int):
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
        if partner:
            return partner._asdict()
        else:
            return None
    except NoResultFound:
        return None


def get_general_excercise_info(excercise: str, user_id: int):
    info = session.execute(
        select(
            Excercises.c.excercise_id,
            Excercises.c.excercise_name,
            Excercises.c.description,
            Individual_Excercise_Ratings.c.rating,
        )
        .select_from(Excercises)
        .join(
            Individual_Excercise_Ratings,
            and_(
                Individual_Excercise_Ratings.c.excercise_id
                == Excercises.c.excercise_id,
                Individual_Excercise_Ratings.c.user_id == user_id,
            ),
            isouter=True,
        )
        .where(Excercises.c.excercise_name == excercise)
    ).first()
    if info:
        return info._asdict()
    else:
        raise HTTPException(status_code=404, detail="Excercise not found")
