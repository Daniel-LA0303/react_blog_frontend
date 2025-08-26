import { useContext } from "react"
import UserAuthContext from "../UserAuthContex"


const userUserAuthContext = () => {
    return useContext(UserAuthContext);
}

export default userUserAuthContext;