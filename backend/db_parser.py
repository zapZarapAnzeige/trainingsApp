from typing import List, Union
from custom_types import (
    Unformatted_trainingsdata,
    formatted_trainingsdata,
    Unformatted_exercises,
    Formatted_exercises,
    Base_exercise,
)


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
                if element["trainings_id"] == d.trainings_id
            ),
            None,
        )
        if obj is None:
            formatted_data.append(
                {
                    "trainings_id": d.trainings_id,
                    "name": d.trainings_name,
                    "on_days": [d.weekday],
                    "exercises": [get_exercise_formatted(d)]
                    if d.exercise_id is not None
                    else [],
                }
            )
        else:
            if d.weekday not in obj["on_days"]:
                obj["on_days"].append(d.weekday)
            if d.exercise_id not in [ex["exercise_id"] for ex in obj["exercises"]]:
                obj["exercises"].append(get_exercise_formatted(d))
    return check_if_data_exists(formatted_data, "trainings_id")


def get_exercise_formatted(d):
    return {
        "exercise_id": d.exercise_id,
        "exercise_name": d.exercise_name,
        "exercise": {"minutes": d.minutes}
        if d.constant_unit_of_measure == "Min"
        else {
            "repetition_amount": d.number_of_repetition,
            "set_amount": d.number_of_sets,
        },
    }


def parse_exercises(data: List, is_base_user_data: bool = False):
    formatted_data: List[Union[Formatted_exercises, Base_exercise]] = []
    for d in data:
        if is_base_user_data:
            obj = None
        else:
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
                    "exercise_type": d["constant_unit_of_measure"],
                    "exercise_name": d["exercise_name"],
                    "exercise_id": d["exercise_id"],
                    "exercise": {"minutes": d["minutes"]}
                    if d["constant_unit_of_measure"] == "Min"
                    else {
                        "repetition_amount": d["number_of_repetition"],
                        "set_amount": d["number_of_sets"],
                    },
                    **get_exteded_user_data(d, is_base_user_data),
                }
            )

    return formatted_data


def get_exteded_user_data(d, is_base_user_data):
    if is_base_user_data:
        return {}
    ret = {
        "rating": d["rating"],
        "reviews": d["total_exercise_ratings"],
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
