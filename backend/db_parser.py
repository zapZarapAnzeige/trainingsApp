from typing import List
from custom_types import Unformatted_trainingsdata, formatted_trainingsdata


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
            "weight": d.weight,
        },
    }
