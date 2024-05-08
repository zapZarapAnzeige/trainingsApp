import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())
mongo_user = os.getenv("MONGO_DB_USR")
mongo_pwd = os.getenv("MONGO_DB_PWD")
mongo_host = os.getenv("MONGO_DB_URL")
mongo_port = os.getenv("MONGO_DB_PORT")
mongo_db_name = os.getenv("MONGO_DB_NAME")

print(mongo_port)


async def upload_file(fs, filename, file_data):
    await fs.upload_from_stream(filename, file_data, metadata={"contentType": "image/gif"})
    print(f'{filename} uploaded successfully.')


async def upload_files(directory=os.path.dirname(os.path.realpath(__file__))+"/ressources", db_name='mydatabase', bucket_name='videos'):
    client = AsyncIOMotorClient(
        f"mongodb://{mongo_user}:{mongo_pwd}@{mongo_host}:{mongo_port}")
    db = client.get_database(f"{mongo_db_name}")
    fs = AsyncIOMotorGridFSBucket(db, bucket_name="videos")

    tasks = []
    for filename in os.listdir(directory):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'rb') as f:
            data = f.read()
            task = asyncio.create_task(upload_file(fs, filename, data))
            tasks.append(task)
    await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(upload_files())
