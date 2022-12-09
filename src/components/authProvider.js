import { createContext, useEffect, useState } from "react";
import { getRequest } from "./requests";

const AuthProvider = () => {
    const AuthContext = createContext({});
    const user = JSON.parse(localStorage.getItem('user'))
    const [auth, setAuth] = useState(user);

    const verifyAuth = async () => {
        const response = await getRequest('/getUser')
        setAuth(typeof response === 'string' ? {} : (response._id === user._id ? auth : {}))
    }

    useEffect(() => {
        verifyAuth();
    }, [])

    useEffect(() => {
        setAuth(auth)
    }, [auth])

    return <AuthContext.Provider value={{ auth, setAuth }}></AuthContext.Provider>
}

export default AuthProvider;