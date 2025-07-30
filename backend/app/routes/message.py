from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from typing import List

from app.models.message import Message, MessageCreate, MessageOut
from app.models.conversation import Conversation
from app.models.user import User
from app.routes.user import get_current_user
from app.core.response import Response

route = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)

@route.get("/conversation/{conversation_id}/ids", response_model=Response[List[PydanticObjectId]])
async def get_message_ids_in_conversation(conversation_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """
    Get a list of IDs of all messages in a specific conversation.
    """
    conversation = await Conversation.find_one(Conversation.id == conversation_id, Conversation.user.id == current_user.id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found or you don't have permission")

    messages = await Message.find(Message.conversation.id == conversation_id).project(Message).to_list()
    message_ids = [msg.id for msg in messages]
    return Response(data=message_ids)

@route.get("/conversation/{conversation_id}", response_model=Response[List[MessageOut]])
async def get_messages_in_conversation(conversation_id: PydanticObjectId, skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user)):
    """
    Get a list of messages of a specific conversation with pagination.
    """
    conversation = await Conversation.find_one(Conversation.id == conversation_id, Conversation.user.id == current_user.id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found or you don't have permission")

    messages = await Message.find(Message.conversation.id == conversation_id).sort(+Message.created_at).skip(skip).limit(limit).to_list()
    return Response(data=messages)

@route.get("/{message_id}", response_model=Response[MessageOut])
async def get_message(message_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """
    Get details of a specific message.
    """
    message = await Message.get(message_id, fetch_links=True)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")
    
    if message.conversation.user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to access this message")

    return Response(data=message)

@route.post("/", status_code=status.HTTP_201_CREATED, response_model=Response[MessageOut])
async def create_message(message_data: MessageCreate, current_user: User = Depends(get_current_user)):
    """
    Create a new message in a conversation.
    """
    conversation = await Conversation.find_one(Conversation.id == message_data.conversation_id, Conversation.user.id == current_user.id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found or you don't have permission")

    # TODO: Later logic can be added to define sender_type as "Bot"
    new_message = Message(**message_data.model_dump(exclude={"conversation_id"}), conversation=conversation.id)
    await new_message.insert()

    await conversation.update_last_updated()

    return Response(status_code=status.HTTP_201_CREATED, message="Message created successfully", data=new_message)

@route.delete("/{message_id}", response_model=Response)
async def delete_message(message_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """
    Delete a specific message.
    """
    message = await Message.get(message_id, fetch_links=True)
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Message not found")

    if message.conversation.user.id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You don't have permission to delete this message")

    await message.delete()
    return Response(message="Message deleted successfully")

