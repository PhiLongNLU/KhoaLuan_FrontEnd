import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React from 'react'

interface ConversationItemProps {
    id: string,
    title: string,
    icon?: "default" | "programming" | "idea" | "tutor",
    selected?: boolean,
    onSelected?: () => void,
    onDeleted?: () => void,
}

const ConversationItem = ({ id, title, icon = "default", selected, onSelected, onDeleted, ...props }: ConversationItemProps) => {

    const getIcon = () => {
        switch (icon) {
            case "idea": return "heroicons-outline:light-bulb"
            case "programming": return "heroicons-outline:code"
            case "tutor": return "heroicons:book-open"
            default: return "heroicons-outline:chat-alt-2"
        }
    }

    return (
        <div className='w-full flex gap-2 justify-start items-center px-4 py-2 rounded-full hover:bg-gray-100' {...props}>
            <div>
                <Icon icon={getIcon()} width={25} height={25} />
            </div>
            <span className={clsx('flex-grow text-sm truncate', { 'font-bold': selected }, "cursor-pointer")} onClick={onSelected}>{title}</span>
            <span>
                <Icon className='hover:cursor-pointer hover:text-blue-500' icon={"iconoir:edit"} />
            </span>
            <span>
                <Icon className='hover:cursor-pointer hover:text-red-500' icon={"iconoir:cancel"} />
            </span>
        </div>
    )
}

export default ConversationItem