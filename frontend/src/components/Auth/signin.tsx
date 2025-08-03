import React from "react";
import LoginW3rdParty from "./loginW3rd";
import HrBar from "../Share/hrBar";
import InputGroup from "../Share/inputGroup";
import { useTranslations } from "next-intl";
import SubmitButton from "../Share/button";
import SubText from "../Share/subText";


interface SignInProps {
  email: string,
  setEmail: (email: string) => void,
  errorEmail: string,
  password: string,
  setPassword: (password: string) => void,
  errorPassword: string,
  signInAction: () => void;
  setCurrentStep: (step: number) => void;
  setAuthType: (type: "signin" | "signup") => void;
}


const SignIn = ({
  email,
  setEmail,
  errorEmail,
  password,
  setPassword,
  errorPassword,
  signInAction,
  setCurrentStep,
  setAuthType
}: SignInProps) => {

  const t = useTranslations("signIn")

  return (
    <div className="flex flex-col w-3/5 items-center justify-center gap-0.5">
      <h1 className="font-semibold text-[32px] mb-3">{t("welcomeBack")}</h1>
      <LoginW3rdParty />
      <HrBar text={t("or")} />
      <InputGroup
        name="email"
        title="Email"
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        messageError={errorEmail}
        placeholder="example.email@gmail.com"
      />
      <InputGroup
        name="password"
        title="Password"
        type="password"
        required
        value={password}
        onChange={e => setPassword(e.target.value)}
        messageError={errorPassword}
        placeholder="Enter your password"
      />
      <SubmitButton parentClassname="mb-3" title={t("signIn")} onClick={signInAction} />
      <SubText text={[t("needAccount"), t("signUp")]} onNavigate={() => { setCurrentStep(2); setAuthType("signup") }} />
    </div>
  );
};

export default SignIn;
