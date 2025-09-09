import { useContext } from "react"
import GlobalDataContext from "../GlobalState";

const useGlobalDataContext = () => {
    return useContext(GlobalDataContext);
}

export default useGlobalDataContext;
