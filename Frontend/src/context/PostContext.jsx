import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PostContext = createContext();

export const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);

    async function fetchPosts() {
        try {
            const { data } = await axios.get('http://localhost:3000/api/post/all', {
                withCredentials: true
            });
            const allPosts = data.data;
            const allposts = data.data;
            setPosts(allPosts.filter(post => post.type === "post"));
            setReels(allposts.filter(post => post.type === "reel"));
        } catch (error) {
            console.log(error);
        }
    }

    async function addPost(formData, setFile, setFilePrev, setCaption, type) {
        try {
            const { data } = await axios.post('http://localhost:3000/api/post/new?type=' + type, formData, {
                withCredentials: true
            })
            toast.success(data.message);
            setFile('');
            setFilePrev('');
            setCaption('');
            fetchPosts();
        } catch (error) {
            toast.error(err.response?.data?.message || "Login failed. Please try again.");
            console.log(error.response?.data || error.message);
            
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
        <PostContext.Provider value={{ posts, reels, addPost }}>
            {children}
        </PostContext.Provider>
    );
};

export const PostData = () => useContext(PostContext);