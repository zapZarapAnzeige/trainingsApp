from db_connection import database
from db_connection import client
from fastapi import UploadFile, HTTPException
from db_connection import grid_fs_bucket
from fastapi.responses import StreamingResponse
from io import BytesIO
from bson import ObjectId


chats = database.get_collection("chats")
messages = database.get_collection("messages")
videos = database.get_collection("videos")


async def upload_video(file: UploadFile):
    contents = await file.read()
    grid_fs_upload_stream = grid_fs_bucket.open_upload_stream(
        file.filename, metadata={"contentType": file.content_type})
    await grid_fs_upload_stream.write(contents)
    await grid_fs_upload_stream.close()
    # TODO: insert id into mysql
    return {"filename": file.filename, "id": str(grid_fs_upload_stream._id)}


async def get_video_by_id(file_id: str):
    try:
        print(file_id)
        grid_fs_download_stream = await grid_fs_bucket.open_download_stream(ObjectId(file_id))
        file_data = await grid_fs_download_stream.read()
        return StreamingResponse(BytesIO(file_data), media_type="application/octet-stream")
    except Exception as e:
        print(e)
        raise HTTPException(status_code=404, detail="File not found")


async def get_all_chats_from_user(user_name: str):
    all_chats = await chats.find(
        {"participants": user_name}).to_list(length=None)

    all_chats = [
        chat for participants in all_chats for chat in participants.get("participants")]
    all_chats.append(user_name)
    return list(dict.fromkeys(all_chats))


async def insert_new_partner(user_name: str, partner_name: str):
    if (partner_name):
        insert = await chats.insert_one({"participants": [user_name, partner_name]})
        return insert.acknowledged
    else:
        # TODO: correct response
        return "No people to match found"


async def find_chat_by_participants(user1: str, user2: str):
    return await chats.find_one({"participants": {"$in": [user1, user2]}})


async def save_new_message(message: str, sender: str, recipiant: str, timestamp):
    chat = find_chat_by_participants(sender, recipiant)
    insert = await messages.insert_one({"sender": sender, "content": message, "chat_id": chat.get("_id"), "timestamp": timestamp})
    return insert.acknowledged


async def get_content_of_chat(partner: str, user: str):
    chat = await find_chat_by_participants(partner, user)
    m = await messages.find({"chat_id": chat.get("_id")}).to_list(length=None)
    print(m)
    return {"chat": [{"content": message.get("content"), 'sender': message.get(
        'sender'), 'timestamp': message.get('timestamp')} for message in m]}


async def test():
    print(await chats.count_documents({'initialized': True}))
    await client.admin.command('ping')
    print("success")
