from typing import List
from custom_types import Unformatted_trainingsdata


def check_if_data_exists(data, primary_column):
    if len(data) == 1:
        if data[0].get(primary_column) == None:
            return []

    return data


def parse_trainings(data: List[Unformatted_trainingsdata]):
    formatted_data = []
    for d in data:
        pass
