import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useEffect } from "react";

const UserContext = createContext();

const showToast = (msg) => {
    toast(msg, {
        position: "top-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
            border: '1px solid #4ade80',
            padding: '16px',
            color: '#166534',
            backgroundColor: '#dcfce7',
        },
    });
};

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    async function registerUser(formData, navigate, fetchPosts) {
        setLoading(true);
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/register", formData, {
                withCredentials: true
            })
            toast.success(data.message);
            setIsAuth(true);
            setUser(data.user);
            setLoading(false);
            showToast("New User Registered Successfully.");
            navigate("/");
            fetchPosts();
        } catch (err) {
            setLoading(false);
            showToast("Registration failed. Please try again.");
        }
    }

    async function loginUser(email, password, navigate, fetchPosts) {
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
            showToast("User Logged In Successfully.");
            fetchPosts();
        } catch (err) {
            showToast("Login failed. Please try again.");
            console.log(err.response?.data || err.message);
            try {
                sleep(2000);
            } catch (error) {
                showToast("Login failed. Please try again.");
            }
            navigate("/login");
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
                showToast("User Logged Out Successfully.");
                navigate('/login');
            }
        } catch (error) {
            showToast("Logout failed. Please try again.");
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

    async function updateUser(id, fromData, setFile) {
        try {
            const { data } = await axios.put('http://localhost:3000/api/user/' + id, fromData, {
                withCredentials: true
            })
            setUser(data.user);
            showToast("Updated Profile Details");
        } catch (error) {
            showToast("Encountered some error.");
        }
        setFile('');
    }

    async function updatePwd(id, payload, setOldPwd, setNewPwd, setShowPwd) {
        try {
            const { data } = await axios.post(`http://localhost:3000/api/user/${id}`, payload, {
                withCredentials: true
            });
            showToast("Updated Password");
            setOldPwd('');
            setNewPwd('');
            setShowPwd(false);
        } catch (error) {
            console.log(error.response?.data || error);
            showToast("Encountered some error.");
        }
    }

    return (
        <UserContext.Provider value={{
            loginUser, isAuth, setIsAuth, user, setUser, loading, setLoading, logoutUser,
            registerUser, updateUser, updatePwd
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);