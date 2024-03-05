from sqlalchemy import create_engine, MetaData
import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker

load_dotenv()


engine = create_engine(
    f'mysql+pymysql://{os.getenv("DB_USR")}:{os.getenv("DB_PWD")}@{os.getenv("DB_URL")}:{os.getenv("DB_PORT")}/{os.getenv("DB_NAME")}')
metaData = MetaData()
sessionmkr = sessionmaker(bind=engine)
session = sessionmkr()
