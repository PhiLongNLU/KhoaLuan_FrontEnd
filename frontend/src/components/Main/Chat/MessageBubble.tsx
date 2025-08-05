import clsx from 'clsx';
import React from 'react'
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import rehypeRaw from 'rehype-raw'
import rehypeHighlight from 'rehype-highlight'

interface MessageBubbleProps {
  role: "user" | "ai",
  content: string
}

const MessageBubble = ({ role, content, ...props }: MessageBubbleProps) => {

  const isUser = role === "user";

  return (
    <div
      className={clsx(
        "flex mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
      {...props}
    >

      <div
        className={clsx(
          "max-w-[70%] p-3 rounded-lg shadow-md",
          isUser ? "bg-blue-500 text-white rounded-br-none" : "bg-gray-200 text-gray-800 rounded-bl-none",
          "prose prose-sm break-words"
        )}
      >
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSanitize,
            rehypeHighlight,
            rehypeRaw
          ]}
        />
      </div>
    </div>
  )
}

export default MessageBubble