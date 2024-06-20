import { useContext } from "react";
import PagesContext from "../PagesProvider";

const usePages = () => {
    return useContext(PagesContext);
}

export default usePages;