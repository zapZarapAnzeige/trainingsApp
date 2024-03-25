import base64
from fastapi import HTTPException, UploadFile, Response
from db_connection import session
from db_models import Users
from sqlalchemy import select, insert, and_
from sqlalchemy.exc import NoResultFound
from typing import Dict, List, Optional


async def get_overview(partners: Dict):
    user_data = (
        session.execute(
            select(Users.c.profile_picture, Users.c.user_name, Users.c.user_id).where(
                Users.c.user_id.in_(partners.keys())
            )
        )
        .mappings()
        .fetchall()
    )

    return [{
        "partner_name": data.get("user_name"),
        **partners[data.get("user_id")],
        "profile_picture": base64.b64encode(data.get("profile_picture")).decode(
            "utf-8"
        ) if data.get("profile_picture") else None,
    }for data in user_data]


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
    result = session.execute(select(Users).where(
        Users.c.user_name == name)).fetchone()
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


async def find_trainingspartner(plz: str, matched_people: List[int]):
    try:
        partner = session.execute(
            select(Users.c.user_name, Users.c.user_id).where(
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
