import Logo from "../../assets/icons/Image_18.svg";
import {useTranslation} from "react-i18next";

const AuthType = ({ onChangeView }: { onChangeView: (viewType: "signin" | "signup") => void }) => {
    const { t } = useTranslation();

    const handleSetView = (viewType: "signin" | "signup") => {
        onChangeView(viewType);
    };

    return (
        <>
            <div className="flex justify-center mb-4">
                <img src={Logo} alt="logo" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{t('login.title')}</h2>
            <p className="text-gray-500 mb-6">{t('login.note')}</p>
            <button
                onClick={() => handleSetView("signup")}
                className="w-full bg-black text-white py-2 rounded-lg mb-4 hover:bg-gray-800"
            >
                {t('login.signup-button')}
            </button>
            <button
                onClick={() => handleSetView("signin")}
                className="w-full bg-white text-gray-700 hover:underline"
            >
                {t('login.login-button')}
            </button>
        </>
    );
};

export default AuthType;

