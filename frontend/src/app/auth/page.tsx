import React from "react";
import AuthFlow from '@/components/Auth/authFlow';

const AuthPage = () => {

  return (
    <>
      <div
        className="flex items-center justify-center w-full h-screen bg-cover bg-center bg-[url(/background/landing-page.svg)]"
      >
        <AuthFlow />
      </div>
    </>
  );
};

export default AuthPage;
