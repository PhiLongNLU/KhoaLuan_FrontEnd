import Chat from "../pages/Chat"
import SignIn from "../pages/SignIn.tsx"
import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";

const router = createBrowserRouter([{
    path: "/",
    element : <App/>,
    children : [
        {path : "", element : <SignIn/>},
        {path : "chat", element : <Chat />},
    ]
}])

export default router;