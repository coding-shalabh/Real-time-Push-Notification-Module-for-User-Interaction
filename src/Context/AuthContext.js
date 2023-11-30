import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const useAuth = ()=> {
    return useContext(AuthContext);
}

const AuthProvider = ({children})=> {
    const [auth, setAuth] = useState(false);
    const [userData, setData] = useState(null);
    const value = {auth,setAuth, userData, setData} 
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export {AuthContext, AuthProvider, useAuth}