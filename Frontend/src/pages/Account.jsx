import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserData } from '../context/UserContext';
import { PostData } from '../context/PostContext';
import PostCard from '../components/PostCard';

const Account = ({ user }) => {
    const navigate = useNavigate();
    const { logoutUser } = UserData();
    const { posts, reels } = PostData();
    const [showPosts, setShowPosts] = useState(true);

    const myPosts = posts?.filter(post => post.owner._id === user._id) || [];
    const myReels = reels?.filter(reel => reel.owner._id === user._id) || [];

    const logoutHandler = () => {
        logoutUser(navigate);
    };

    return (
        <>
            {user && (
                <div className="bg-gray-100 min-h-screen flex flex-col gap-4 items-center justify-center pt-3 pb-14">
                    <div className="flex justify-center bg-white p-8 rounded-lg shadow-md max-w-md">
                        <div className="image flex flex-col justify-between mb-4 gap-4">
                            <img src={user.profilePic.url} alt="" className="w-[180px] h-[180px] rounded-full" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <p className="text-gray-800 font-semibold">{user.name}</p>
                            <p className="text-gray-500 text-sm">{user.email}</p>
                            <p className="text-gray-500 text-sm">{user.gender}</p>
                            <p className="text-gray-500 text-sm">{user.followers.length} follower</p>
                            <p className="text-gray-500 text-sm">{user.following.length} following</p>
                            <button onClick={logoutHandler} className="bg-red-500 text-white rounded-md px-4 py-1">Logout</button>
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
        </>
    );
};

export default Account;