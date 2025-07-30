import { HTMLInputTypeAttribute } from "react";

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  title: string;
  type: HTMLInputTypeAttribute;
  name: string;
  placeholder?: string;
  required?: boolean;
  messageError?: string;
  classNameParent?: string;
}

export default function InputGroup({
  title,
  type,
  name,
  placeholder,
  required,
  messageError,
  classNameParent,
  ...props
}: InputGroupProps) {
  return (
    <div className={`${classNameParent} w-full`}>
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-bold text-gray-900 dark:text-white text-left"
      >
        {title}
        {required && <span className="mx-1 text-red-500">*</span>}
      </label>
      <input
        {...props}
        type={type}
        id={name}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder={placeholder || ""}
        required={required}
      />
      <div className="min-h-[1.25em]">
        {messageError && (
          <p className="text-left text-xs text-red-600">{messageError}</p>
        )}
      </div>
    </div>
  );
}
