from fastapi import Query
from datetime import datetime
from fastapi import HTTPException, status
from typing import Optional, List
from custom_types import (
    post_trainingSchedule,
    WEEKDAY_MAP,
)


def INVALID_PRECONDITION(content: str):
    raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=content)


def validate_date(start_date: str = Query(...)):
    try:
        start_date = datetime.strptime(start_date, "%Y-%m-%d")
    except ValueError:
        INVALID_PRECONDITION("Invalid Date Format for parametere start_date")
    return start_date


def validate_plz(plz: Optional[str] = Query(None)):
    if plz and not len(plz) == 5:
        INVALID_PRECONDITION("invalid plz length")
    return plz


def validate_required_plz(plz: str = Query(...)):
    if not len(plz) == 5:
        INVALID_PRECONDITION("invalid plz length")

    return plz


def validate_rating(rating: float = Query(...)):
    if rating > 5 or rating < 1:
        INVALID_PRECONDITION("invalid rating")
    return rating


def validate_TrainingsData(trainingsData: post_trainingSchedule):
    if not {day for day in trainingsData.onDays}.issubset(WEEKDAY_MAP.keys()):
        INVALID_PRECONDITION("Weekday does not exist")
    if not {ex.exerciseType for ex in trainingsData.exercises}.issubset(
        ["SxWdh", "Min"]
    ):
        INVALID_PRECONDITION("Wrong exercise type")

    return trainingsData
