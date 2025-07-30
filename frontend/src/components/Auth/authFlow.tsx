"use client";
import React, { useEffect, useRef, useState } from "react";
import WelcomeScreen from "./welcome";
import { useTranslations } from "next-intl";
import AccessAccount from "./access";
import SignIn from "./signin";
import { Icon } from "@iconify/react/dist/iconify.js";
import CreateAccount from "./create";
import AuthService from "@/services/auth.service";
import { EncryptService } from "@/services/encrypt.service";
import SpinnerOverlay from "../Share/spinnerOverlay";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const AuthFlow = () => {
  const authService = AuthService.getInstance()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState(false)
  const [authType, setAuthType] = useState<"signin" | "signup">()
  const [profile, setProfile] = useState({
    email: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    rePassword: "",
  })

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    rePassword: false,
  });

  const EMAIL_REGEX: RegExp = /\S+@\S+\.\S+/g

  const validateEmail = (email: string) => {
    if (!email) return t("emailRequired");
    if (!EMAIL_REGEX.test(email)) return t("emailInvalid");
    return "";
  };

  const validatePassword = (password: string, rePassword: string) => {
    if (!password || password.trim() === "") return t("passwordRequired");
    if (/\s/.test(password)) return t("passwordNoWhitespace");
    if (password.length > 15) return t("passwordMaxLength");
    if (password !== rePassword) return t("passwordMismatch");
    return "";
  };

  useEffect(() => {
    setTouched({
      email: false,
      password: false,
      rePassword: false,
    });
    setProfile({
      email: "",
      password: "",
      rePassword: "",
    });
    setErrors({
      email: "",
      password: "",
      rePassword: "",
    });
  }, [authType]);

  useEffect(() => {
    if (touched.email && (currentStep === 2 || currentStep === 0)) {
      const emailError = validateEmail(profile.email);
      setErrors((prev) => ({ ...prev, email: emailError }));
    }
  }, [profile.email, currentStep, touched.email]);

  useEffect(() => {
    if ((touched.password || touched.rePassword) && currentStep === 3) {
      const passwordError = validatePassword(profile.password, profile.rePassword);
      setErrors((prev) => ({
        ...prev,
        password: passwordError,
        rePassword: passwordError,
      }));
    }
  }, [profile.password, profile.rePassword, currentStep, touched.password, touched.rePassword]);

  const createAccount = async () => {
    setLoading(true)

    const emailError = validateEmail(profile.email);
    const passwordError = validatePassword(profile.password, profile.rePassword);

    if (emailError || passwordError) {
      setErrors({ ...errors, email: emailError, password: passwordError, rePassword: passwordError });
      setLoading(false)
      return;
    }

    try {
      const hash = EncryptService.hashString(profile.password)
      await authService.register({ email: profile.email, password: hash });
      toast.success(t("accountCreated"))
      setCurrentStep(1)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const loginAccount = async () => {
    setLoading(true)
    const emailError = validateEmail(profile.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      setTouched((prev) => ({ ...prev, email: true }));
      setLoading(false)
      router.push("/")
    }

    try {
      const hash = EncryptService.hashString(profile.password)
      const response = await authService.login({ email: profile.email, password: hash });
      sessionStorage.setItem("access_token", response.access_token)
      toast.success(t("loginSuccess"))
      setCurrentStep(1)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }


  const renderStep = () => {
    switch (currentStep) {
      case 0:
        // sign in
        return <SignIn
          email={profile.email}
          setEmail={(email: string) => {
            setProfile({ ...profile, email })
            setTouched((prev) => ({ ...prev, email: true }));
          }}
          errorEmail={errors.email}
          password={profile.password}
          setPassword={(password: string) => {
            setProfile({ ...profile, password })
            setTouched((prev) => ({ ...prev, password: true }));
          }}
          errorPassword={errors.password}
          signInAction={() => {
            loginAccount()
          }}
          setCurrentStep={setCurrentStep}
          setAuthType={setAuthType}


        />;
      case 2:
        return <CreateAccount
          email={profile.email}
          setEmail={(email: string) => {
            setProfile({ ...profile, email })
            setTouched((prev) => ({ ...prev, email: true }));
          }}
          errorEmail={errors.email}
          onContinue={() => {
            const emailError = validateEmail(profile.email);
            setErrors((prev) => ({ ...prev, email: emailError }));
            setTouched((prev) => ({ ...prev, email: true }));
            if (!emailError) setCurrentStep(3);
          }}
          setCurrentStep={setCurrentStep}
          setAuthType={setAuthType}
        />;
      case 3:
        return <AccessAccount
          password={profile.password}
          rePassword={profile.rePassword}
          setPassword={(password) => {
            setProfile({ ...profile, password });
            setTouched((prev) => ({ ...prev, password: true }));
          }}
          setRePassword={(rePassword) => {
            setProfile({ ...profile, rePassword });
            setTouched((prev) => ({ ...prev, rePassword: true }));
          }}
          errorPassword={errors.password}
          errorRePassword={errors.rePassword}
          onContinue={() => {
            const passwordError = validatePassword(profile.password, profile.rePassword);
            setErrors((prev) => ({
              ...prev,
              password: passwordError,
              rePassword: passwordError,
            }));
            setTouched((prev) => ({ ...prev, password: true, rePassword: true }));
            if (!passwordError) createAccount();
          }}
          setCurrentStep={setCurrentStep}
          setAuthType={setAuthType}
        />;
      default:
        return (
          <WelcomeScreen
            signInAction={() => setCurrentStep(0)}
            signUpAction={() => setCurrentStep(2)}
          />
        );
    }
  };

  const t = useTranslations("welcome");

  return (
    <div className="relative w-[560px] h-[472px] bg-white rounded-2xl shadow-lg border-2 border-pink-300 flex items-center justify-center">
      {currentStep !== 1 && (
        <button
          className="absolute top-5 left-4"
          onClick={() => {
            if (currentStep < 1) setCurrentStep(currentStep + 1);
            else if (currentStep > 1) setCurrentStep(currentStep - 1);
          }}
        >
          <Icon icon={"grommet-icons:link-previous"} />
        </button>
      )}
      {renderStep()}
      {loading && (
        <SpinnerOverlay />
      )}
    </div>
  );
};

export default AuthFlow;
