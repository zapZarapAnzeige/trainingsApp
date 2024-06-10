from datetime import datetime
from typing import Dict
from db_connection import database
from fastapi import Response, status
from db_connection import grid_fs_bucket
from fastapi.responses import StreamingResponse
from io import BytesIO
from pymongo.results import UpdateResult


chats = database.get_collection("chats")
messages = database.get_collection("messages")
videos = database.get_collection("videos")


async def get_chat_partners(user_id: int):
    return {
        chat: {
            "partner_id": chat,
            "last_message": participants.get("last_message_content"),
            "unread_messages": 0,
            "last_message_timestamp": participants.get("last_message_timestamp"),
            "disabled": participants.get("disabled"),
            "last_sender_id": participants.get("last_sender_id"),
        }
        if participants.get("last_sender_id") == user_id
        else {
            "partner_id": chat,
            "last_message": participants.get("last_message_content"),
            "unread_messages": participants.get("unread_messages"),
            "last_message_timestamp": participants.get("last_message_timestamp"),
            "disabled": participants.get("disabled"),
            "last_sender_id": participants.get("last_sender_id"),
        }
        for participants in await chats.find({"participants": user_id}).to_list(
            length=None
        )
        for chat in participants.get("participants")
        if chat != user_id
    }


async def block_user(user_id: int, partner_id: int):
    update: UpdateResult = await chats.update_one(
        filter={"participants": {"$all": [user_id, partner_id]}, "disabled": False},
        update={
            "$set": {
                "disabled": True,
                "last_sender_id": user_id,
                "unread_messages": 0,
                "last_message_content": "Blocked",
            }
        },
    )

    return update.matched_count


async def unblock_user(user_id: int, partner_id: int):
    update: UpdateResult = await chats.update_one(
        {
            "participants": {"$all": [user_id, partner_id]},
            "disabled": True,
            "last_sender_id": user_id,
        },
        {
            "$set": {
                "disabled": False,
                "unread_messages": 1,
                "last_message_content": "Unblocked",
            }
        },
    )
    return update.matched_count


async def get_video_by_name(file_name: str):
    try:
        video_info = await database.get_collection("videos.files").find_one(
            {"filename": {"$regex": file_name + r"\..*"}}
        )
        if video_info:
            download_stream = await grid_fs_bucket.open_download_stream(
                video_info["_id"]
            )
            file_data = await download_stream.read()
            return StreamingResponse(BytesIO(file_data), media_type="video/mp4")
        else:
            return None
    except Exception as e:
        print(e)
        return None


async def get_all_chats_from_user(user_id: int):
    all_chats = await chats.find({"participants": user_id}).to_list(length=None)

    all_chats = [
        chat for participants in all_chats for chat in participants.get("participants")
    ]
    all_chats.append(user_id)
    return list(dict.fromkeys(all_chats))


async def insert_new_partner(user_id: int, partner_name: Dict):
    if partner_name:
        insert = await chats.insert_one(
            {
                "participants": [user_id, partner_name.get("user_id")],
                "last_message_content": "new match",
                "last_message_timestamp": datetime.now(),
                "unread_messages": 1,
                "last_sender_id": user_id,
                "disabled": False,
            }
        )
        return insert.acknowledged
    else:
        return False


async def save_new_message(message: str, sender_id: int, recipient_id: int, timestamp):
    chat = await chats.find_one_and_update(
        {
            "participants": {"$all": [sender_id, recipient_id]},
            "last_sender_id": sender_id,
            "disabled": False,
        },
        {
            "$inc": {"unread_messages": 1},
            "$set": {
                "last_message_timestamp": timestamp,
                "last_message_content": message,
            },
        },
    )
    if not chat:
        chat = await chats.find_one_and_update(
            {"participants": {"$all": [sender_id, recipient_id]}, "disabled": False},
            {
                "$set": {
                    "last_message_timestamp": timestamp,
                    "last_message_content": message,
                    "unread_messages": 1,
                    "last_sender_id": sender_id,
                }
            },
        )

    if not chat:
        return {
            "error": True,
            "error_message": "Chat does not exist or one party blocked the other",
        }
    insert = await messages.insert_one(
        {
            "sender": sender_id,
            "content": message,
            "chat_id": chat.get("_id"),
            "timestamp": timestamp,
        }
    )
    return {"error": not insert.acknowledged}


async def get_content_of_chat(partner_id: int, user_id: int):
    chat = await chats.find_one_and_update(
        {"participants": {"$all": [partner_id, user_id]}, "last_sender_id": partner_id},
        {"$set": {"unread_messages": 0}},
    )
    if not chat:
        chat = await chats.find_one({"participants": {"$all": [partner_id, user_id]}})
    if not chat:
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    return [
        {
            "content": message.get("content"),
            "sender": message.get("sender"),
            "timestamp": message.get("timestamp"),
        }
        for message in await messages.find({"chat_id": chat.get("_id")}).to_list(
            length=None
        )
    ]
