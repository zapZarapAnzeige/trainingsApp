from datetime import datetime
from typing import Dict
from db_connection import database
from db_connection import client
from fastapi import Response, UploadFile, HTTPException, status
from db_connection import grid_fs_bucket
from fastapi.responses import StreamingResponse
from io import BytesIO
from bson import ObjectId


chats = database.get_collection("chats")
messages = database.get_collection("messages")
videos = database.get_collection("videos")


async def get_chat_partners(user_name: str):
    return [
        {"partner_name": chat, "last_message": participants.get(
            'last_message_content'), "unread_messages": 0, "last_message_timestamp": participants.get('last_message_timestamp')}
        if participants.get('last_sender_name') == user_name
        else {"partner_name": chat, "last_message": participants.get(
            'last_message_content'), "unread_messages": participants.get('unread_messages'), "last_message_timestamp": participants.get('last_message_timestamp')}
        for participants in await chats.find({"participants": user_name}).to_list(length=None)
        for chat in participants.get("participants")
        if chat != user_name
    ]


async def upload_video(file: UploadFile):
    contents = await file.read()
    grid_fs_upload_stream = grid_fs_bucket.open_upload_stream(
        file.filename, metadata={"contentType": file.content_type}
    )
    await grid_fs_upload_stream.write(contents)
    await grid_fs_upload_stream.close()
    # TODO: insert id into mysql
    return {"filename": file.filename, "id": str(grid_fs_upload_stream._id)}


async def get_video_by_id(file_id: str):
    try:
        grid_fs_download_stream = await grid_fs_bucket.open_download_stream(
            ObjectId(file_id)
        )
        file_data = await grid_fs_download_stream.read()
        return StreamingResponse(
            BytesIO(file_data), media_type="application/octet-stream"
        )
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="File not found")


async def get_all_chats_from_user(user_name: str):
    all_chats = await chats.find({"participants": user_name}).to_list(length=None)

    all_chats = [
        chat for participants in all_chats for chat in participants.get("participants")
    ]
    all_chats.append(user_name)
    return list(dict.fromkeys(all_chats))


async def insert_new_partner(user_name: str, partner_name: str):
    if partner_name:
        insert = await chats.insert_one({"participants": [user_name, partner_name],
                                         "last_message_content": "new match",
                                         "last_message_timestamp": datetime.now(),
                                         "unread_messages": 1, "last_sender_name": user_name})
        return insert.acknowledged
    else:
        return False


async def save_new_message(message: str, sender: str, recipiant: str, timestamp):
    chat = await chats.find_one_and_update({"participants": {"$all": [sender, recipiant]}, "last_sender_name": sender}, {"$inc": {"unread_messages": 1}, "$set": {"last_message_timestamp": timestamp, "last_message_content": message}})
    if not chat:
        chat = await chats.find_one_and_update({"participants": {"$all": [sender, recipiant]}}, {"$set": {"last_message_timestamp": timestamp, "last_message_content": message, "unread_messages": 1, "last_sender_name": sender}})
    if not chat:
        return False
    insert = await messages.insert_one(
        {
            "sender": sender,
            "content": message,
            "chat_id": chat.get("_id"),
            "timestamp": timestamp,
        }
    )
    return insert.acknowledged


async def get_content_of_chat(partner: str, user: str):
    chat = await chats.find_one_and_update({"participants": {"$all": [partner, user]}, "last_sender_name": partner}, {"$set": {"unread_messages": 0}})
    if not chat:
        chat = await chats.find_one({"participants": {"$all": [partner, user]}})
    if not chat:
        return Response(status_code=status.HTTP_404_NOT_FOUND)
    return {
        "chat": [
            {
                "content": message.get("content"),
                "sender": message.get("sender"),
                "timestamp": message.get("timestamp"),
            }
            for message in await messages.find({"chat_id": chat.get("_id")}).to_list(length=None)
        ]
    }
