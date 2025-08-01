'use client'
import SubmitButton from '@/components/Share/button'
import Search from '@/components/Share/search'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import ProfileBar from './ProfileBar'
import ConversationItem from './ConversationItem'
import { User } from '@/types/user'
import ConversationService from '@/services/conversation.service'
import { toast } from 'react-toastify'
import { ConversationSimple } from '@/types/conversation'
import { useTranslations } from 'next-intl'

interface ConverstationListProp {
  setIsLoading: (isLoading: boolean) => void
}

const ConversationList = ({
  setIsLoading,
  ...props
}: ConverstationListProp) => {

  const t = useTranslations('conversation')
  const conversationService = ConversationService.getInstance()
  const [profile, setProfile] = useState<User>()
  const [conversations, setConversations] = useState<ConversationSimple[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);

      try {
        const conversationsData = await conversationService.getConversations();
        setConversations(conversationsData);
      } catch (err: any) {
        console.error("Lỗi khi fetch conversations trong component:", err);
        toast.error(err.message || "Đã xảy ra lỗi khi tải cuộc trò chuyện.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const handleSearch = () => {

  }

  const handleCreate = async () => {
    try {
      const response = await conversationService.createConversation()
      setConversations(prev => [response, ...prev])
      toast.success(t('create.success'))
    } catch (error: any) {
      toast.error(t('create.failure'))
    }
  }

  return (
    <div
      {...props}
      className={clsx(
        `flex flex-col justify-center items-center`,
        "w-1/5 h-full",
        "p-4"
      )}
    >
      <div className={clsx(
        "flex flex-col items-center gap-8",
        'w-full h-full',
        "p-5",
        "bg-[#FDF0F4]", "rounded-lg")}
      >
        <div className="w-full flex items-center justify-between">
          <h1 className="text-3xl font-bold">AnyChat</h1>
          <Search onClick={handleSearch} />
        </div>

        <SubmitButton title='New chat' onClick={handleCreate} />

        <div className="w-full flex flex-col gap-0.5 flex-grow overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="text-sm text-gray-500 px-4">
              Chưa có cuộc trò chuyện nào.
            </p>
          ) : (
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
              // icon={conversation.icon}
              // selected={conversation.selected}
              />
            )
            )
          )}
        </div>

        <ProfileBar />
      </div>
    </div>
  )
}

export default ConversationList