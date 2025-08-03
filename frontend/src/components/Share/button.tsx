interface SubmitButtonProp
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  mode?: "light" | "dark";
  onClick?: () => void;
  parentClassname?: string;
}

const SubmitButton = ({ title, mode, onClick, parentClassname, ...props }: SubmitButtonProp) => {

    const getColorWMode = () => {
    return mode === "light" 
        ? "bg-light text-black" 
        : "bg-black text-white";
}

  return (
    <button
      {...props}
      onClick={onClick}
      className={`w-full font-medium rounded-lg text-base px-5 py-2.5 ${getColorWMode()} ${parentClassname}`}
    >
      {title}
    </button>
  );
};

export default SubmitButton;
