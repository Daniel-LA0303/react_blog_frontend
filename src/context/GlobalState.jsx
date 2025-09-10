import { createContext, useState } from "react";

const GlobalDataContext = createContext();

const GlobalDataProvider = ({ children }) => {

    const [globalData, setGlobalData] = useState({
        themeGlobal: localStorage.getItem("theme") ?? true,
        link: import.meta.env.VITE_API_URL_BACKEND
    });

    return(
        <GlobalDataContext.Provider value={{
            globalData,
            setGlobalData
        }}>
            {children}
        </GlobalDataContext.Provider>
    )
}

export {GlobalDataProvider};
export default GlobalDataContext;