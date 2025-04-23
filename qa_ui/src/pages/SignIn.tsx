import LogIn from "../components/Authenticate/LogIn.tsx";

const SignIn = () => {
    return (
        <div id={"login-page"} className="flex items-center justify-center w-full h-screen bg-cover bg-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center border-2 border-pink-300">
                <LogIn />
            </div>
        </div>
    );
}

export default SignIn;