import { useTranslation } from 'react-i18next';
import Icon from '../assets/icons/Image_18.svg';

const SignIn = () => {

    const { t } = useTranslation();

    return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
            <div>
                <div>
                    <Icon/>
                </div>
                <h2>{t('login.title')}</h2>
                <h3>{t('login.note')}</h3>
            </div>
            <div>
                <button>{t('login.signup-button')}</button>
                <button>{t('login.login-button')}</button>
            </div>
        </div>
    );
}

export default SignIn;