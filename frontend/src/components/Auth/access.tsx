import { useTranslations } from 'next-intl'
import React from 'react'
import InputGroup from '../Share/inputGroup'
import SubmitButton from '../Share/button'
import SubText from '../Share/subText'

interface AccessAccountProps {
  password: string,
  rePassword: string,
  setPassword: (password: string) => void,
  setRePassword: (password: string) => void,
  errorPassword: string,
  errorRePassword: string,
  onContinue: () => void,
  setCurrentStep: (step: number) => void,
  setAuthType: (type: "signin" | "signup") => void,
}

const AccessAccount = ({
  password,
  rePassword,
  setPassword,
  setRePassword,
  errorPassword,
  errorRePassword,
  onContinue,
  setCurrentStep,
  setAuthType
}: AccessAccountProps) => {

  const t = useTranslations("signUp")


  return (
    <div>
      <h1 className="font-semibold text-[32px] mb-3">{t("createAccount")}</h1>
      <InputGroup
        name="password"
        title={t("password")}
        type="password"
        required
        placeholder={t("enterPassword")}
        value={password}
        onChange={e => setPassword(e.target.value)}
        messageError={errorPassword}
      />
      <InputGroup
        name="re-password"
        title={t("retypePassword")}
        type="password"
        required
        placeholder={t("enterPassword")}
        value={rePassword}
        onChange={e => setRePassword(e.target.value)}
        messageError={errorRePassword}
      />
      <SubmitButton title={t("create")} onClick={onContinue} />
      <SubText text={[t("alreadyHaveAccount"), t("signIn")]} onNavigate={() => {setCurrentStep(0); setAuthType("signin")}} />
    </div>
  )
}

export default AccessAccount