import AuthType from "../components/Authenticate/AuthType.tsx";
import {useState} from "react";
import SignUp from "../components/Authenticate/SignUp.tsx";
import LogIn from "../components/Authenticate/LogIn.tsx";

const SignIn = () => {
    const [view, setView] = useState<"choose" | "signin" | "signup">("choose");
    return (
        <div id={"login-page"} className="flex items-center justify-center w-full h-screen bg-cover bg-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-pink-300">
                {view === "choose" ? <AuthType onChangeView={setView}/> : null}
                {view === "signin" ? <LogIn onChangeView={setView}/> : null}
                {view === "signup" ? <SignUp onChangeView={setView}/> : null}
            </div>
        </div>
    );
}

export default SignIn;