import React from 'react'

interface SubTextProps {
    text: string | [string, string],
    className?: string,
    onNavigate?: () => void,
}

const SubText = ({
    text,
    className,
    onNavigate,
    ...props
}: SubTextProps) => {
  if (Array.isArray(text)) {
    const [mainText, linkText] = text;
    return (
      <p className={`text-sm text-center text-gray-500 dark:text-gray-400 ${className || ''}`} {...props}>
        {mainText}{' '}
        <span
          onClick={onNavigate}
          className="font-medium text-pink-500 hover:underline dark:text-pink-400 cursor-pointer"
        >
          {linkText}
        </span>
      </p>
    )
  }

  return (
    <p className={`text-sm text-center text-gray-500 dark:text-gray-400 ${className || ''}`} {...props}>
        {text}
    </p>
  )
}

export default SubText