import React, { useEffect, useState } from 'react';
import { ChatData } from '../context/ChatContext';
import { FaSearch } from "react-icons/fa";
import Chat from '../components/chat/Chat';
import axios from 'axios';
import MessageContainer from '../components/chat/MessageContainer';

const ChatPage = ({ user }) => {
    const { createChat, selectedChat, setSelectedChat, chats, setChats } = ChatData();

    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(false);

    async function fetchAllUsers() {
        try {
            const { data } = await axios.get('http://localhost:3000/api/user/all/profiles?search=' + query, {
                withCredentials: true
            });
            setUsers(data.user);
        } catch (error) {
            console.log(error);
        }
    }

    async function getAllChats() {
        try {
            const { data } = await axios.get('http://localhost:3000/api/message/all/chats', {
                withCredentials: true
            });
            setChats(data.chats);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchAllUsers();
    }, [query]);

    useEffect(() => {
        getAllChats();
    }, []);
    useEffect(() => {
        console.log(selectedChat);
    }, [selectedChat]);

    return (
        <div className="w-[100%] md:w-[750px] md:p-4 ml-[80px]">
            <div className="flex gap-4 mx-auto">
                <div className="w-[30%]">
                    <div className="top relative ">
                        <button
                            onClick={() => setSearch(!search)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-full"
                        >
                            {search ? " X " : <FaSearch />}
                        </button>
                        {search ? (
                            <>
                                <input
                                    className='custom-input'
                                    type="text"
                                    style={{ width: "170px", border: '1px solid gray' }}
                                    placeholder="Enter name"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                                <div className="users">
                                    {users && users.length > 0 &&
                                        users.map((e) => (
                                            <div
                                                key={e._id}
                                                className="bg-gray-500 text-white p-2 mt-2 cursor-pointer flex justify-center items-center gap-2"
                                                onClick={() => createChat(e._id)} // Create chat when user is clicked
                                            >
                                                <img
                                                    src={e.profilePic?.url}
                                                    alt={e.name}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                {e.name}
                                            </div>
                                        ))
                                    }
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col justify-center items-center mt-8">
                                {chats && chats.map((e) => (
                                    <Chat key={e._id} chat={e} setSelectedChat={setSelectedChat} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                {
                    selectedChat === null ? (
                        <div className='w-[70%] mx-20 mt-40 text-2xl'>
                            Hello 👋 {user.name} select a chat to start conversation
                        </div>
                    ) : (
                        <div className='w-[70%]'>
                            <MessageContainer selectedChat={selectedChat} setChats={setChats} />
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default ChatPage;