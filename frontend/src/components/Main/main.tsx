import AuthService from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import React from 'react'
import ConversationList from './Sidebar/ConversationList';
import ChatWindow from './Chat/ChatWindow';

const MainPage = () => {

  const authService = AuthService.getInstance();
  const route = useRouter()

  const logout = () => {
    authService.logout()
    route.push('/')
  }

  const handleConversationClick = (id: string) => {
    console.log(`Clicked conversation with ID: ${id}`);
    // Thực hiện logic chọn cuộc trò chuyện
  };

  const handleConversationDelete = (id: string) => {
    console.log(`Deleting conversation with ID: ${id}`);
    // Thực hiện logic xóa cuộc trò chuyện
  };

  const conversations = [
    { "id": "1", "title": "Conversation 1", "icon": "programming", "selected": true },
    { "id": "2", "title": "Conversation 2" },
    { "id": "3", "title": "Conversation 3" },
    { "id": "4", "title": "Conversation 4" },
    { "id": "5", "title": "Conversation 5" },
    { "id": "6", "title": "Conversation 6 ldakjflakds ldksjflk dasjfaidsjo fidajs" },
    { "id": "7", "title": "Conversation 7" },
    { "id": "8", "title": "Conversation 8" },
  ]

  return (
    <div className='flex h-screen'>
      <ConversationList conversationList={conversations} createConversationAction={() => alert('create conversation')} deleteConversationAction={() => alert('delete conversation')} searchConversationAction={() => alert('search conversation')} />
      <ChatWindow />
    </div>
  )
}

export default MainPage