import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) setIsLoggedIn(true);
    }, []);

    const login = (userId) => {
        localStorage.setItem("userId", userId);
        setIsLoggedIn(true);
    };

    const logout = () => {
        localStorage.removeItem("userId");
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
