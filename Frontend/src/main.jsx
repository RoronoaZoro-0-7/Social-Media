import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserContextProvider } from "./context/UserContext.jsx";
import { PostContextProvider } from "./context/PostContext.jsx";
import { ChatContextProvider } from "./context/ChatContext.jsx";
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <PostContextProvider>
        <ChatContextProvider>
          <App />
        </ChatContextProvider>
      </PostContextProvider>
    </UserContextProvider>
  </StrictMode>,
);