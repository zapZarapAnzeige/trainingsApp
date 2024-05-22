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
    minutes: int
    number_of_repetition: int
    number_of_sets: int


class Unformatted_exercises(BaseModel):
    exercise_name: str
    exercise_id: int
    constant_unit_of_measure: Optional[str]
    rating: Optional[int]
    total_exercise_ratings: Optional[int]
    minutes: Optional[int]
    number_of_repetition: Optional[int]
    number_of_sets: Optional[int]
    value_trackable_unit_of_measure: Optional[float]
    trackable_unit_of_measure: Optional[str]
    tag_name: Optional[str]
    is_primary_tag: Optional[bool]


class Exercise_cardio(TypedDict):
    minutes: int


class Exercise_weighted(TypedDict):
    number_of_repetition: int
    number_of_sets: int


class Base_exercise(TypedDict):
    exercise_name: str
    exercise_id: int
    exercise_type: str
    exercise: Union[Exercise_cardio, Exercise_weighted]


class Tags(TypedDict):
    primary_tags: List[str]
    secondary_tags: List[str]


class Formatted_exercises(Base_exercise, Tags):
    rating: float
    reviews: int


class ExerciseCardio(BaseModel):
    minutes: float


class ExerciseWeighted(BaseModel):
    repetition_amount: int
    set_amount: int


class ExerciseDetail(BaseModel):
    exercise_id: int
    exercise_name: str
    exercise: Union[ExerciseCardio, ExerciseWeighted]


class formatted_trainingsdata(BaseModel):
    name: str
    trainings_id: int
    on_days: List[str]
    exercises: List[ExerciseDetail]
