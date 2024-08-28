import { createContext, useEffect, useState } from "react";

const PagesContext = createContext();

const PagesProvider = ({ children }) => {

    const[errorPage, setErrorPage] = useState({
        error: false,
        message: {}
    });


    return (
        <PagesContext.Provider value={{
            errorPage,
            setErrorPage
        }}>
            {children}
        </PagesContext.Provider>
    )

} 

export {PagesProvider}
export default PagesContext;