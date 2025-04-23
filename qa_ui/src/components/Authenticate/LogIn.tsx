import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import GoogleLogo from "../../assets/icons/googleBtn.png";
import AppleLogo from "../../assets/icons/appleBtn.png";
import FacebookLogo from "../../assets/icons/facebookBtn.png";

// Component con để tách logic Google Login
const GoogleLoginButton = () => {
    const login = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            try {
                // Gửi token đến backend để xác thực
                const response = await axios.post(import.meta.env.VITE_REDIRECT_URI , {
                    token: credentialResponse.access_token,
                });
                console.log('Đăng nhập thành công:', response.data);
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
            }
        },
        onError: () => {
            console.error('Đăng nhập thất bại');
        },
    });

    return (
        <button
            onClick={() => login()}
            className="text-white rounded-full w-10"
        >
            <img src={GoogleLogo} alt="google logo"/>
        </button>
    );
};

const LogIn = () => {
    const { t } = useTranslation();

    return (
        <>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('login.title')}</h2>
            <div className="flex justify-center space-x-4 mb-4">
                {/* Wrap Google Login Button với Provider */}
                <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
                    <GoogleLoginButton />
                </GoogleOAuthProvider>

                <button className="text-white rounded-full w-10">
                    <img src={FacebookLogo} alt="facebook logo"/>
                </button>
                <button className="text-white rounded-full w-10">
                    <img src={AppleLogo} alt="apple logo"/>
                </button>
            </div>
        </>
    );
};

export default LogIn;