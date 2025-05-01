import React, { useState } from 'react'
import { BsChatFill, BsThreeDotsVertical } from 'react-icons/bs'
import { IoHeartSharp, IoHeartOutline } from 'react-icons/io5'

const PostCard = ({ type }) => {
    const [isLike, setIsLike] = useState(false)
    const [show, setShow] = useState(false);
    return (
        <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
            <div className="bg-white p-8 rounded-lg shadow-md ma-w-md">
                <div className="flex items-center space-x-2">
                    <img src="" alt="" className="w-8 h-8 rounded-full" />
                    <div>
                        <p className="text-gray-800 font-semibold">Jaswanth</p>
                        <div className="text-gray-500 text-sm"></div>
                    </div>
                    <div className="text-gray-500 cursor-pointer">
                        <button className='hover:bg-gray-500 rounded-full p-1 text-2xl'><BsThreeDotsVertical /></button>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="text-gray-800">hii my first post</p>
                </div>
                <div className="mb-4">
                    {type === 'post' ?
                        (
                            <img
                                src=''
                                alt=''
                                className='w-full h-48 object-cover rounded-md'
                            />
                        ) : (
                            <video
                                src=''
                                alt=''
                                className='w-full h-[480px] object-cover rounded-md'
                                autoPlay
                                controls
                            />
                        )}
                </div>
                <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center space-x-2">
                        <span
                            onClick={() => {
                                setIsLike(!isLike)
                            }}
                            className='text-red-500 text-2xl cursor-pointer'
                        >
                            {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
                        </span>
                        <button className="hover:bg-gray-50 rounded-full p-1">
                            24 likes
                        </button>
                    </div>
                    <button className="flex justify-center items-center gap-2 ppx-2
                    hover:bg-gray-50 rounded-full p-1" onClick={() => setShow(!show)}>
                        <BsChatFill />
                        <span>
                            3 comments
                        </span>
                    </button>
                </div>
                {
                    show && <form action="flex gap-3">
                        <input type="text" className='custom-input' placeholder='Enter 'Comment />
                        <button className='bg-gray-100 rounded-lg px-5 py-2'>Add Comment</button>
                    </form>
                }
            </div>
        </div>
    )
}

export default PostCard