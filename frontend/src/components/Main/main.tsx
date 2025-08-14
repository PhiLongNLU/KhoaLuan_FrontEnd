'use client'
import React, { useState } from 'react'
import ConversationList from './Sidebar/ConversationList';
import ChatWindow from './Chat/ChatWindow';
import SpinnerOverlay from '../Share/spinnerOverlay';

const MainPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<string>("")

  return (<>
    {isLoading && <SpinnerOverlay />}
    <div className='flex h-screen static'>
      <ConversationList
        setIsLoading={setIsLoading}
        setCurrentConversation={setCurrentConversation}
        currentConversation={currentConversation}
      />
      <ChatWindow
        setIsLoading={setIsLoading}
        currentConversation={currentConversation} />
    </div>
  </>
  )
}

export default MainPage