import base64
from typing import Optional, List, Union
from fastapi import FastAPI, Depends, WebSocket, UploadFile, File, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sql import (
    get_overview,
    get_profile_pic,
    find_trainingspartner,
    update_user_data,
    save_exercise_rating,
    get_exercise_for_dialog,
    get_general_exercise_info,
    get_trainings,
    get_all_exercises_for_user,
    get_all_unique_tags,
    get_base_exercises,
    get_future_trainings_from_cur_date,
    get_past_trainings_from_start_date,
    save_trainings_data,
    save_calendar_data,
    get_exercise_name_by_id,
    save_exercise_to_trainings,
)
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException
from authentication.authentication import (
    get_current_active_user,
    authenticate_user,
    create_access_token,
    create_new_user,
)
from custom_types import (
    Token,
    formatted_history_trainings_data,
    Base_exercise,
    Formatted_exercises,
    formatted_trainingsdata,
    response_model_exercisesInfo,
    response_model_users_me,
    response_model_chat_content,
    response_model_get_chats,
    response_model_post_chat,
    post_trainingSchedule,
    Post_Calendar,
    Post_Calendar_w_weight,
    Post_ExercisesAdd,
    Response_model_ExercisesAdd,
)
from datetime import timedelta, datetime
from fastapi.responses import JSONResponse
from chat_ws import get_cookie_or_token, handle_session
from no_sql import (
    get_chat_partners,
    get_all_chats_from_user,
    get_content_of_chat,
    insert_new_partner,
    upload_video,
    get_video_by_id,
    block_user,
    unblock_user,
    get_video_by_name,
)
from data_validator import (
    validate_date,
    validate_plz,
    validate_required_plz,
    validate_rating,
    validate_TrainingsData,
)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.put("/user", response_model=bool)
async def upload_user_data(
    profile_picture: Optional[UploadFile] = File(None),
    plz: Optional[str] = Depends(validate_plz),
    searching_for_partner: Optional[bool] = None,
    bio: Optional[str] = None,
    nickname: Optional[str] = None,
    current_user=Depends(get_current_active_user),
):
    user_data = {}

    if plz:
        user_data["plz"] = plz
    if bio:
        user_data["bio"] = bio
    if nickname:
        user_data["nickname"] = nickname
    if searching_for_partner is not None:
        user_data["searching_for_partner"] = searching_for_partner
        await update_user_data(profile_picture, current_user.get("user_id"), user_data)
    return True


@app.websocket("/chat")
async def chat(*, websocket: WebSocket, current_user=Depends(get_cookie_or_token)):
    await websocket.accept()
    await handle_session(websocket, current_user.get("user_id"))


@app.post("/chat", response_model=Union[None, str, response_model_post_chat])
async def find_partner(
    plz: str = Depends(validate_required_plz),
    current_user=Depends(get_current_active_user),
):
    user_id = current_user.get("user_id")
    matched_persons = await get_all_chats_from_user(user_id)
    new_match = await find_trainingspartner(plz, matched_persons)
    is_inserted = await insert_new_partner(user_id, new_match)
    if is_inserted:
        if new_match["profile_picture"]:
            new_match["profile_picture"] = base64.b64encode(
                new_match["profile_picture"]
            ).decode("utf-8")
        return new_match
    else:
        return "No people to match found"


@app.get("/chats", response_model=List[response_model_get_chats])
async def get_chat_overview(current_user=Depends(get_current_active_user)):
    partners = await get_chat_partners(current_user.get("user_id"))

    return await get_overview(partners)


@app.patch("/chat", response_model=bool)
async def update_chat_disabled(
    currently_blocked: bool,
    partner_id: int,
    current_user=Depends(get_current_active_user),
):
    if currently_blocked:
        return await unblock_user(current_user.get("user_id"), partner_id) > 0
    else:
        return await block_user(current_user.get("user_id"), partner_id) > 0


@app.get("/chat/content", response_model=List[response_model_chat_content])
async def get_chat_content(
    partner_id: int, current_user=Depends(get_current_active_user)
):
    if partner_id == current_user.get("user_id"):
        return Response(
            status_code=status.HTTP_412_PRECONDITION_FAILED,
            content="sender and recipiant must not be the same",
        )
    return await get_content_of_chat(partner_id, current_user.get("user_id"))


@app.post("/video")
async def upload_file(file: UploadFile = File(...)):
    return await upload_video(file)


@app.get(
    "/files/{file_id}", responses={200: {"content": {"application/octet-stream": {}}}}
)
async def get_video(file_id: str):
    return await get_video_by_id(file_id)


