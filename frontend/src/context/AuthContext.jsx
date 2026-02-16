import React, { createContext, useContext, useState, useEffect } from "react";
import { loginUser as loginApi, registerUser as registerApi } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing token/user on load
        const storedUser = localStorage.getItem("user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email, password) => {
        try {
            const data = await loginApi({ email, password });
            if (data.success) {
                setToken(data.token);
                setUser(data);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await registerApi({ name, email, password });
            if (data.success) {
                setToken(data.token);
                setUser(data);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                return { success: true };
            }
            return { success: false, message: data.message };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
