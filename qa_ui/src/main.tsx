import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'
import './styles/global.css'
import './i18n/config'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
