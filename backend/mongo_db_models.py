from pydantic import BaseModel, EmailStr, Field, List
from typing import Dict


class Chats(BaseModel):
    user1: str
    user2: str
    messages: List[Dict[Messages]]


class Messages(BaseModel):
    sender: str
    timpestamp: str
    content: str
