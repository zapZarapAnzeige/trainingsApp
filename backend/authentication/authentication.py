from fastapi import Depends, FastAPI, HTTPException, status, Request, WebSocket
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from dotenv import load_dotenv
from os import getenv
from sql import get_user, insert_new_user, get_all_usernames

from passlib.context import CryptContext
from jose import JWTError, jwt
from custom_types import Token_data, User, User_in_db
from passlib.hash import bcrypt
load_dotenv("../.env")

getenv("SECRET_KEY")


class CustomOAuth2PasswordBearer(OAuth2PasswordBearer):
    async def __call__(self, request: Request = None, websocket: WebSocket = None):
        return await super().__call__(request or websocket)


pwd_context = CryptContext(schemes=[bcrypt], deprecated="auto")
oauth_scheme = CustomOAuth2PasswordBearer(
    tokenUrl="api/v1/login", auto_error=False)


ALGORITHM = 'HS256'


def verify_pwd(plain_pwd: str, hashed_pwd: str):
    return pwd_context.verify(plain_pwd, hashed_pwd, scheme='bcrypt')


def create_new_user(username: str, password: str):
    usernames = get_all_usernames()
    if (username in usernames):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"incorrect username {username} alredy exists", headers={"WWW-Authenticate": "Bearer"})
    insert_new_user(username, get_pwd_hash(password))


def get_pwd_hash(plain_pwd):
    return pwd_context.hash(plain_pwd)


def authenticate_user(user_name, password):
    user = get_user(user_name)
    if not user:
        return False
    if not verify_pwd(password, user['password']):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta or None = None):
    to_encode = data.copy()
    if expires_delta:
        expires = datetime.utcnow()+expires_delta
    else:
        expires = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expires})
    encoded_jwt = jwt.encode(to_encode, getenv(
        "SECRET_KEY"), algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth_scheme)):

    credential_exception = HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                         detail="Could not Authenticate User", headers={"WWW-Authenticate": "Bearer"})

    try:
        payload = jwt.decode(token, getenv("SECRET_KEY"),
                             algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise credential_exception
    except JWTError as err:
        print(err)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Token has expired", headers={"WWW-Authenticate": "Bearer"})

    user = get_user(username)

    if user is None:
        raise credential_exception

    return user


async def get_current_active_user(current_user: User_in_db = Depends(get_current_user)):
    if current_user['expired']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive User")
    return current_user
