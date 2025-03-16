import GoogleLogo from "../../assets/icons/googleBtn.png";
import AppleLogo from "../../assets/icons/appleBtn.png";
import FacebookLogo from "../../assets/icons/facebookBtn.png";
import {useTranslation} from "react-i18next";
import * as React from "react";

const SignUp = ({ onChangeView }: { onChangeView: (viewType: "signin" | "signup") => void }) => {
    const [continueCreate, onContinueCreate] = React.useState(false);

    return (
        <>
            {!continueCreate ?<TypeEmail onChangeView={onChangeView} onContinueClick = {() => onContinueCreate(true)}/> : <RetypePassword onChangeView={onChangeView}/> }
        </>
    )
}

const TypeEmail = ({ onChangeView,  onContinueClick} : { onChangeView: (viewType: "signin" | "signup") => void; onContinueClick : () => void }) => {
    const  {t} = useTranslation();
    const handleContinueClick = () => {
        onContinueClick();
    }
    return(
        <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('login.title')}</h2>
            <div className="flex justify-center space-x-4 mb-4">
                <button className="text-white rounded-full w-10"><img src={GoogleLogo} alt="goole logo"/></button>
                <button className="text-white rounded-full w-10"><img src={FacebookLogo} alt="facebook logo"/></button>
                <button className="text-white rounded-full w-10"><img src={AppleLogo} alt="apple logo"/></button>
            </div>
            <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="text-left mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                    type="email"
                    placeholder="example.email@gmail.com"
                    className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
                    disabled
                />
            </div>
            <button
                className="w-full bg-black text-white py-2 rounded-lg mb-4 hover:bg-gray-800"
                onClick={handleContinueClick}
            >
                {t('login.continue-button')}
            </button>
            <p className="text-gray-500">
                {t('login.already-have-account')}
                <button onClick={() => onChangeView("signin")} className="text-blue-600 hover:underline ml-1">
                    {t('login.login-button')}
                </button>
            </p>
        </>
    )
}

const RetypePassword = ({ onChangeView }: { onChangeView: (viewType: "signin" | "signup") => void }) => {
    const {t} = useTranslation();
    const [password, setPassword] = React.useState("");
    const [retypedPassword, setRetypedPassword] = React.useState("");

    const onChangePassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onChangeRetypedPassword = (e : React.ChangeEvent<HTMLInputElement>) => {
        setRetypedPassword(e.target.value);
    }

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('login.title')}</h2>
            <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="px-4 text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            <div className="text-left mb-4">
                <label className="block text-gray-700 font-semibold mb-1">Email</label>
                <input
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={onChangePassword}
                    className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
                />
                <label className="block text-gray-700 font-semibold mb-1">Password</label>
                <input
                    type="password"
                    placeholder="retype password"
                    value={retypedPassword}
                    onChange={onChangeRetypedPassword}
                    className="w-full p-2 border rounded-lg bg-gray-100 text-gray-500"
                />
            </div>
            <button
                className="w-full bg-black text-white py-2 rounded-lg mb-4 hover:bg-gray-800"
            >
                {t('login.create-account-button')}
            </button>
            <p className="text-gray-500">
                {t('login.already-have-account')}
                <button onClick={() => onChangeView("signin")} className="text-blue-600 hover:underline ml-1">
                    {t('login.login-button')}
                </button>
            </p>
        </>
    )
}

export default SignUp;