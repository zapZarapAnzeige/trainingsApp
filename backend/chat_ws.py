
from typing import Annotated
from fastapi import Depends, WebSocket, Cookie, Query, WebSocketException, status
from fastapi.exceptions import HTTPException
from fastapi.responses import HTMLResponse
from authentication.authentication import get_current_active_user, get_current_user


connected_users = {}


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
    connected_users[current_user["user_name"]] = websocket
    while True:
        data = await websocket.receive_text()

        await websocket.send_text(
            f"Session cookie or query token value is: {current_user}"
        )
        for k, v in connected_users.items():
            await v.send_text(f"{data}")
