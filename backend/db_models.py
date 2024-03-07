from sqlalchemy import String, Column, Table, Boolean, Integer
from db_connection import metaData


Users = Table('Users', metaData,
              Column('user_id', Integer, primary_key=True, autoincrement=True),
              Column('user_name', String(255), unique=True, nullable=False),
              Column('password', String(255), nullable=False),
              Column('expired', Boolean, nullable=False, default=False),
              Column('plz', String(5), nullable=True),
              Column('searching_for_partner', Boolean,
                     nullable=False, default=False)
              )
