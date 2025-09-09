import { createContext, useState } from "react";

const GlobalDataContext = createContext();

const GlobalDataProvider = ({ children }) => {

    const [globalData, setGlobalData] = useState({
        themeGlobal: localStorage.getItem("theme") ?? true,
        link: "http://localhost:4000/api"
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