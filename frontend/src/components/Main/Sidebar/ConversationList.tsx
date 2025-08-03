'use client'
import SubmitButton from '@/components/Share/button'
import Search from '@/components/Share/search'
import clsx from 'clsx'
import React, { useEffect } from 'react'
import ProfileBar from './ProfileBar'
import ConversationItem from './ConversationItem'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'
import { useCreateConversationMutation, useGetConversationsQuery } from '@/store/api/conversationApi'

interface ConverstationListProp {
  setIsLoading: (isLoading: boolean) => void
  setCurrentConversation: (currentConversation: string) => void
  currentConversation: string
}

const ConversationList = ({
  setIsLoading,
  setCurrentConversation,
  currentConversation,
  ...props
}: ConverstationListProp) => {

  const t = useTranslations('conversation')

  const {
    data: conversations,
    isLoading: isFetchingConversations,
    error: fetchError
  } = useGetConversationsQuery();

  const [createConversation, { isLoading: isCreatingConversation }] = useCreateConversationMutation();

  useEffect(() => {
    setIsLoading(isFetchingConversations || isCreatingConversation);

    if (fetchError) {
      console.error("Lỗi khi fetch conversations:", fetchError);
      let errorMessage: string = t('get.failure');

      if ('status' in fetchError) {
        if (fetchError.status === 401) {
          errorMessage = t('auth.no_token_found');
        } else if (typeof fetchError.data === 'object' && fetchError.data !== null && 'detail' in fetchError.data) {
          errorMessage = (fetchError.data as any).detail;
        } else {
          errorMessage = `Error ${fetchError.status}: ${JSON.stringify(fetchError.data)}`;
        }
      } else if ('message' in fetchError) {
        errorMessage = fetchError.message || t('get.failure');
      }

      toast.error(errorMessage);
    }
  }, [
    isFetchingConversations,
    isCreatingConversation,
    setIsLoading,
    fetchError,
    setCurrentConversation,
    t
  ]);

  const handleSearch = () => {

  }

  const handleCreate = async () => {

    const defaultTitle = t('create.default_title')

    try {
      const newConversation = await createConversation({ title: defaultTitle }).unwrap()

      toast.success(t('create.success'));

      setCurrentConversation(newConversation.id);

    } catch (error: any) {
      console.error("Lỗi khi tạo cuộc trò chuyện:", error);
      toast.error(t('create.failure'))
    }
  }

  const handleSelect = (id: string) => {
    setCurrentConversation(id)
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

        <SubmitButton
          title={isCreatingConversation ? t('create.creating') : t('create.create-chat')}
          onClick={handleCreate}
          disabled={isCreatingConversation} />

        <div className="w-full flex flex-col gap-0.5 flex-grow overflow-x-hidden overflow-y-auto">
          {isFetchingConversations ? (
            <p className="text-sm text-gray-500 px-4">{t('loading_conversations_message')}</p>
          ) : (conversations?.length === 0) ? (
            <p className="text-sm text-gray-500 px-4">
              {t('empty_conversations_message')}
            </p>
          ) : (
            conversations?.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                onSelected={()=>handleSelect(conversation.id)}
                selected={currentConversation == conversation.id}
              />
            ))
          )}
        </div>

        <ProfileBar />
      </div>
    </div>
  )
}

export default ConversationList