import React, { useState } from 'react'
import AddPost from '../components/AddPost'
import PostCard from '../components/PostCard'
import { PostData } from '../context/PostContext'
import { FaArrowUp, FaArrowDownLong } from "react-icons/fa6";

const Reels = () => {
  const { reels } = PostData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (reels && currentIndex < reels.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen'>
      <AddPost type="reel" />
      <div className="flex justify-center items-center gap-6 mt-8">
        {/* Arrow buttons */}
        <div className="flex flex-col gap-6 justify-center items-center">
          {currentIndex > 0 && (
            <button
              onClick={handlePrev}
              className="bg-gray-500 text-white py-4 px-3 rounded-full"
            >
              <FaArrowUp />
            </button>
          )}
          {currentIndex < reels?.length - 1 && (
            <button
              onClick={handleNext}
              className="bg-gray-500 text-white py-4 px-3 rounded-full"
            >
              <FaArrowDownLong />
            </button>
          )}
        </div>

        {/* Reel display */}
        <div className="w-[300px] md:w-[500px]">
          {reels && reels.length > 0 ? (
            <PostCard type="reel" value={reels[currentIndex]} />
          ) : (
            <p>No Post Yet</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reels
