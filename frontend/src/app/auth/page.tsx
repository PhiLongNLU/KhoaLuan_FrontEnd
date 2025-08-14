import React from "react";
import AuthFlow from '@/components/Auth/authFlow';
import clsx from "clsx";

const AuthPage = () => {

  return (
    <>
      <div
        className={
          clsx(
            "flex items-center justify-center",
            "w-full h-screen",
            "bg-cover bg-center bg-[url(/background/landing-page.svg)]"
          )
        }
      >
        <AuthFlow />
      </div>
    </>
  );
};

export default AuthPage;
