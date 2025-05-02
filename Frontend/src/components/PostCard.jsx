import React, { useState } from 'react'
import { BsChatFill, BsThreeDotsVertical } from 'react-icons/bs'
import { IoHeartSharp, IoHeartOutline } from 'react-icons/io5'

const PostCard = ({ type, value }) => {
  const [isLike, setIsLike] = useState(false)
  const [show, setShow] = useState(false)

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center space-x-2">
          <img src={value.owner?.profilePic?.url} alt="profile" className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-gray-800 font-semibold">{value.owner?.name || 'Unknown'}</p>
          </div>
          <div className="ml-auto text-gray-500 cursor-pointer">
            <button className="hover:bg-gray-500 rounded-full p-1 text-2xl">
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>

        <div className="my-4">
          <p className="text-gray-800">{value.caption || 'No Caption'}</p>
        </div>

        <div className="mb-4">
          {value.type === 'post' ? (
            <img
              src={value.post.url}
              alt="post"
              className="w-full h-48 object-cover rounded-md"
            />
          ) : (
            <video
              src={value.post?.url}
              className="w-full h-[480px] object-cover rounded-md"
              autoPlay
              controls
            />
          )}
        </div>

        <div className="flex items-center justify-between text-gray-500">
          <div className="flex items-center space-x-2">
            <span
              onClick={() => setIsLike(!isLike)}
              className="text-red-500 text-2xl cursor-pointer"
            >
              {isLike ? <IoHeartSharp /> : <IoHeartOutline />}
            </span>
            <span>{value.likes?.length || 0} likes</span>
          </div>

          <button
            className="flex items-center gap-2 hover:bg-gray-50 rounded-full p-1"
            onClick={() => setShow(!show)}
          >
            <BsChatFill />
            <span>{value.comments?.length || 0} comments</span>
          </button>
        </div>

        {show && (
          <form className="flex gap-3 mt-3">
            <input type="text" className="border px-2 py-1 rounded w-full" placeholder="Enter Comment" />
            <button className="bg-gray-100 rounded-lg px-5 py-1">Add</button>
          </form>
        )}

        <hr className="mt-4 mb-2" />
        <p className="text-gray-800 font-semibold">Comments</p>
        <hr className="mt-2 mb-2" />

        <div className="mt-4 max-h-[200px] overflow-y-auto">
          {value.comments && value.comments.length > 0 ? (
            value.comments.map((comment) => (
              <Comment key={comment._id} name={comment.name} text={comment.comment} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export const Comment = ({ name, text }) => {
  return (
    <div className="flex items-center space-x-2 mt-2">
      <img src="" alt="profile" className="w-6 h-6 rounded-full bg-gray-300" />
      <div>
        <p className="text-gray-800 font-semibold">{name}</p>
        <p className="text-gray-500">{text}</p>
      </div>
    </div>
  )
}

export default PostCard;