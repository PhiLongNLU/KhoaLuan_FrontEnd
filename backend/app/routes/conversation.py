from fastapi import APIRouter, Depends, HTTPException, status
from beanie import PydanticObjectId
from typing import List

from app.models.conversation import (
    Conversation,
    ConversationCreate,
    ConversationUpdate,
    ConversationOut,
    ConversationOutSimple,
)
from app.models.message import Message
from app.models.user import User
from app.routes.user import get_current_user
from app.core.response import Response

route = APIRouter(
    prefix="/conversations",
    tags=["Conversations"],
)

@route.get("/", response_model=Response[List[ConversationOutSimple]])
async def get_conversations(current_user: User = Depends(get_current_user)):
    """
    Get a list of conversations (IDs and titles only) of the current user.
    """
    conversations = await Conversation.find(
        Conversation.user.id == current_user.id
    ).sort(-Conversation.last_updated).project(ConversationOutSimple).to_list()
    return Response(data=conversations)

@route.get("/{conversation_id}", response_model=Response[ConversationOut])
async def get_conversation(conversation_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """
    Get details of a conversation (not including messages).
    """
    conversation = await Conversation.find_one(
        Conversation.id == conversation_id,
        Conversation.user.id == current_user.id
    )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")
    return Response(data=conversation)

@route.post("/", status_code=status.HTTP_201_CREATED, response_model=Response[ConversationOut])
async def create_conversation(conversation_data: ConversationCreate, current_user: User = Depends(get_current_user)):
    """
    Create a new chat for the current user.
    """
    new_conversation = Conversation(user=current_user.id, title=conversation_data.title)
    await new_conversation.insert()
    return Response(status_code=status.HTTP_201_CREATED, message="Conversation created successfully", data=new_conversation)

@route.put("/{conversation_id}", response_model=Response[ConversationOut])
async def update_conversation(conversation_id: PydanticObjectId, conversation_data: ConversationUpdate, current_user: User = Depends(get_current_user)):
    """
    Update the title of a conversation.
    """
    conversation = await Conversation.find_one(
        Conversation.id == conversation_id,
        Conversation.user.id == current_user.id
    )
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found or you don't have permission")
    
    await conversation.set({Conversation.title: conversation_data.title})
    await conversation.update_last_updated()
    return Response(message="Conversation updated successfully", data=conversation)

@route.delete("/{conversation_id}", response_model=Response)
async def delete_conversation(conversation_id: PydanticObjectId, current_user: User = Depends(get_current_user)):
    """
    Delete a conversation and all related messages.
    """
    conversation = await Conversation.find_one(Conversation.id == conversation_id, Conversation.user.id == current_user.id)
    if not conversation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found or you don't have permission")

    # Delete all related messages first
    await Message.find(Message.conversation.id == conversation_id).delete()
    # Then delete the conversation
    await conversation.delete()
    
    return Response(message="Conversation and associated messages deleted successfully")

