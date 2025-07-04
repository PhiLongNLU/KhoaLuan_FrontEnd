import { Provider, useDispatch, useSelector } from "react-redux";
import ChatScreen from "../components/Home/ChatScreen";
import SideBar from "../components/Home/SideBar.tsx";
import { loadUser, setCredentials } from "../store/authSlice.ts";
import { Navigate } from "react-router-dom";
import { AppDispatch, store } from "../store/store.ts";

const Home = () => {
  const userData = loadUser();
  const dispatch = useDispatch<AppDispatch>();

  if (!userData.user || !userData.token) {
    return <Navigate to="/auth" />;
  } else {
    dispatch(
      setCredentials({
        token: userData.token,
        user: userData.user,
      })
    );

    return (
      <Provider store={store}>
        <div className={"flex"}>
          <SideBar />
          <ChatScreen />
        </div>
      </Provider>
    );
  }
};

export default Home;
