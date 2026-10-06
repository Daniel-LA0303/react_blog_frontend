import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from "react-redux";
import store from './store'
import { UserAuthProvider } from './context/UserAuthContex';
import { GlobalDataProvider } from './context/GlobalState';
import { SocketProvider } from './context/SocketContext';
import { GoogleOAuthProvider } from '@react-oauth/google'

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  // <React.StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <UserAuthProvider>
    <Provider store={store}>
      <GlobalDataProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </GlobalDataProvider>
    </Provider>
  </UserAuthProvider>
  </GoogleOAuthProvider>
  // </React.StrictMode>
);
