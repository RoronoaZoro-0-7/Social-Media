import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../context/SocketContext';
import { UserData } from '../context/UserContext';
import axios from 'axios';

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef(null);
  const { socket } = useSocket();
  const { user } = UserData();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/message/all/chats', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true
        });
        setChats(response.data.chats);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (user) {
      fetchChats();
    }
  }, [user]);

  // Load messages for selected chat
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedChat) return;
      
      try {
        const response = await axios.get(`http://localhost:3000/api/message/${selectedChat._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          withCredentials: true
        });
        setMessages(response.data.msg || []);
        console.log("Fetched messages:", response.data.msg);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [selectedChat]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message) => {
      console.log('Received message via socket:', message);
      if (selectedChat && message.chatId === selectedChat._id) {
        setMessages(prev => {
          // Prevent duplicate messages (by _id if available, else by text+sender+createdAt)
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            if ((message._id && last._id === message._id) ||
                (!message._id && last.text === message.text && last.sender === message.sender && last.createdAt === message.createdAt)) {
              return prev;
            }
          }
          return [...prev, message];
        });
      }
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [socket, selectedChat]);

  // Search users
  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3000/api/user/all/profiles?search=${searchQuery}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      setSearchResults((response.data.user || []).filter(u => u._id !== user._id));
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(searchUsers, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    const messageObj = {
      receiverId: selectedChat._id,
      message: newMessage,
      sender: user._id,
      senderName: user.name,
      senderProfilePic: user.profilePic,
      chatId: selectedChat._id,
      text: newMessage,
      createdAt: new Date().toISOString()
    };
    try {
      socket.emit('send_message', messageObj);
      await axios.post('http://localhost:3000/api/message', {
        receiverId: selectedChat._id,
        message: newMessage
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      setMessages(prev => [...prev, messageObj]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Start new chat
  const startChat = async (otherUser) => {
    try {
      const response = await axios.post('http://localhost:3000/api/message/start-chat', {
        recipientId: otherUser._id
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        withCredentials: true
      });
      // Prevent duplicate chats in the chat list
      setChats(prev => {
        const exists = prev.some(c => c._id === response.data._id);
        if (exists) return prev;
        return [response.data, ...prev];
      });
      setSelectedChat(response.data);
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-screen bg-gray-100 ml-0 md:ml-20 p-4">
      <div className="flex h-[calc(100vh-2rem)] bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Chat List */}
        <div className="w-full md:w-[350px] border-r border-gray-200 flex flex-col">
          <div className="p-5 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 m-0">Messages</h2>
            <button 
              className="bg-transparent border-none text-xl cursor-pointer p-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => setShowSearch(!showSearch)}
            >
              🔍
            </button>
          </div>

          {/* Search Section */}
          {showSearch && (
            <div className="p-4 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500"
              />
              <div className="mt-2 max-h-48 overflow-y-auto">
                {searchResults.map(u => (
                  <div 
                    key={u._id} 
                    className="flex items-center p-2 cursor-pointer rounded-md hover:bg-gray-100"
                    onClick={() => startChat(u)}
                  >
                    <img 
                      src={u.profilePic?.url || u.profilePic || '/default-avatar.png'} 
                      alt={u.name}
                      className="w-9 h-9 rounded-full mr-3 object-cover"
                    />
                    <span>{u.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {Array.isArray(chats) && chats.length > 0 ? chats.map(chat => {
              // Extract the other user from chat.users
              const otherUser = (chat.users && chat.users.length > 0) ? chat.users[0] : null;
              return otherUser ? (
                <div
                  key={chat._id}
                  className={`flex items-center p-4 cursor-pointer border-b border-gray-100 transition-colors ${selectedChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedChat({ ...chat, ...otherUser })}
                >
                  <img 
                    src={otherUser.profilePic?.url || otherUser.profilePic || '/default-avatar.png'} 
                    alt={otherUser.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800">{otherUser.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{chat.latestMessage?.text || 'No messages yet'}</p>
                  </div>
                </div>
              ) : null;
            }) : <div className="p-4 text-gray-500">No chats yet</div>}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              <div className="p-5 border-b border-gray-200 flex items-center bg-gray-50">
                <img 
                  src={selectedChat.profilePic?.url || selectedChat.profilePic || '/default-avatar.png'} 
                  alt={selectedChat.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <h3 className="text-lg font-semibold text-gray-800">{selectedChat.name}</h3>
              </div>

              <div className="flex-1 p-5 overflow-y-auto bg-gray-100">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex mb-4 ${message.sender === user._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${message.sender === user._id ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-lg'}`}>
                      <p className="text-sm">{message.text}</p>
                      <span className="text-xs opacity-70 mt-1 block text-right">
                        {new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-200 flex items-center gap-3 bg-white">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows="1"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full resize-none outline-none text-sm focus:border-blue-500"
                />
                <button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="px-5 py-2 bg-blue-500 text-white rounded-full cursor-pointer text-sm font-medium transition-colors hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 