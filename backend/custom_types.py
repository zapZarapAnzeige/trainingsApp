from pydantic import BaseModel


class Message_json(BaseModel):
    content: str
    recipiant: str


class Token(BaseModel):
    access_token: str
    token_type: str
    expires_in: int


class User_name_id(BaseModel):
    user_id: int
    user_name: str


class Token_data(BaseModel):
    user_name: str or None = None


class User(BaseModel):
    user_name: str
    expired: bool or None = None


class User_in_db(User):
    hashed_password: str
    user_name: str
