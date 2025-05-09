import React, { useState, useEffect } from "react";
import { UserData } from "../../context/UserContext";
import { LoadingAnimation } from "../../pages/Loading";
import Message from "./Message";
import axios from "axios";

const MessageContainer = ({ selectedChat, setChats }) => {
    const [messages, setMessages] = useState([]);
    const { user } = UserData();
    const [loading, setLoading] = useState(false);

    async function fetchMessages() {
        setLoading(true);
        try {
            const { data } = await axios.get(
                'http://localhost:3000/api/message/' + selectedChat.users[0]._id,
                { withCredentials: true }
            );
            setMessages(data.msg);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (selectedChat && selectedChat.users && selectedChat.users[0]) {
            fetchMessages();
        }
    }, [selectedChat]);

    return (
        <div>
            {selectedChat && (
                <div className="flex flex-col">
                    <div className="flex w-full h-12 items-center gap-3">
                        <img src={selectedChat.users[0].profilePic.url} className="w-8 h-8 rounded-full" alt="" />
                        <span>{selectedChat.users[0].name}</span>
                    </div>
                    {loading ? (
                        <LoadingAnimation />
                    ) : (
                        <div className="flex flex-col gap-4 my-4 h-[400px] overflow-y-auto">
                            {
                                messages && messages.map((e) => (
                                    <Message key={e._id} message={e.text} ownMessage={e.sender === user._id && true}/>
                                ))
                            }
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MessageContainer;