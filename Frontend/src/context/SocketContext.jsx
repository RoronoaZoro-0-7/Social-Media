import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { UserData } from './UserContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = UserData();

    useEffect(() => {
        const newSocket = io(import.meta.env.VITE_API_URL, {
            withCredentials: true,
        });
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket && user && user._id) {
            socket.emit('join', user._id);
        }
    }, [socket, user]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext); 