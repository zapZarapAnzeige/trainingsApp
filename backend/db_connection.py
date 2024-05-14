from urllib.parse import quote_plus
from sqlalchemy import create_engine, MetaData
import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorGridFSBucket

load_dotenv()


engine = create_engine(
    f'mysql+pymysql://{os.getenv("DB_USR")}:{os.getenv("DB_PWD")}@{os.getenv("DB_URL")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}'
)
metaData = MetaData()
sessionmkr = sessionmaker(bind=engine)
session = sessionmkr()


mongo_user = os.getenv("MONGO_DB_USR")
mongo_pwd = os.getenv("MONGO_DB_PWD")
mongo_host = os.getenv("MONGO_DB_URL")
mongo_port = os.getenv("MONGO_DB_PORT")
mongo_db_name = os.getenv("MONGO_DB_NAME")

# Ensure the password is URL encoded to handle special characters
mongo_pwd = quote_plus(mongo_pwd)

# Construct the MongoDB connection string
mongo_uri = f"mongodb://{mongo_user}:{mongo_pwd}@{mongo_host}:{mongo_port}"

client = AsyncIOMotorClient(mongo_uri)


database = client.get_database(f"{mongo_db_name}")


grid_fs_bucket = AsyncIOMotorGridFSBucket(database, bucket_name="videos")
