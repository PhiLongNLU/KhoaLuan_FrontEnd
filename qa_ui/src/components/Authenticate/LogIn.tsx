import { useTranslation } from "react-i18next";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import GoogleLogo from "../../assets/icons/googleBtn.png";
import AppleLogo from "../../assets/icons/appleBtn.png";
import FacebookLogo from "../../assets/icons/facebookBtn.png";
import {useDispatch} from "react-redux";
import {setCredentials} from "../../store/authSlice.ts";
import {useNavigate} from "react-router-dom";
import Swal from "sweetalert2";

// Component con để tách logic Google Login
const GoogleLoginButton = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const userInfo = await axios.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
                )
                console.log("access token " + tokenResponse.access_token);

                // 2. Send token to your backend for verification
                const response = await axios.post("http://localhost:8001/auth/google", {
                    token: tokenResponse.access_token
                })

                dispatch(setCredentials({
                    token: response.data.token, // Your backend JWT
                    user: {
                        id: userInfo.data.sub,
                        name: userInfo.data.name,
                        email: userInfo.data.email,
                        picture: userInfo.data.picture
                    }
                }))
                console.log('Đăng nhập thành công:', response.data);

                await Swal.fire({
                    icon: 'success',
                    title: 'Đăng nhập thành công',
                    position: 'top-end',
                    timer: 1500,
                    timerProgressBar: true,
                })

                navigate('/');
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Đăng nhập thất bại',
                    timer: 1500,
                    position: 'top-end',
                    timerProgressBar: true,
                })
            }
        },
        onError: async () => {
            console.error('Đăng nhập thất bại');
            await Swal.fire({
                icon: 'error',
                title: 'Đăng nhập thất bại',
                position: 'top-end',
                timer: 1500,
                timerProgressBar: true,
            })
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