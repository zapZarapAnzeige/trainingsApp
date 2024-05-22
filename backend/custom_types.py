from pydantic import BaseModel
from typing import TypedDict, Optional, Union, List


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


class Unformatted_trainingsdata(TypedDict):
    trainings_id: int
    trainings_name: str
    weekday: str
    exercise_name: Optional[str]
    exercise_id: Optional[int]
    weight: float
    minutes: int
    number_of_repetition: int
    number_of_sets: int


class ExerciseCardio(BaseModel):
    minutes: float


class ExerciseWeighted(BaseModel):
    repetition_amount: int
    set_amount: int
    weight: int


class ExerciseDetail(BaseModel):
    exercise_id: int
    exercise_name: str
    exercise: Union[ExerciseCardio, ExerciseWeighted]


class formatted_trainingsdata(BaseModel):
    name: str
    trainings_id: int
    on_days: List[str]
    exercises: List[ExerciseDetail]
