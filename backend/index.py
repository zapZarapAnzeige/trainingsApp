import base64
from typing import Optional
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
    get_all_exercises,
)
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException
from authentication.authentication import (
    get_current_active_user,
    authenticate_user,
    create_access_token,
    create_new_user,
)
from custom_types import Token
from datetime import timedelta
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


def INVALID_PRECONDITION(content: str):
    return Response(status_code=status.HTTP_412_PRECONDITION_FAILED, content=content)


@app.put("/user")
async def upload_user_data(
    profile_picture: Optional[UploadFile] = File(None),
    plz: str = None,
    searching_for_partner: bool = None,
    bio: str = None,
    nickname: str = None,
    current_user=Depends(get_current_active_user),
):
    user_data = {}
    if plz:
        if not len(plz) == 5:
            return INVALID_PRECONDITION("invalid plz length")
    if plz:
        user_data["plz"] = plz
    if bio:
        user_data["bio"] = bio
    if nickname:
        user_data["nickname"] = nickname
    if searching_for_partner is not None:
        user_data["searching_for_partner"] = searching_for_partner
    res = await update_user_data(
        profile_picture, current_user.get("user_id"), user_data
    )
    print(res)
    return res


@app.websocket("/chat")
async def chat(*, websocket: WebSocket, current_user=Depends(get_cookie_or_token)):
    await websocket.accept()
    await handle_session(websocket, current_user.get("user_id"))


@app.post("/chat")
async def find_partner(plz: str, current_user=Depends(get_current_active_user)):
    if not len(plz) == 5:
        return INVALID_PRECONDITION("invalid plz length")
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


@app.get("/chats")
async def get_chat_overview(current_user=Depends(get_current_active_user)):
    partners = await get_chat_partners(current_user.get("user_id"))

    return {"chat_data": await get_overview(partners)}


@app.patch("/chat")
async def update_chat_disabled(
    currently_blocked: bool,
    partner_id: int,
    current_user=Depends(get_current_active_user),
):
    if currently_blocked:
        return {"result": await unblock_user(current_user.get("user_id"), partner_id)}
    else:
        return {"result": await block_user(current_user.get("user_id"), partner_id)}


@app.get("/chat/content")
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


@app.get("/files/{file_id}")
async def get_video(file_id: str):
    return await get_video_by_id(file_id)


@app.get("/picture")
async def get_users(current_user=Depends(get_current_active_user)):
    return get_profile_pic(current_user.get("user_id"))


@app.post("/api/v1/signUp")
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


@app.post("/ExerciseRating")
async def post_exercise_rating(
    rating: int, exercise: str, current_user=Depends(get_current_active_user)
):
    if rating > 5 or rating < 1:
        return INVALID_PRECONDITION("invalid rating")
    await save_exercise_rating(rating, exercise, current_user.get("user_id"))


@app.get("/users/me")
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


@app.get("/exercisesAdd")
async def get_exercise_add(
    exercise: str, current_user=Depends(get_current_active_user)
):
    return get_exercise_for_dialog(exercise, current_user.get("user_id"))


@app.get("/exercisesInfo")
async def get_exercise_info(
    exercise: str, current_user=Depends(get_current_active_user)
):
    return {
        "video": await get_video_by_name(exercise),
        **get_general_exercise_info(exercise, current_user.get("user_id")),
    }


@app.get("/trainingSchedule")
async def get_trainings_schedule(current_user=Depends(get_current_active_user)):
    return get_trainings(current_user.get("user_id"))


@app.get("/exercisesData")
async def get_exercises(current_user=Depends(get_current_active_user)):
    # TODO
    return get_all_exercises(current_user.get("user_id"))


@app.post("/trainingSchedule")
async def post_trainings_schedule(current_user=Depends(get_current_active_user)):
    pass
