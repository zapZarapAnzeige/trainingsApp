from pydantic import BaseModel, List
from typing import Dict


class Messages(BaseModel):
    sender: str
    timpestamp: str
    content: str


class Chats(BaseModel):
    user1: str
    user2: str
    messages: List[Dict[Messages]]
