import { useTranslations } from "next-intl";
import React from "react";
import SubmitButton from "../Share/button";

interface WelcomeScreenProps {
    signUpAction: () => void;
    signInAction: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ signUpAction, signInAction }) => {
    const t = useTranslations("welcome");

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <h1 className="font-semibold text-[32px]">{t("unleashConversations")}</h1>
      <p className="font-light text-sm text-gray-400">{t("continueLogin")}</p>
      <div className="w-3/5">
        <SubmitButton title={t("signUp")} mode="dark" onClick={signUpAction}/>
        <SubmitButton title={t("signIn")} mode="light" onClick={signInAction}/>
      </div>
    </div>
  );
};

export default WelcomeScreen;
