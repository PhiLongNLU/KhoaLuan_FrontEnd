import { Icon } from '@iconify/react/dist/iconify.js'
import clsx from 'clsx'
import React, { useState } from 'react'

interface ConversationItemProps {
    id: string,
    title: string,
    icon?: "default" | "programming" | "idea" | "tutor",
    selected?: boolean,
    onSelected?: () => void,
    onDeleted?: (id: string) => void,
    onRenamed?: (id: string, newTitle: string) => void,
}

const ConversationItem = ({ id, title, icon = "default", selected, onSelected, onDeleted, onRenamed, ...props }: ConversationItemProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);

    const getIcon = () => {
        switch (icon) {
            case "idea": return "heroicons-outline:light-bulb"
            case "programming": return "heroicons-outline:code"
            case "tutor": return "heroicons:book-open"
            default: return "heroicons-outline:chat-alt-2"
        }
    }

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        setIsEditing(true);
        setEditedTitle(title); 
    };

    const handleSaveEdit = () => {
        if (onRenamed && editedTitle.trim() !== '') {
            onRenamed(id, editedTitle);
            setIsEditing(false);
        } else {
            setIsEditing(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditedTitle(title);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); 
        if (onDeleted) {
            onDeleted(id);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveEdit();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    return (
        <div className='w-full flex gap-2 justify-start items-center px-4 py-2 rounded-full hover:bg-gray-100' {...props}>
            <div>
                <Icon icon={getIcon()} width={25} height={25} />
            </div>
            {isEditing ? (
                <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleSaveEdit}
                    onKeyDown={handleInputKeyDown}
                    className="flex-1 text-sm truncate border-b border-gray-400 bg-transparent focus:outline-none"
                    autoFocus
                />
            ) : (
                <span className={clsx('flex-1 text-sm truncate', { 'font-bold': selected }, "cursor-pointer")} onClick={onSelected}>{title}</span>
            )}

            <div className="flex items-center gap-1">
                {isEditing ? (
                    <>
                        <Icon
                            className='hover:cursor-pointer hover:text-green-500 transition-colors duration-200'
                            icon={"iconoir:check"}
                            onClick={handleSaveEdit}
                        />
                        <Icon
                            className='hover:cursor-pointer hover:text-gray-500 transition-colors duration-200'
                            icon={"iconoir:cancel"}
                            onClick={handleCancelEdit}
                        />
                    </>
                ) : (
                    <>
                        <Icon
                            className='hover:cursor-pointer hover:text-blue-500 transition-colors duration-200'
                            icon={"iconoir:edit"}
                            onClick={handleEditClick}
                        />
                        <Icon
                            className='hover:cursor-pointer hover:text-red-500 transition-colors duration-200'
                            icon={"iconoir:cancel"}
                            onClick={handleDeleteClick}
                        />
                    </>
                )}
            </div>

        </div>
    )
}

export default ConversationItem