import axios from "axios";
import { createContext, useContext } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
    async function loginUser(email, password, navigate) {
        try {
            const { data } = await axios.post("http://localhost:3000/api/authlogin", { email, password, navigate });
            toast.success(data.message);
            navigate("/");
        }
        catch (err) {
            toast.error("error.response.data.message");
        }
    }
    return (
        <UserContext.Provider value={{ loginUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => useContext(UserContext);   