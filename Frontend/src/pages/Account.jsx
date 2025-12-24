import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContext';
import PostCard from '../components/PostCard';
import Modal from '../components/Modal';
import axios from 'axios';
import { FaEdit } from "react-icons/fa";

const Account = ({ user }) => {
    const navigate = useNavigate();
    const { logoutUser, updateUser, updatePwd } = UserData();
    const { posts, reels } = PostData();

    const [showPosts, setShowPosts] = useState(true);
    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    const myPosts = posts?.filter(post => post.owner._id === user._id) || [];
    const myReels = reels?.filter(reel => reel.owner._id === user._id) || [];

    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);

    const [file, setFile] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [newUserName, setNewUserName] = useState('');

    const [showPwd, setShowPwd] = useState(false);
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');

    async function followData() {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/followdata/${user._id}`, {}, {
                withCredentials: true
            });
            setFollowersData(data.followers);
            setFollowingData(data.following);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        followData();
    }, [user._id]);

    const logoutHandler = () => {
        logoutUser(navigate);
    };

    const changeFileHandler = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.readAsDataURL(file);

        reader.onloadend = () => {
            setFile(file);
        };
    };

    const changeImageHandler = () => {
        const formData = new FormData();
        formData.append('file', file);
        updateUser(user._id, formData, setFile);
    }

    const changeUserNameHandler = () => {
        const formData = new FormData();
        formData.append('name', newUserName);
        setShowInput(false);
        updateUser(user._id, formData, setNewUserName);
    }

    const pwdHandler = (e) => {
        e.preventDefault();
        const payload = {
            oldPassword: oldPwd,
            newPassword: newPwd
        };
        updatePwd(user._id, payload, setOldPwd, setNewPwd, setShowPwd);
    };

    return (
        <>
            {user && (
                <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
                    <div className="flex justify-center bg-white p-8 rounded-lg shadow-md max-w-md gap-4">
                        <div className="image flex flex-col items-center gap-4">
                            <img src={user.profilePic.url} alt="Profile" className="w-[180px] h-[180px] rounded-full shadow-md object-cover" />
                            <label className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-4 py-2 rounded-md shadow">
                                Choose Image
                                <input type="file" onChange={changeFileHandler} className="hidden" />
                            </label>
                            <button onClick={changeImageHandler} disabled={!file}
                                className={`px-4 py-2 rounded-md shadow font-semibold transition ${file
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                    }`}>
                                Update Picture
                            </button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {showInput ? (
                                <div className="flex justify-center items-center gap-2">
                                    <input className="custom-input" type="text" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} style={{ width: "80px" }} />
                                    <button className='bg-blue-500 text-white rounded-md w-20 h-8' onClick={changeUserNameHandler}>Update</button>
                                    <button className='bg-red-500 text-white rounded-md w-5 h-7' onClick={() => setShowInput(false)}>X</button>
                                </div>
                            ) : (
                                <p className="text-gray-800 font-semibold">
                                    {user.name} <button className='text-gray-500 text-base' onClick={() => setShowInput(true)}><FaEdit /></button>
                                </p>
                            )}
                            <p className="text-gray-500 text-sm">{user.email}</p>
                            <p className="text-gray-500 text-sm">{user.gender}</p>
                            <p className="text-gray-500 text-sm">
                                <button onClick={() => setShowFollowers(true)} className="hover:text-blue-600">
                                    {user.followers.length} follower
                                </button>
                            </p>
                            <p className="text-gray-500 text-sm">
                                <button onClick={() => setShowFollowing(true)} className="hover:text-blue-600">
                                    {user.following.length} following
                                </button>
                            </p>
                            <button
                                onClick={logoutHandler}
                                className="bg-red-500 hover:bg-green-600 text-white font-semibold rounded-full px-5 py-2 shadow-md transition duration-100 ease-in-out transform hover:scale-105">
                                Logout
                            </button>
                        </div>
                    </div>
                    <button className='bg-blue-500 px-2 py-1 rounded-sm text-white' onClick={() => setShowPwd(!showPwd)}>
                        {showPwd ? "X" : "Update Password"}
                    </button>
                    {showPwd && (
                        <form onSubmit={pwdHandler} className="flex flex-col gap-3 w-full max-w-sm mt-4">
                            <input type="password" onChange={(e) => setOldPwd(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Old Password" required />
                            <input type="password" onChange={(e) => setNewPwd(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="New Password" required />
                            <button type="submit" className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white font-medium shadow-md">
                                Update Password
                            </button>
                        </form>)}

                    <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
                        <button
                            onClick={() => setShowPosts(true)}
                            className={`px-4 py-2 rounded ${showPosts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            Posts
                        </button>
                        <button
                            onClick={() => setShowPosts(false)}
                            className={`px-4 py-2 rounded ${!showPosts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                            Reels
                        </button>
                    </div>

                    {showPosts ? (
                        myPosts.length > 0
                            ? myPosts.map((post) => <PostCard key={post._id} type="post" value={post} />)
                            : <p>No Posts Yet</p>
                    ) : (
                        myReels.length > 0
                            ? myReels.map((reel) => <PostCard key={reel._id} type="reel" value={reel} />)
                            : <p>No Reels Yet</p>
                    )}
                </div>
            )}

            {showFollowers && (
                <Modal
                    value={followersData}
                    title="Followers"
                    setShow={() => setShowFollowers(false)}
                />
            )}

            {showFollowing && (
                <Modal
                    value={followingData}
                    title="Following"
                    setShow={() => setShowFollowing(false)}
                />
            )}
        </>
    );
};

export default Account;