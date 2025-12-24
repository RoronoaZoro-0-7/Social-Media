import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContext';
import PostCard from '../components/PostCard';
import { RiUserUnfollowFill, RiUserFollowLine } from "react-icons/ri";
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const UserAccount = ({ user: loggedInUser }) => {
    const navigate = useNavigate();
    const [showPosts, setShowPosts] = useState(true);
    const [followed, setFollowed] = useState(false);
    const { posts, reels } = PostData();
    const [user, setUser] = useState({});
    const params = useParams();

    const [followersData, setFollowersData] = useState([]);
    const [followingData, setFollowingData] = useState([]);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [showFollowingModal, setShowFollowingModal] = useState(false);

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${params.id}`, {
                withCredentials: true
            });
            setUser(data);
            if (data.followers.includes(loggedInUser._id)) {
                setFollowed(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function followData() {
        try {
            const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/followdata/${params.id}`, {}, {
                withCredentials: true
            });
            setFollowersData(data.followers);
            setFollowingData(data.following);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchUser();
        followData();
    }, [params.id]);

    async function handleFollowToggler() {
        try {
            const { data } = await axios.put(`${import.meta.env.VITE_API_URL}/api/user/follow/${params.id}`, {}, {
                withCredentials: true
            });
            setFollowed(!followed);
            fetchUser();
            showToast(followed ? "Unfollowed the account!" : "Followed the account!");
        } catch (error) {
            console.log(error);
            showToast("Something went wrong. Please try again.");
        }
    }

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

    const myPosts = posts?.filter(post => post.owner?._id === user?._id) || [];
    const myReels = reels?.filter(reel => reel.owner?._id === user?._id) || [];

    return (
        <>
            {user && user._id && (
                <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
                    <div className="flex justify-center bg-white p-8 rounded-lg shadow-md max-w-md">
                        <div className="image flex flex-col justify-between mb-4 gap-4">
                            <img src={user.profilePic?.url} alt="" className="w-[180px] h-[180px] rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-800 font-semibold">{user.name}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                            <p className="text-gray-500 text-sm">{user.gender}</p>

                            <p className="text-gray-500 text-sm cursor-pointer" onClick={() => setShowFollowersModal(true)}>
                                {followersData.length} follower{followersData.length !== 1 ? 's' : ''}
                            </p>

                            <p className="text-gray-500 text-sm cursor-pointer" onClick={() => setShowFollowingModal(true)}>
                                {followingData.length} following
                            </p>

                            {user._id !== loggedInUser._id && (
                                <button onClick={handleFollowToggler} className="bg-blue-500 text-white rounded-full px-5 py-2 hover:scale-105 hover:bg-gray-500 flex items-center gap-2">
                                    {followed ? (
                                        <><RiUserUnfollowFill />Unfollow</>
                                    ) : (
                                        <><RiUserFollowLine />Follow</>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="controls flex justify-center items-center bg-white p-4 rounded-md gap-7">
                        <button
                            onClick={() => setShowPosts(true)}
                            className={`px-4 py-2 rounded ${showPosts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setShowPosts(false)}
                            className={`px-4 py-2 rounded ${!showPosts ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                        >
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

            {showFollowersModal && (
                <Modal
                    title="Followers"
                    value={followersData}
                    setShow={() => setShowFollowersModal(false)}
                />
            )}

            {showFollowingModal && (
                <Modal
                    title="Following"
                    value={followingData}
                    setShow={() => setShowFollowingModal(false)}
                />
            )}
        </>
    );
};

export default UserAccount;