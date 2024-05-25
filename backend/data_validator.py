from fastapi import Query
from datetime import datetime
from fastapi import HTTPException, status
from typing import Optional


def INVALID_PRECONDITION(content: str):
    raise HTTPException(status_code=status.HTTP_412_PRECONDITION_FAILED, detail=content)


def validate_date(date: str = Query(...)):
    try:
        start_date = datetime.strptime(date, "%Y-%m-%d")
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


def validate_rating(rating: int = Query(...)):
    if rating > 5 or rating < 1:
        INVALID_PRECONDITION("invalid rating")
    return rating
