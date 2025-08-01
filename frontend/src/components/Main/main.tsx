'use client'
import React, { useState } from 'react'
import ConversationList from './Sidebar/ConversationList';
import ChatWindow from './Chat/ChatWindow';
import SpinnerOverlay from '../Share/spinnerOverlay';

const MainPage = () => {

  const [isLoading, setIsLoading] = useState(false)

  return (<>
    {isLoading && <SpinnerOverlay />}
    <div className='flex h-screen'>
      <ConversationList setIsLoading={setIsLoading}/>
      <ChatWindow />
    </div>
  </>
  )
}

export default MainPage