@app.get(
    "/picture",
    responses={200: {"content": {"image/png": {}}}},
)
async def get_users(current_user=Depends(get_current_active_user)):
    return get_profile_pic(current_user.get("user_id"))


@app.post("/api/v1/signUp", response_model=bool)
async def sign_up(form_data: OAuth2PasswordRequestForm = Depends()):
    return create_new_user(form_data.username, form_data.password)


@app.post("/api/v1/login", response_model=Token)
async def access_token_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(hours=8)
    access_token = create_access_token(
        data={"sub": user["user_name"]}, expires_delta=access_token_expires
    )
    response = JSONResponse(
        content={
            "access_token": access_token,
            "expires_in": access_token_expires.seconds,
            "token_type": "Bearer",
        }
    )
    return response


@app.post("/ExerciseRating", response_model=bool)
async def post_exercise_rating(
    exercise_id: int,
    rating: float = Depends(validate_rating),
    current_user=Depends(get_current_active_user),
):
    return await save_exercise_rating(rating, exercise_id, current_user.get("user_id"))


@app.get("/users/me", response_model=response_model_users_me)
async def get_user_data(current_user=Depends(get_current_active_user)):
    del current_user["password"]
    del current_user["expired"]
    profile_picture = {
        "profile_picture": base64.b64encode(current_user.pop("profile_picture")).decode(
            "utf-8"
        )
        if current_user.get("profile_picture")
        else None
    }
    return {**current_user, **profile_picture}


@app.get("/exercisesAdd", response_model=Response_model_ExercisesAdd)
async def get_exercise_add(
    exercise_id: int, current_user=Depends(get_current_active_user)
):
    return get_exercise_for_dialog(exercise_id, current_user.get("user_id"))


@app.get("/exercisesInfo", response_model=response_model_exercisesInfo)
async def get_exercise_info(
    exercise_id: int, current_user=Depends(get_current_active_user)
):
    exercise_name = get_exercise_name_by_id(exercise_id)
    return {
        "video": await get_video_by_name(exercise_name),
        **get_general_exercise_info(exercise_id, current_user.get("user_id")),
    }


@app.get("/trainingSchedule", response_model=List[formatted_trainingsdata])
async def get_trainings_schedule(current_user=Depends(get_current_active_user)):
    return get_trainings(current_user.get("user_id"))


@app.get("/exercisesData", response_model=List[Formatted_exercises])
async def get_exercises_for_user(current_user=Depends(get_current_active_user)):
    return get_all_exercises_for_user(current_user.get("user_id"))


@app.get("/tags", response_model=List[str])
async def get_tags(current_user=Depends(get_current_active_user)):
    return get_all_unique_tags()


@app.get("/exercises", response_model=List[Base_exercise])
async def get_exercises(current_user=Depends(get_current_active_user)):
    return get_base_exercises(current_user.get("user_id"))


@app.get("/pastTrainings", response_model=List[formatted_history_trainings_data])
async def get_past_trainings(
    start_date: datetime = Depends(validate_date),
    current_user=Depends(get_current_active_user),
):
    return get_past_trainings_from_start_date(start_date, current_user.get("user_id"))


@app.get("/futureTrainings", response_model=List[formatted_history_trainings_data])
async def get_future_trainings(
    start_date: datetime = Depends(validate_date),
    current_user=Depends(get_current_active_user),
):
    cur_datetime = datetime.now()
    cur_date = datetime.strptime(
        f"{cur_datetime.year}-{cur_datetime.month}-{cur_datetime.day}", "%Y-%m-%d"
    )
    if (cur_date - start_date) > timedelta(days=7):
        return []

    return get_future_trainings_from_cur_date(
        current_user.get("user_id"), cur_date - start_date < timedelta(days=0)
    )


@app.post("/trainingSchedule")
async def post_trainings_schedule(
    trainingsData: post_trainingSchedule = Depends(validate_TrainingsData),
    current_user=Depends(get_current_active_user),
):
    return save_trainings_data(trainingsData, current_user.get("user_id"))


@app.post("/Calendar")
async def save_Calendar(
    trainings: List[Union[Post_Calendar_w_weight, Post_Calendar]],
    current_user=Depends(get_current_active_user),
):
    return save_calendar_data(trainings, current_user.get("user_id"))


@app.put("/ExercisesAdd")
async def save_exercise_add(
    exercise_add: Post_ExercisesAdd, current_user=Depends(get_current_active_user)
):
    save_exercise_to_trainings(exercise_add, current_user.get("user_id"))
