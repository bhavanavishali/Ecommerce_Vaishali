
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './Redux/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <GoogleOAuthProvider clientId= {import.meta.env.VITE_clientId} >
      <App />
    </GoogleOAuthProvider>
  </Provider>,
)
