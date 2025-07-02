import Chat from "../pages/Chat"
import SignIn from "../pages/SignIn.tsx"
import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import Home from "../pages/Home.tsx";
import Settings from "../pages/UserSetting.tsx";

const router = createBrowserRouter([{
    path: "/",
    element : <App/>,
    children : [
        {
            path : "auth",
            element : <SignIn/>
        },
        {
            path : "chat",
            element : <Chat />
        },
        {
            index : true,
            path : "",
            element : <Home/>
        },
        {
            path: "setting",
            element : <Settings/>
        }
        ,
        {
            path: "*",
            element: <div>404 Not Found</div>
        }
    ]
}])

export default router;