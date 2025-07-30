import Image from "next/image";
import React from "react";

const LoginW3rdParty = () => {
  return (
    <div className="flex justify-center space-x-4">
      <Image
      className="hover:cursor-not-allowed"
        src={"/socials/google-icon.svg"}
        width={50}
        height={50}
        alt="Login with Google Account"
      />
      <Image
      className="hover:cursor-not-allowed"
        src={"/socials/facebook-icon.svg"}
        width={50}
        height={50}
        alt="Login with Facebook Account"
      />
      <Image
      className="hover:cursor-not-allowed"
        src={"/socials/apple-icon.svg"}
        width={50}
        height={50}
        alt="Login with Apple Account"
      />
    </div>
  );
};

export default LoginW3rdParty;
