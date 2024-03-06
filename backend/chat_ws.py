
from typing import Annotated
from fastapi import Depends, WebSocket, Cookie, Query, WebSocketException, status
from fastapi.exceptions import HTTPException
from fastapi.responses import HTMLResponse
from authentication.authentication import get_current_active_user, get_current_user
from typing import Dict


connected_users: Dict[str, WebSocket] = {}


async def get_cookie_or_token(
    websocket: WebSocket,
    session: Annotated[str | None, Cookie()] = None,
    token: Annotated[str | None, Query()] = None,
):

    if token:
        try:

            user = await get_current_user(token)
            active_user = await get_current_active_user(user)
        except HTTPException as e:
            await websocket.close(code=status.WS_1002_PROTOCOL_ERROR)
            raise e
        return active_user
    else:
        if session is None:
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            raise WebSocketDisconnect
        return session


async def handle_session(websocket,  current_user):
    user_name = current_user["user_name"]
    connected_users[user_name] = websocket
    while True:
        try:
            # data = await websocket.receive_text()
            data = await websocket.receive_json()
            print(connected_users)
            for k, v in connected_users.items():
                if (k == data.get('recipient')):
                    await v.send_text(f"{data.get('message')}")

        except Exception as e:
            # print(e)
            print(connected_users)
            connected_users.pop(user_name)
            # await websocket.close()
