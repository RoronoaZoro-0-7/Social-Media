import React, { useState } from 'react'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(email, password);
  }
  return (
    <div>

      <div className="flex justify-center">
        <div className="flex flex-col justify-center items-center md:flex-row shadow-md rounded-xl max-w-7xl w-[90%] md:w-[50%] md:mt-[40px]">
          <div className="w-full md:w-3/4">
            <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 py-4">
              <h1 className="font-semibold text-xl md:text-3xl text-gray-600 m-2">
                Login to Social Media
              </h1>
            </div>
            <form onSubmit={submitHandler}>
            <div className="flex flex-col justify-center items-center m-2 space-y-6 md:space-y-8">
              <input type="email" className="custom-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="User Email" required />
              <input type="password" className="custom-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              <button type="submit" className="auth-btn">Login</button>
              {/* <Link to="/register" className="auth-btn">Register</Link> */}
            </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
