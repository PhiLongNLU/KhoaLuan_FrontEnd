import ChatScreen from '../components/Home/ChatScreen';
import SideBar from "../components/Home/SideBar.tsx";

const Home = () => {
    return (
        <div className={"flex"}>
            <SideBar/>
            <ChatScreen/>
        </div>
    )
}

export default Home;