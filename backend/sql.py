from fastapi import HTTPException, UploadFile
from db_connection import session
from db_models import Users
from sqlalchemy import select, insert, and_
from sqlalchemy.exc import NoResultFound
from typing import List, Optional


async def insert_additional_user_data(profile_picture: Optional[UploadFile]):
    if profile_picture:
        max_size_bytes = 10 * 1024 * 1024  # 10 MB
        if profile_picture.file.seekable():
            profile_picture.file.seek(0, 2)
            size = profile_picture.file.tell()
            profile_picture.file.seek(0)
            if size > max_size_bytes:
                raise HTTPException(
                    status_code=413, detail="Image size exceeds 10 MB")
            image_data = await profile_picture.read()


def get_user(name):
    result = session.execute(select(Users).where(
        Users.c.user_name == name)).fetchone()
    if result is not None:
        return result._asdict()

    return result


def insert_new_user(username: str, password: str):
    try:
        stmt = insert(Users).values(user_name=username,
                                    password=password, expired=False)
        operation = session.execute(stmt)
        session.commit()
        return operation.is_insert
    except Exception as ex:
        session.rollback()
        raise ex


def get_all_usernames():
    return session.execute(select(Users.c.user_name).select_from(Users)).scalars().all()


async def find_trainingspartner(plz: str, matched_people: List[str]):
    try:
        return session.execute(select(Users.c.user_name).where(and_(Users.c.plz == plz, Users.c.searching_for_partner, Users.c.user_name.not_in(matched_people)))).scalar_one()
    except NoResultFound:
        return None
