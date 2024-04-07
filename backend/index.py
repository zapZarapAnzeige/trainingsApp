from typing import Optional
from fastapi import FastAPI, Depends, WebSocket, UploadFile, File, status, Response
from fastapi.middleware.cors import CORSMiddleware
from sql import get_overview, get_profile_pic, find_trainingspartner, update_user_data
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
INVALID_PLZ_LENGTH_ERROR = Response(
    status_code=status.HTTP_412_PRECONDITION_FAILED, content="invalid plz length"
)


@app.put("/user")
async def upload_user_data(
    profile_picture: Optional[UploadFile] = File(None),
    plz: str = None,
    searching_for_partner: bool = None,
    current_user=Depends(get_current_active_user),
):
    user_data = {}
    if not len(plz) == 5:
        return INVALID_PLZ_LENGTH_ERROR

    if plz:
        user_data["plz"] = plz
    if searching_for_partner:
        user_data["searching_for_partner"] = searching_for_partner
    await update_user_data(profile_picture, current_user.get("user_id"), user_data)


@app.websocket("/chat")
async def chat(*, websocket: WebSocket, current_user=Depends(get_cookie_or_token)):
    await websocket.accept()
    await handle_session(websocket, current_user.get("user_id"))


@app.post("/chat")
async def find_partner(plz: str, current_user=Depends(get_current_active_user)):
    if not len(plz) == 5:
        return INVALID_PLZ_LENGTH_ERROR
    user_id = current_user.get("user_id")
    matched_persons = await get_all_chats_from_user(user_id)
    new_match = await find_trainingspartner(plz, matched_persons)
    is_inserted = await insert_new_partner(user_id, new_match)
    if is_inserted:
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


@app.get("/users/me")
async def get_user_data(current_user=Depends(get_current_active_user)):
    return {
        "user_name": current_user.get("user_name"),
        "user_id": current_user.get("user_id"),
    }
