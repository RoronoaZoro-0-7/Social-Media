import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);

    async function fetchPosts() {
        try {
            const { data } = await axios.get('http://localhost:3000/api/post/all', {
                withCredentials: true
            });
            if (Array.isArray(data.data)) {
                const allPosts = data.data;
                setPosts(allPosts.filter(post => post.type === "post"));
                setReels(allPosts.filter(post => post.type === "reel")); // Assuming "reel" is the type for reels
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        console.log('All posts:', posts);
        console.log('All reels:', reels);
    }, [posts, reels]);

    return (
        <PostContext.Provider value={{ posts, reels }}>
            {children}
        </PostContext.Provider>
    );
};

export const PostData = () => useContext(PostContext);