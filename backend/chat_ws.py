from typing import Annotated
from fastapi import WebSocket, Cookie, Query, status, WebSocketDisconnect
from fastapi.exceptions import HTTPException
from authentication.authentication import get_current_active_user, get_current_user
from typing import Dict
from custom_types import Message_json
from no_sql import save_new_message
from datetime import datetime


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


async def handle_session(websocket: WebSocket, user_id: int):
    connected_users[user_id] = websocket
    while True:
        try:
            data: Dict[Message_json] = await websocket.receive_json()

            timestamp = datetime.now()

            is_inserted = await save_new_message(
                data.get("content"), user_id, data.get(
                    "recipient_id"), timestamp
            )
            if is_inserted:
                for k, v in connected_users.items():
                    if k == data.get("recipient_id"):
                        await v.send_json(
                            {
                                # maybe by user_name
                                "sender": user_id,
                                "content": data.get("content"),
                                "timestamp": str(timestamp),
                            }
                        )

            else:
                # TODO: watch out for this error in frontend
                await websocket.send_json(
                    {"error": "message was not send successfully", "message": data}
                )
        except Exception as e:
            print(e)
            connected_users.pop(user_id)
