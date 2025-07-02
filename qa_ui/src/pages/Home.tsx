import ChatScreen from '../components/Home/ChatScreen';
import SideBar from "../components/Home/SideBar.tsx";
import {loadUser} from "../store/authSlice.ts";
import {Navigate} from "react-router-dom";

const Home = () => {

    const userData = loadUser();

    if(!userData.user) {
        return <Navigate to="/auth" />;
    }
    else{
        return (
            <div className={"flex"}>
                <SideBar/>
                <ChatScreen/>
            </div>
        )
    }
}

export default Home;