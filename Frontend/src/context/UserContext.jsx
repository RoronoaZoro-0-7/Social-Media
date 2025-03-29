import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    async function registerUser(formData, navigate) {
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/register", formData, {
                withCredentials: true
            })
            toast.success(data.message);
            setIsAuth(true);
            setUser(data.user);
            setLoading(false);
            navigate("/");
        } catch (err) {
            setLoading(false);
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
            console.log(err.response?.data || err.message);
        }
    }

    async function loginUser(email, password, navigate) {
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/login",
                { email, password },
                { withCredentials: true });
            const { message, user } = data;
            toast.success(message);
            setIsAuth(true);
            setUser(user);
            setLoading(false);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
            console.log(err.response?.data || err.message);
        }
    }

    async function logoutUser(navigate) {
        try {
            const { data } = await axios.get('http://localhost:3000/api/auth/logout', {
                withCredentials: true
            });
            if (data.message) {
                toast.success(data.message);
                setUser({});
                setIsAuth(false);
                setLoading(false);
                navigate('/login');
            }
        } catch (error) {
            toast.error(err.response?.data?.message || "Logout failed. Please try again.");
        }
    }

    useEffect(() => {
        fetchUser();
    }, [])
    useEffect(() => {
        console.log("Updated User State:", user);
    }, [user]);

    async function fetchUser() {
        try {
            const { data } = await axios.get("http://localhost:3000/api/user/me", {
                withCredentials: true
            });
            setUser(data.user);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setIsAuth(false);
            setLoading(false);
        }
    }

    return (
        <UserContext.Provider value={{
            loginUser, isAuth, setIsAuth, user, setUser, loading, setLoading, logoutUser,
            registerUser
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);