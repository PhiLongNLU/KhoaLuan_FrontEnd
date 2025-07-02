import ChatScreen from '../components/Home/ChatScreen';
import SideBar from "../components/Home/SideBar.tsx";
import {loadUser} from "../store/authSlice.ts";
import {Navigate} from "react-router-dom";

const Home = () => {

    const user = loadUser();

    if(!user) {
        return <Navigate to="/auth" />;
    }
    return (
        <div className={"flex"}>
            <SideBar/>
            <ChatScreen/>
        </div>
    )
}

export default Home;