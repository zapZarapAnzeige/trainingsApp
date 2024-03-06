from db_connection import database
from db_connection import client


chats = database.get_collection("chats")
videos = database.get_collection("videos")


async def test():
    print(await chats.count_documents({'initialized': True}))
    await client.admin.command('ping')
    print("success")
