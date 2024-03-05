from sqlalchemy import String, Column, Table, Boolean
from db_connection import metaData


Users = Table('Users', metaData,
              Column('user_name', String(255), primary_key=True),
              Column('password', String(255), nullable=False),
              Column('expired', Boolean, nullable=False, default=False)
              )
