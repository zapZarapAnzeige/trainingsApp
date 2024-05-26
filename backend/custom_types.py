from pydantic import BaseModel
from typing import Optional, List, Any
from fastapi.types import Union
from typing_extensions import TypedDict
from datetime import datetime


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
    preview_image: Any
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
    minutes: Optional[int]


class Exercise_weighted(TypedDict):
    number_of_repetition: Optional[int]
    number_of_sets: Optional[int]


class Exercise_weighted_formatted(BaseModel):
    repetition_amount: Optional[int]
    set_amount: Optional[int]


class Exercise_weighted_formatted_trackable_measurement(Exercise_weighted_formatted):
    trackable_unit_of_measure: Optional[str] = None
    value_trackable_unit_of_measure: Optional[float] = None


class Exercise_weighted_trackable_measurement(Exercise_weighted):
    trackable_unit_of_measure: Optional[str] = None
    value_trackable_unit_of_measure: Optional[float] = None


class Exercise_cardio_trackable_measurement(Exercise_weighted):
    trackable_unit_of_measure: Optional[str] = None
    value_trackable_unit_of_measure: Optional[float] = None


class Base_exercise(TypedDict):
    exercise_name: str
    exercise_id: int
    exercise_type: str


class Tags(TypedDict):
    primary_tags: List[str]
    secondary_tags: List[str]


class Formatted_exercises(Base_exercise, Tags):
    rating: Optional[float]
    reviews: Optional[int]
    preview_image: Optional[str]


class ExerciseDetail(BaseModel):
    exercise_id: int
    exercise_name: str
    exercise: Union[
        Exercise_cardio,
        Exercise_weighted_formatted,
        Exercise_weighted,
        Exercise_cardio_trackable_measurement,
        Exercise_weighted_formatted_trackable_measurement,
        Exercise_weighted_trackable_measurement,
    ]


class formatted_trainingsdata(BaseModel):
    name: str
    trainings_id: int
    on_days: List[str]
    exercises: List[ExerciseDetail]


class unformatted_past_or_future_trainings_data(BaseModel):
    day: Union[datetime, str]
    trainings_name: str
    trainings_id: int
    exercise_id: int
    exercise_name: str
    completed: bool
    constant_unit_of_measure: Optional[str]
    minutes: Optional[int]
    number_of_repetition: Optional[int]
    number_of_sets: int
    trackable_unit_of_measure: Optional[str]
    value_trackable_unit_of_measure: Optional[float]


class exercise_history(BaseModel):
    exercise_name: str
    exercises_id: int
    exercise_type: str
    completed: bool
    exercise: Union[
        Exercise_cardio,
        Exercise_weighted_formatted,
        Exercise_weighted,
        Exercise_cardio_trackable_measurement,
        Exercise_weighted_formatted_trackable_measurement,
        Exercise_weighted_trackable_measurement,
    ]


class trainings_history(BaseModel):
    trainings_name: str
    trainings_id: int
    exercises: List[exercise_history]


class formatted_history_trainings_data(BaseModel):
    date: datetime
    trainings: List[trainings_history]


class response_model_exercisesInfo(BaseModel):
    video: Optional[str]
    exercise_id: int
    exercise_name: str
    description: Optional[str]
    rating: Optional[int]


class response_model_users_me(BaseModel):
    user_id: int
    profile_picture: Optional[str]
    nickname: Optional[str]
    user_name: str
    plz: Optional[int]
    searching_for_partner: bool
    bio: Optional[str]


class response_model_chat_content(TypedDict):
    content: str
    sender: int
    timestamp: datetime


class response_model_get_chats(BaseModel):
    bio: Optional[str]
    nickname: Optional[str]
    partner_name: str
    partner_id: int
    last_message: Optional[str]
    unread_messages: int
    last_message_timestamp: datetime
    disabled: bool
    last_sender_id: int
    profile_picture: Optional[str]


class response_model_post_chat(BaseModel):
    user_name: str
    user_id: int
    profile_picture: Optional[str]
    nickname: Optional[str]
    bio: Optional[str]


class Exercise_cardio_frontend(BaseModel):
    repetitionAmount: int
    setAmount: int


class Exercise_weighted_frontend(BaseModel):
    minutes: int


class post_trainingSchedule_Exercises(BaseModel):
    exerciseName: str
    exerciseId: int
    exerciseType: str
    exercise: Union[Exercise_cardio_frontend, Exercise_weighted_frontend]


class post_trainingSchedule(BaseModel):
    name: str
    trainingsId: int
    onDays: List[str]
    exercises: List[post_trainingSchedule_Exercises]


class post_Calendar(BaseModel):
    exerciseId: int
    completed: bool
    weight: int


WEEKDAY_MAP = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}
