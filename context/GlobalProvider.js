import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        getCurrentUser()
            .then((res) => {
                if(res) {
                    setLoggedIn(true);
                    setUser(res);
                } else {
                    setLoggedIn(true);
                    setUser(null);
                }
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, []);
    return (
        <GlobalContext.Provider value={{isLoggedIn, setLoggedIn, user, setUser, isLoading}}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;