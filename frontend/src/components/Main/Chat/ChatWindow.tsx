import React from 'react'
import PromptInput from './PromptInput'

const ChatWindow = () => {
    return (
        <div className="w-4/5 flex flex-col items-center justify-end p-4" >

            <div className="flex-grow w-full overflow-y-auto">
                <h1 className="font-bold text-3xl">Ask everything you want</h1>
            </div>
            <div className="w-[70%]">
            <PromptInput />
            </div>
        </div>
    )
}

export default ChatWindow