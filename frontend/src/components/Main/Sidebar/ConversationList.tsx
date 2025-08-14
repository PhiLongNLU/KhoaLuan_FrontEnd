'use client'
import SubmitButton from '@/components/Share/button'
import Search from '@/components/Share/search'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import ProfileBar from './ProfileBar'
import ConversationItem from './ConversationItem'
import { toast } from 'react-toastify'
import { useTranslations } from 'next-intl'
import { useDeleteConversationMutation, useGetConversationsQuery, useRenameConversationMutation } from '@/store/api/conversationApi'
import { Icon } from '@iconify/react/dist/iconify.js'
import Image from 'next/image'

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
  const [isOpen, setIsOpen] = useState(false)

  const {
    data: conversations,
    isLoading: isFetchingConversations,
    error: fetchError
  } = useGetConversationsQuery();

  const [deleteConversation, { isLoading: isDeletingConversation }] = useDeleteConversationMutation();
  const [renameConversation, { isLoading: isRenamingConversation }] = useRenameConversationMutation();

  useEffect(() => {
    setIsLoading(isFetchingConversations || isDeletingConversation || isRenamingConversation);

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
    isDeletingConversation,
    isRenamingConversation,
    setIsLoading,
    fetchError,
    setCurrentConversation,
    t
  ]);

  const handleSearch = () => {

  }

  const handleCreate = async () => {
    setCurrentConversation("")
  }

  const handleSelect = (id: string) => {
    setCurrentConversation(id)
  }

  const handleDelete = async (conversationId: string) => {
    if (!confirm(t('delete.confirm'))) { 
      return;
    }
    try {
      await deleteConversation(conversationId).unwrap();
      toast.success(t('delete.success'));
      if (currentConversation === conversationId) {
        setCurrentConversation("");
      }
    } catch (error) {
      console.error("Lỗi khi xóa cuộc trò chuyện:", error);
      toast.error(t('delete.failure'));
    }
  };

  const handleRename = async (conversationId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error(t('rename.empty_title_error'));
      return;
    }
    try {
      await renameConversation({ conversationId, title: newTitle }).unwrap();
      toast.success(t('rename.success'));
    } catch (error) {
      console.error("Lỗi khi đổi tên cuộc trò chuyện:", error);
      // Kiểm tra nếu lỗi từ server có detail cụ thể
      let errorMessage: string = t('rename.failure');
      if (typeof error === 'object' && error !== null && 'data' in error && typeof (error as any).data === 'object' && (error as any).data !== null && 'detail' in (error as any).data) {
        errorMessage = (error as any).data.detail;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div
      {...props}
      className={clsx(
        `flex flex-col justify-center items-center`,
        "lg:static absolute",
        "h-full",
        isOpen ? "lg:w-1/5 w-1/2" : "w-[70px]",
        "p-4"
      )}
    >
      <div className={clsx(
        "flex flex-col items-center gap-8",
        'w-full h-full',
        "p-5",
        "bg-[#FDF0F4]", "rounded-lg")}
      >
        <div className={
          clsx(
            "w-full flex items-center justify-between",
            isOpen ? "flex-row" : "flex-col",
            isOpen ? "items-center justify-between" : "gap-2"
          )
        }>

          <button className={
            clsx(
              "p-2 hover:bg-gray-100 hover:cursor-pointer rounded-full"
            )
          } onClick={() => setIsOpen(!isOpen)}>
            <Icon icon={"mingcute:menu-line"} width={20} height={20} />
          </button>

          <Search onClick={handleSearch} />
        </div>

        {isOpen ? (
          <SubmitButton
            title={t('create.create-chat')}
            onClick={handleCreate}
          />
        ) : (
          <button onClick={handleCreate} className='hover:cursor-pointer'>
            <Icon icon={"typcn:plus"} width={30} height={30} />
          </button>
        )}

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
                onSelected={() => handleSelect(conversation.id)}
                selected={currentConversation == conversation.id}
                onDeleted={handleDelete}
                onRenamed={handleRename}
              />
            ))
          )}
        </div>

        {isOpen ?
          <ProfileBar />
          :
          <button onClick={handleCreate} className='size-8 hover:cursor-pointer'>
            <Image src={"/profile.png"} alt='User Avatar'
              className="border rounded-full hover:cursor-pointer hover:bg-grey-200 overflow-hidden text-sm" width={36} height={36} />
          </button>
        }
      </div>
    </div>
  )
}

export default ConversationList