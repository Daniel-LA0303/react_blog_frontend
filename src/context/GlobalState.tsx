import { createContext, ReactNode, useState } from "react";

type GlobalData = {
  themeGlobal: boolean;
  link: string;
};

type GlobalDataContextType = {
  globalData: GlobalData;
  setGlobalData: React.Dispatch<React.SetStateAction<GlobalData>>;
};

type Props = {
  children: ReactNode;
};

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

const GlobalDataProvider = ({ children }: Props ) => {

    const [globalData, setGlobalData] = useState<GlobalData>(() => {
        const storedTheme = localStorage.getItem("theme");
        return {
            themeGlobal: storedTheme ? JSON.parse(storedTheme) : true, // ahora sí boolean real
            link: import.meta.env.VITE_API_URL_BACKEND
        };
    });


    return (
        <GlobalDataContext.Provider value={{
            globalData,
            setGlobalData
        }}>
            {children}
        </GlobalDataContext.Provider>
    )
}

export { GlobalDataProvider };
export default GlobalDataContext;