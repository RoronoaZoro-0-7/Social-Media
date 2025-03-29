import React, { createContext, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    async function loginUser(email, password, navigate) {
        try {
            const { data } = await axios.post("http://localhost:3000/api/auth/login", { email, password });
            const { msg, user } = data;
            toast.success(data);
            console.log(user);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
            console.log(err.response?.data || err.message);
        }
    }
    return (
        <UserContext.Provider value={{ loginUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const UserData = () => useContext(UserContext);