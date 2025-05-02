import React from 'react'
import AddPost from '../components/AddPost'
import PostCard from '../components/PostCard'
import { PostData } from '../context/PostContext'

const Home = () => {
  const { posts } = PostData()

  return (
    <div>
      <AddPost type="post" />
      {posts && posts.length > 0 ? (
        posts.map((e) => (
          <PostCard type="post" value={e} key={e._id} />
        ))
      ) : (
        <p>No Post Yet</p>
      )}
    </div>
  )
}

export default Home
