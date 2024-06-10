from typing import Annotated
from fastapi import WebSocket, Cookie, Query, status, WebSocketDisconnect
from fastapi.exceptions import HTTPException
from authentication.authentication import get_current_active_user, get_current_user
from typing import Dict
from custom_types import Message_json
from no_sql import save_new_message
from datetime import datetime


connected_users: Dict[int, WebSocket] = {}


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


def return_error_message(message: str):
    return {"error": True, "message": message}


def validate_message(data: Dict, user_id: int):
    if not isinstance(data.get("recipient_id"), int):
        return return_error_message("recipient id must be present and of the integer")
    if not isinstance(data.get("content"), str):
        return return_error_message("content must be present and of the string")
    if data.get("recipient_id") == user_id:
        return return_error_message("recipient must not be the same as the sender")
    return {"error": False}


async def handle_session(websocket: WebSocket, user_id: int):
    connected_users[user_id] = websocket
    is_connected = True
    while is_connected:
        try:
            data: Dict[Message_json] = await websocket.receive_json()

            validation_result = validate_message(data, user_id)

            timestamp = datetime.now()
            # check message
            if validation_result.get("error"):
                await websocket.send_json(
                    {
                        "error": "message was not send successfully",
                        "error_message": validation_result.get("message"),
                        "message": data,
                    }
                )
                continue

            # insert message into db
            is_inserted = await save_new_message(
                data.get("content"), user_id, data.get(
                    "recipient_id"), timestamp
            )
            if is_inserted.get("error"):
                await websocket.send_json(
                    {
                        "error": "message was not send successfully",
                        "error_message": is_inserted.get("error_message"),
                        "message": data,
                    }
                )
                continue

            # send to user if he is currently online
            user = connected_users[data.get("recipient_id")]
            if user:
                await user.send_json(
                    {
                        "sender": user_id,
                        "content": data.get("content"),
                        "timestamp": str(timestamp),
                    }
                )

        except RuntimeError as e:
            is_connected = False
            del connected_users[user_id]

        except WebSocketDisconnect as e:
            pass
        except Exception as e:
            print(e)
