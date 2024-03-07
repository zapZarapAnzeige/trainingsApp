from fastapi import FastAPI, Depends, WebSocket, UploadFile, File, status
from fastapi.middleware.cors import CORSMiddleware
from sql import get_user, find_trainingspartner
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.exceptions import HTTPException
from authentication.authentication import get_current_active_user, authenticate_user, create_access_token, create_new_user, get_current_user
from custom_types import Token
from datetime import datetime, timedelta, timezone
from fastapi.responses import JSONResponse, HTMLResponse
from chat_ws import get_cookie_or_token, handle_session
from no_sql import test, upload_video, get_video_by_id

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


@app.websocket("/chat/{chat_id}")
async def chat(*,
               chat_id,
               websocket: WebSocket,
               current_user=Depends(get_cookie_or_token)):
    await websocket.accept()
    await handle_session(websocket,  current_user, chat_id)


@app.post("/chat")
async def find_partner(plz: str, current_user=Depends(get_current_active_user)):
    return await find_trainingspartner(plz, current_user.get("user_name"))


@app.post("/video")
async def upload_file(file: UploadFile = File(...)):
    return await upload_video(file)


@app.get("/files/{file_id}")
async def get_video(file_id: str):
    return await get_video_by_id(file_id)


@app.get("/users")
async def get_users(subcategory_id: int, current_user=Depends(get_current_active_user)):
    return get_user(subcategory_id)


@app.post("/api/v1/signUp")
async def sign_up(form_data: OAuth2PasswordRequestForm = Depends()):
    return create_new_user(form_data.username, form_data.password)


@app.post("/api/v1/login", response_model=Token)
async def access_token_login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="incorrect username or password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(hours=8)
    access_token = create_access_token(
        data={"sub": user['user_name']}, expires_delta=access_token_expires)
    response = JSONResponse(content={"access_token": access_token,
                            "expires_in": access_token_expires.seconds, "token_type": "Bearer"})
    expiry = datetime.now() + timedelta(seconds=access_token_expires.seconds)
    expiry_utc = expiry.replace(tzinfo=timezone.utc)
    return response


html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <label>Item ID: <input type="text" id="itemId" autocomplete="off" value="foo"/></label>
            <label>Token: <input type="text" id="token" autocomplete="off" value="some-key-token"/></label>
            <button onclick="connect(event)">Connect</button>
            <hr>
            <label>Message: <input type="text" id="messageText" autocomplete="off"/></label>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
        var ws = null;
            function connect(event) {
                var itemId = document.getElementById("itemId")
                var token = document.getElementById("token")
                ws = new WebSocket("ws://localhost:8000/chat?token=" + token.value);
                ws.onmessage = function(event) {
                    var messages = document.getElementById('messages')
                    var message = document.createElement('li')
                    var content = document.createTextNode(event.data)
                    message.appendChild(content)
                    messages.appendChild(message)
                };
                event.preventDefault()
            }
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@app.get("/")
async def get():
    await test()
    return HTMLResponse(html)
