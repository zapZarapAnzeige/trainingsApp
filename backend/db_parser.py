from typing import List, Union
from custom_types import (
    Unformatted_trainingsdata,
    formatted_trainingsdata,
    Unformatted_exercises,
    Formatted_exercises,
    unformatted_past_or_future_trainings_data,
    formatted_history_trainings_data,
    WEEKDAY_MAP,
)
import base64
from datetime import datetime, timedelta, date


def check_if_data_exists(data, primary_column):
    if len(data) == 1:
        if data[0].get(primary_column) is None:
            return []

    return data


def parse_trainings(data: List[Unformatted_trainingsdata]):
    formatted_data: List[formatted_trainingsdata] = []
    for d in data:
        obj = next(
            (
                element
                for element in formatted_data
                if element["training_id"] == d.training_id
            ),
            None,
        )
        if obj is None:
            formatted_data.append(
                {
                    "training_id": d.training_id,
                    "name": d.training_name,
                    "on_days": [d.weekday] if d.weekday else [],
                    "exercises": [
                        get_exercise_formatted(
                            d, {}, {"exercise_type": d.constant_unit_of_measure}
                        )
                    ]
                    if d.exercise_id
                    else []
                    if d.exercise_id is not None
                    else [],
                }
            )
        else:
            if d.weekday not in obj["on_days"] and d.weekday:
                obj["on_days"].append(d.weekday)
            if (
                d.exercise_id not in [ex["exercise_id"]
                                      for ex in obj["exercises"]]
                and d.exercise_id
            ):
                obj["exercises"].append(
                    get_exercise_formatted(
                        d, {}, {"exercise_type": d.constant_unit_of_measure}
                    )
                )
    return check_if_data_exists(formatted_data, "training_id")


def get_exercise_formatted(d, additional_exercise_data={}, additional_data={}):
    return {
        **additional_data,
        "exercise_id": d.exercise_id,
        "exercise_name": d.exercise_name,
        "exercise": {"minutes": d.minutes, **additional_exercise_data}
        if d.constant_unit_of_measure == "Min"
        else {
            "repetition_amount": d.number_of_repetition,
            "set_amount": d.number_of_sets,
            **additional_exercise_data,
        },
    }


def parse_exercises(data: List[Unformatted_exercises]):
    formatted_data: List[Formatted_exercises] = []
    for d in data:
        obj = next(
            (
                element
                for element in formatted_data
                if element["exercise_id"] == d["exercise_id"]
            ),
            None,
        )
        if obj:
            if d["is_primary_tag"]:
                add_tag(obj, "primary_tags", d["tag_name"])
            else:
                add_tag(obj, "secondary_tags", d["tag_name"])
        else:
            formatted_data.append(
                {
                    "preview_image": base64.b64encode(d.get("preview_image")).decode(
                        "utf-8"
                    )
                    if d.get("preview_image")
                    else None,
                    "exercise_type": d["constant_unit_of_measure"],
                    "exercise_name": d["exercise_name"],
                    "exercise_id": d["exercise_id"],
                    "exercise": {
                        "minutes": 0,
                    }
                    if d["constant_unit_of_measure"] == "Min"
                    else {
                        "repetition_amount": 0,
                        "set_amount": 0,
                    },
                    **get_exteded_user_data(d),
                }
            )

    return formatted_data


def get_exteded_user_data(d):
    ret = {
        "rating": d["rating"] if d["rating"] else 0,
        "reviews": d["total_exercise_ratings"] if d["total_exercise_ratings"] else 0,
    }
    if not d["tag_name"]:
        return {"secondary_tags": [], "primary_tags": [], **ret}
    if d["is_primary_tag"]:
        return {"secondary_tags": [], "primary_tags": [d["tag_name"]], **ret}
    else:
        return {"secondary_tags": [d["tag_name"]], "primary_tags": [], **ret}


def add_tag(obj, tag_type, tag_name):
    if tag_name not in obj[tag_type]:
        obj[tag_type].append(tag_name)


def parse_past_or_future_trainings(
    data: List[unformatted_past_or_future_trainings_data], start_date: datetime
):
    formatted_data: List[formatted_history_trainings_data] = []
    for d in data:
        trainings_day_obj = next(
            (
                element
                for element in formatted_data
                if element["date"] == get_date_from_weekday(d["day"], start_date)
            ),
            None,
        )
        exercise_obj = {
            **get_exercise_formatted(
                d,
                {
                    "trackable_unit_of_measure": d.trackable_unit_of_measure,
                    "value_trackable_unit_of_measure": d.value_trackable_unit_of_measure,
                },
            ),
            "exercise_type": d["constant_unit_of_measure"],
            "completed": d["completed"],
        }

        trainings_obj = {
            "training_name": d["training_name"],
            "training_id": d["training_id"],
            "exercises": [exercise_obj],
        }
        if trainings_day_obj:
            obj = next(
                (
                    element
                    for element in trainings_day_obj["trainings"]
                    if element["training_id"] == d["training_id"]
                ),
                None,
            )
            if obj:
                obj["exercises"].append(exercise_obj)
            else:
                trainings_day_obj["trainings"].append(trainings_obj)
        else:
            formatted_data.append(
                {
                    "date": get_date_from_weekday(d["day"], start_date),
                    "trainings": [trainings_obj],
                }
            )
    return formatted_data


def get_date_from_weekday(
    day: Union[datetime, str], date_of_monday: datetime = datetime.now()
):
    if day not in WEEKDAY_MAP.keys():
        return day
    dif_from_curdate = WEEKDAY_MAP.get(day) - date_of_monday.weekday()
    return date_of_monday.date() + timedelta(days=dif_from_curdate)


def parse_exercise_for_dialog(data, exercise_id: int):
    in_training = {}
    not_in_training = {}
    for d in data:
        if d["exercise_id"] == exercise_id:
            in_training[d["training_id"]] = d
        else:
            not_in_training[d["training_id"]] = {
                **d, "exercise_id": exercise_id}

    for k in list(not_in_training.keys()):
        if k in in_training.keys():
            del not_in_training[k]
    return {
        "in_training": list(in_training.values()),
        "not_in_training": list(not_in_training.values()),
    }
