import React, { useEffect, useState } from 'react'
import { BsChatFill, BsThreeDotsVertical } from 'react-icons/bs'
import { IoHeartSharp, IoHeartOutline } from 'react-icons/io5'
import { UserData } from '../context/UserContext'
import { PostData } from '../context/PostContext'
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { MdDelete } from "react-icons/md";
import SimpleModal from './SimpleModal'

const PostCard = ({ type, value }) => {
  const [isLike, setIsLike] = useState(false)
  const [show, setShow] = useState(false)
  const { user } = UserData();
  const [comment, setComment] = useState('');
  const { likePost, addComment, deletePost } = PostData();
  const formatDate = format(new Date(value.createdAt), 'MMMM dd, yyyy');
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    for (let i = 0; i < value.likes.length; i++) {
      if (value.likes[i] === user._id) {
        setIsLike(true);
        break;
      }
    }
  }, [value, user._id])

  const likeHandler = (e) => {
    e.preventDefault();
    setIsLike(!isLike);
    likePost(value._id);
  }

  const addCommentHandler = () => {
    addComment(value._id, comment, setComment, setShow);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  const deleteHandler = () => {
    deletePost(value._id);
    setShowModal(false);
  }

  const editHandler = () => {
    setShowModal(false);
  }

  return (
    <div className="bg-gray-100 flex items-center justify-center pt-3 pb-14">
      <SimpleModal isOpen={showModal} onClose={closeModal}>
        <div className="flex flex-col gap-2 items-center justify-center">
          <button onClick={editHandler} className='bg-blue-400 text-white py-1 px-3 rounded-md'>Edit</button>
          <button onClick={deleteHandler} className='bg-red-400 text-white py-1 px-3 rounded-md'>Delete</button>
        </div>
      </SimpleModal>
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center space-x-2">
          <Link to={`/user/${value.owner._id}`}>
            <img src={value.owner?.profilePic?.url} alt="profile" className="w-8 h-8 rounded-full" />
          </Link>
          <div>
            <Link to={`/profile/${value.owner._id}`}>
              <p className="text-gray-800 font-semibold">{value.owner?.name || 'Unknown'}</p>
              <div className="text-gray-500 text-sm">{formatDate}</div>
            </Link>
          </div>
          {value.owner._id === user._id && <div className="ml-auto text-gray-500 cursor-pointer">
            <button onClick={() => setShowModal(true)} className="hover:bg-gray-500 rounded-full p-1 text-2xl">
              <BsThreeDotsVertical />
            </button>
          </div>}
        </div>

        <div className="my-4">
          <p className="text-gray-800">{value.caption || 'No Caption'}</p>
        </div>

        <div className="mb-4">
          {value.type === 'post' ? (
            <img
              src={value.post.url}
              alt="post"
              className="w-[450px] h-[600px] object-cover rounded-md"
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
              onClick={likeHandler}
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
            <input value={comment} onChange={(e) => setComment(e.target.value)} type="text" className="border px-2 py-1 rounded w-full" placeholder="Enter Comment" />
            <button onClick={addCommentHandler} className="bg-gray-100 rounded-lg px-5 py-1">Add</button>
          </form>
        )}

        <hr className="mt-4 mb-2" />
        <p className="text-gray-800 font-semibold">Comments</p>
        <hr className="mt-2 mb-2" />

        <div className="mt-4 max-h-[100px] overflow-y-auto">
          {value.comments && value.comments.length > 0 ? (
            value.comments.map((comment) => (
              <Comment key={comment._id} value={comment} name={comment.name} text={comment.comment} user={user} />
            ))
          ) : (
            <p className="text-sm text-gray-500">No comments yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export const Comment = ({ name, text, value, user }) => {
  return (

    <div className="flex items-center space-x-2 mt-2">
      <img src={value.user.profilePic.url} alt="" height={30} width={30} className="rounded-full" />
      <div className="flex flex-col">
        <Link to={`/user/${value.user._id}`}>
          <p className="text-gray-800 font-semibold">{name}</p>
        </Link>
        <p className="text-gray-500">{text}</p>
      </div>
      {
        user._id === value.user._id && <div className="ml-auto text-gray-500 cursor-pointer">
          <button className="hover:bg-gray-500 rounded-full p-1 text-2xl">
            <MdDelete />
          </button>
        </div>
      }
    </div>

  )
}

export default PostCard;