import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from "react-redux";
import store from './store'
import { UserAuthProvider } from './context/UserAuthContex';
import { GlobalDataProvider } from './context/GlobalState';

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <Provider store={store}>
    <GlobalDataProvider>
      <UserAuthProvider>
        <App />
      </UserAuthProvider>
    </GlobalDataProvider>
  </Provider>
  //  </React.StrictMode>
)
