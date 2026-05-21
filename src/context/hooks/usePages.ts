import { useContext } from "react";
import PagesContext from "../PagesProfile";

const usePages = () => {
    const context = useContext(PagesContext);
    if (!context) {
        throw new Error("useSocketContext must be used within SocketProvider");
    }
    return context
}

export default usePages;