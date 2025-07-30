import { useTranslations } from "next-intl";
import React from "react";
import LoginW3rdParty from "./loginW3rd";
import HrBar from "../Share/hrBar";
import InputGroup from "../Share/inputGroup";
import SubmitButton from "../Share/button";
import SubText from "../Share/subText";

interface CreateAccountProps {
  email: string;
  setEmail: (email: string) => void;
  errorEmail: string;
  onContinue: () => void;
  setCurrentStep: (step: number) => void;
  setAuthType: (type: "signin" | "signup") => void;
}

const CreateAccount: React.FC<CreateAccountProps> = ({
  email,
  setEmail,
  errorEmail,
  onContinue,
  setCurrentStep,
  setAuthType
}) => {
  const t = useTranslations("signUp");
  return (
    <div className="">
      <h1 className="font-semibold text-[32px] mb-3">{t("createAccount")}</h1>
      <LoginW3rdParty />
      <HrBar text={t("or")} />
      <InputGroup
        name="email"
        title="Email"
        type="email"
        required
        placeholder="example.email@gmail.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        messageError={errorEmail}
      />
      <SubmitButton title={t("continue")} onClick={onContinue} />
      <SubText text={[t("alreadyHaveAccount"), t("signIn")]} onNavigate={() => { setCurrentStep(0); setAuthType("signin") }} />
    </div>
  );
};

export default CreateAccount;
