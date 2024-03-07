from db_connection import session
from db_models import Users
from sqlalchemy import select, insert, and_
from sqlalchemy.exc import NoResultFound
from typing import List


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
