import ChatScreen from '../components/Home/ChatScreen';
import SideBar from "../components/Home/SideBar.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.ts";
import {Navigate} from "react-router-dom";

const Home = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth)

    if(!isAuthenticated) {
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