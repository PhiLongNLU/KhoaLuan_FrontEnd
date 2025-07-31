import SubmitButton from '@/components/Share/button'
import Search from '@/components/Share/search'
import clsx from 'clsx'
import React from 'react'
import ProfileBar from './ProfileBar'
import ConversationItem from './ConversationItem'

interface ConverstationListProp {
  select?: boolean
  createConversationAction: () => void
  deleteConversationAction: () => void
  searchConversationAction: () => void
  conversationList: {
    id: string,
    title: string,
    icon?: "default" | "programming" | "idea" | "tutor",
    selected?: boolean
  }[]
}

const ConversationList = ({
  select,
  createConversationAction,
  deleteConversationAction,
  searchConversationAction,
  conversationList,
  ...props
}: ConverstationListProp) => {
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
          <Search onClick={searchConversationAction} />
        </div>

        <SubmitButton title='New chat' onClick={createConversationAction} />

        <div className="w-full flex flex-col gap-0.5 flex-grow overflow-y-auto">
          {conversationList.length === 0 ? (
            <p className="text-sm text-gray-500 px-4">
              Chưa có cuộc trò chuyện nào.
            </p>
          ) : (
            conversationList.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                id={conversation.id}
                title={conversation.title}
                icon={conversation.icon}
                selected={conversation.selected}
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