import { createContext, useContext, useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const PostContext = createContext();

const showToast = (msg) => {
    toast(msg, {
        position: "top-right",
        autoClose: 2400,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
        style: {
            border: '1px solid #4ade80',
            padding: '16px',
            color: '#166534',
            backgroundColor: '#dcfce7',
        },
    });
};

export const PostContextProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);
    const [reels, setReels] = useState([]);

    async function fetchPosts() {
        try {
            const { data } = await axios.get('http://localhost:3000/api/post/all', {
                withCredentials: true
            });
            const allPosts = data.data;
            setPosts(allPosts.filter(post => post.type === "post"));
            setReels(allPosts.filter(post => post.type === "reel"));
        } catch (error) {
            console.log(error);
        }
    }

    async function likePost(id) {
        let msg;
        try {
            const { data } = await axios.post("http://localhost:3000/api/post/like/" + id, {}, {
                withCredentials: true
            });
            msg = data.message;
            fetchPosts();
        } catch (err) {
            msg = err.response?.data?.message || "Like failed. Please try again.";
        }
        showToast(msg);
    }

    async function addComment(id, comment, setComment, setShow) {
        let msg;
        try {
            const { data } = await axios.post('http://localhost:3000/api/post/comment/' + id, { comment }, {
                withCredentials: true
            })
            msg = "Comment added (placeholder)";
            setComment('');
            setShow(false);
            fetchPosts();
        } catch (error) {
            msg = error.response?.data?.message || "Adding comment failed.";
        }
        showToast(msg);
    }

    async function addPost(formData, setFile, setFilePrev, setCaption, type) {
        let msg;
        try {
            const { data } = await axios.post(
                'http://localhost:3000/api/post/new?type=' + type,
                formData,
                { withCredentials: true }
            );
            msg = data.message;
            setFile('');
            setFilePrev('');
            setCaption('');
            fetchPosts();
        } catch (error) {
            msg = error.response?.data?.message || "Adding post failed.";
            console.log(error.response?.data || error.message);
        }
        showToast(msg);
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        console.log('All posts:', posts);
        console.log('All reels:', reels);
    }, [posts, reels]);

    return (
        <PostContext.Provider value={{ posts, reels, addPost, likePost, addComment }}>
            {children}
        </PostContext.Provider>
    );
};

export const PostData = () => useContext(PostContext);