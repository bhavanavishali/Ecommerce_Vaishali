
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './Redux/store'
import { Provider } from 'react-redux'
import { GoogleOAuthProvider } from '@react-oauth/google';


createRoot(document.getElementById('root')).render(
   <Provider store={store}>
    <GoogleOAuthProvider clientId="813683303296-v7n580lkfldq8e4qof381aqcpss6cedo.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </Provider>,
)
