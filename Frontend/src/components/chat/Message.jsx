import React from 'react'

const Message = ({message,ownMessage}) => {
  return (
    <div className={`mb-2 ${ownMessage ? 'text-right' : 'text-left'}`}>
      <span>{message}</span>
    </div>
  )
}

export default Message;