from db_connection import session
from db_models import Users
from sqlalchemy import select, insert, and_
from typing import List
from no_sql import get_all_chats_from_user


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


async def find_trainingspartner(plz: str,  user_name):
    already_matched_people = await get_all_chats_from_user(user_name)
    already_matched_people.append(user_name)
    print(already_matched_people)
    return session.execute(select(Users.c.user_name, Users.c.user_id).where(and_(Users.c.plz == plz, Users.c.searching_for_partner, Users.c.user_name.not_in(already_matched_people)))).mappings().fetchone()
