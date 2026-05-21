import { useContext } from "react"
import GlobalDataContext from "../GlobalState";

const useGlobalDataContext = () => {
    const context = useContext(GlobalDataContext);

    if(!context){
        throw new Error("useGlobalDataContext must be used within UserAuthProvider");
    }

    return context;
}

export default useGlobalDataContext;
