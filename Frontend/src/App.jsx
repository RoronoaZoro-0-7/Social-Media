import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { UserData } from './context/UserContext';
import Account from './pages/Account.jsx';
import NavigationBar from './components/NavigationBar';
import NotFound from './components/NotFound.jsx';
import UserAccount from './pages/UserAccount.jsx';
import Reels from './pages/Reels.jsx';
import { Loading } from './pages/Loading.jsx';
import Search from './pages/Search.jsx';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { loading, isAuth, user } = UserData();
  return (<>
    <Toaster />
    {loading ? <Loading /> : <BrowserRouter>
      <Routes>
        <Route path="/" element={isAuth ? <Home /> : <Login />} />
        <Route path="/reels" element={isAuth ? <Reels /> : <Login />} />
        <Route path="/account" element={isAuth ? <Account user={user} /> : <Login />} />
        <Route path="/user/:id" element={isAuth ? <UserAccount user={user} /> : <Login />}></Route>
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/search" element={isAuth ? <Search /> : <Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isAuth && <NavigationBar />}
    </BrowserRouter>
    }
  </>
  );
};

export default App;