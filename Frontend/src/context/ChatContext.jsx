import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);

    async function createChat(id) {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/messages`, {
                receiverId: id,
                message: "Hi"
            }, {
                withCredentials: true
            });
            setChats([data.chat]); // Fix: Wrap chat data in an array
            setSelectedChat(data.chat); // Update selectedChat
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <ChatContext.Provider value={{
            createChat, selectedChat, chats, setChats, setSelectedChat
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const ChatData = () => useContext(ChatContext);