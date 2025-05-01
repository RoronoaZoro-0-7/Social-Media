import React from 'react'
import AddPost from '../components/AddPost'
import PostCard from '../components/PostCard'

const Home = () => {
  return (
    <div>
      <AddPost type="post"/>
      <PostCard type={"post"} />
    </div>
  )
}

export default Home