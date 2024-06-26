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
    username: str


class Token_data(BaseModel):
    username: str or None = None


class User(BaseModel):
    username: str
    expired: bool or None = None


class User_in_db(User):
    hashed_password: str
    username: str


class Unformatted_trainingsdata(TypedDict):
    training_id: int
    training_name: str
    weekday: str
    exercise_name: Optional[str]
    exercise_id: Optional[int]
    constant_unit_of_measure: str
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
    value_trackable_unit_of_measure: Optional[Union[float, int]]
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
    trackable_unit_of_measure: Optional[str]
    value_trackable_unit_of_measure: Optional[Union[float, int]]


class Exercise_weighted_trackable_measurement(Exercise_weighted):
    trackable_unit_of_measure: Optional[str]
    value_trackable_unit_of_measure: Optional[Union[float, int]]


class Exercise_cardio_trackable_measurement(Exercise_cardio):
    trackable_unit_of_measure: Optional[str]
    value_trackable_unit_of_measure: Optional[Union[float, int]]


class Base_exercise(TypedDict):
    exercise_name: str
    exercise_id: int
    exercise_type: str


class Tags(TypedDict):
    primary_tags: List[str]
    secondary_tags: List[str]


class ExerciseDetail(BaseModel):
    exercise_id: int
    exercise_name: str
    exercise_type: Optional[str]
    exercise: Union[
        Exercise_cardio,
        Exercise_weighted_formatted,
        Exercise_weighted,
        Exercise_cardio_trackable_measurement,
        Exercise_weighted_formatted_trackable_measurement,
        Exercise_weighted_trackable_measurement,
    ]


class Formatted_exercises(Base_exercise, Tags):
    rating: Optional[float]
    reviews: Optional[int]
    preview_image: Optional[str]
    exercise: Union[
        Exercise_cardio,
        Exercise_weighted_formatted,
        Exercise_weighted,
    ]


class formatted_trainingsdata(BaseModel):
    name: str
    training_id: int
    on_days: List[str]
    exercises: List[ExerciseDetail]


class unformatted_past_or_future_trainings_data(BaseModel):
    day: Union[datetime, str]
    training_name: str
    training_id: int
    exercise_id: int
    exercise_name: str
    completed: bool
    constant_unit_of_measure: Optional[str]
    minutes: Optional[int]
    number_of_repetition: Optional[int]
    number_of_sets: int
    trackable_unit_of_measure: Optional[str]
    value_trackable_unit_of_measure: Optional[Union[float, int]]


class exercise_history(BaseModel):
    exercise_name: str
    exercise_id: int
    exercise_type: str
    completed: bool
    exercise: Union[
        Exercise_cardio_trackable_measurement,
        Exercise_weighted_formatted_trackable_measurement,
        Exercise_weighted_trackable_measurement,
        Exercise_weighted,
        Exercise_cardio,
        Exercise_weighted_formatted,
    ]


class trainings_history(BaseModel):
    training_name: str
    training_id: int
    exercises: List[exercise_history]


class formatted_history_trainings_data(BaseModel):
    date: datetime
    trainings: List[trainings_history]


class response_model_exercisesInfo(BaseModel):
    exercise_id: int
    exercise_name: str
    exercise_text: Optional[str]
    user_rating: Optional[int]


class response_model_users_me(BaseModel):
    user_id: int
    profile_picture: Optional[str]
    nickname: Optional[str]
    username: str
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
    username: str
    user_id: int
    profile_picture: Optional[str]
    nickname: Optional[str]
    bio: Optional[str]


class Exercise_cardio_frontend(BaseModel):
    repetitionAmount: Optional[int]
    setAmount: Optional[int]


class Exercise_weighted_frontend(BaseModel):
    minutes: Optional[int]


class post_trainingSchedule_Exercises(BaseModel):
    exerciseName: str
    exerciseId: int
    exerciseType: Optional[str]
    exercise: Union[Exercise_cardio_frontend, Exercise_weighted_frontend]


class post_trainingSchedule(BaseModel):
    name: str
    trainingId: int
    onDays: List[str]
    exercises: List[post_trainingSchedule_Exercises]


class Post_Calendar_w_weight(BaseModel):
    exerciseId: int
    completed: bool
    weight: Optional[int]


class Post_Calendar(BaseModel):
    exerciseId: int
    completed: bool


class In_training_camel_case(BaseModel):
    exerciseId: int
    trainingId: int
    trainingName: str


class In_training(BaseModel):
    exercise_id: int
    training_id: int
    training_name: str


class Post_ExercisesAdd(BaseModel):
    in_training: List[In_training_camel_case]
    exercise_id: int
    exercise: Union[Exercise_cardio_frontend, Exercise_weighted_frontend]


class Response_model_ExercisesAdd(BaseModel):
    in_training: List[In_training]
    not_in_training: List[In_training]


WEEKDAY_MAP = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}
