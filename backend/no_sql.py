from db_connection import database
from db_connection import client
from fastapi import UploadFile, HTTPException
from db_connection import grid_fs_bucket
from fastapi.responses import StreamingResponse
from io import BytesIO
from bson import ObjectId


chats = database.get_collection("chats")
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
        {"$or": [{"user1": user_name}, {"user2": user_name}]}).to_list(length=None)
    return [all_chats.get("user1") if chat.get("user2") ==
            user_name else chat.get("user2") for chat in all_chats]


async def test():
    print(await chats.count_documents({'initialized': True}))
    await client.admin.command('ping')
    print("success")
