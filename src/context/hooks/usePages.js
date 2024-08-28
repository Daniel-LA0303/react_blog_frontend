import { useContext } from "react";
import PagesContext from "../PagesProfile";

const usePages = () => {
    return useContext(PagesContext);
}

export default usePages;