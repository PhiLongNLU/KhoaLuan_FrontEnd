import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'
import './styles/global.css'
import './i18n/config'
import {RouterProvider} from "react-router-dom";
import router from "./routers/router.tsx";
import {Provider} from "react-redux";
import {store} from "./store/store.ts";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <RouterProvider router={router}/>
      </Provider>
  </StrictMode>,
)
