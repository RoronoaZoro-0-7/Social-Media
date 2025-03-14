import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');
  const [file, setFile] = useState('');
  const [filePrev, setFilePrev] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(name, email, password, gender, file);
  }

  const changeFileHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setFile(file);
      setFilePrev(reader.result);
    }
  }

  return (
    <div className="flex justify-center">
      <div className="flex flex-col justify-center items-center md:flex-row shadow-md rounded-xl max-w-7xl w-[90%] md:w-[50%] md:mt-[40px]">
        <div className="w-full md:w-3/4">
          <div className="text-xl cursor-pointer flex flex-col justify-center items-center mt-5 md:mt-0 py-4">
            <h1 className="font-semibold text-xl md:text-3xl text-gray-600 m-2">
              Register to Social Media
            </h1>
          </div>
          <form onSubmit={submitHandler}>
            <div className="flex flex-col justify-center items-center m-2 space-y-6 md:space-y-8">
              {filePrev && <img src={filePrev} alt="preview" className="w-20 h-20 rounded-full" />}
              <input type="file" className="custom-input" onChange={changeFileHandler} accept="image/*" required />
              <input type="text" className="custom-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="User Name" required />
              <input type="email" className="custom-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="User Email" required />
              <input type="password" className="custom-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
              <select className="custom-input" value={gender} onChange={(e) => setGender(e.target.value)} required>
                <option value="" disabled>Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="text-center mt-7">
              <button className="auth-btn" type="submit">Register</button>
            </div>
          </form>
        </div>
        <div className="h-full w-full md:w-1/3 bg-gradient-to-l from-blue-400 to-yellow-400 flex items-center justify-center">
          <div className="text-white text-base font-semibold text-center my-10 space-y-2 m-2">
            <h1 className="text-5xl">Have an Account?</h1>
            <h1>Login to Social Media</h1>
            <Link to="/login" className="bg-white rounded-2xl px-4 text-emerald-400">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;