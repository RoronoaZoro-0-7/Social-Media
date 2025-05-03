import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
import { BsCameraReels, BsCameraReelsFill } from 'react-icons/bs';
import { IoSearchCircleOutline, IoSearchCircle, IoChatbubbleEllipses, IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { RiAccountCircleLine, RiAccountCircleFill } from 'react-icons/ri';
import { RxHamburgerMenu } from 'react-icons/rx';
import { IoMdClose } from 'react-icons/io';

const NavigationBar = () => {
  const [tab, setTab] = useState(window.location.pathname);
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(!open);

  return (
    <>
      {/* Hamburger/Cross icon */}
      <div
        className={`fixed top-4 transition-all duration-300 z-50 md:hidden ${
          open ? 'left-[74px]' : 'left-4'
        }`}
      >
        <button onClick={toggleMenu} className="text-2xl text-black">
          {open ? <IoMdClose /> : <RxHamburgerMenu />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-md transition-transform duration-300 z-40
          ${open ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 w-[80px] md:w-[50px] py-6`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6 md:space-y-10">
          <Link to="/" onClick={() => { setTab('/'); setOpen(false); }} className="text-2xl md:text-3xl">
            {tab === '/' ? <AiFillHome /> : <AiOutlineHome />}
          </Link>
          <Link to="/reels" onClick={() => { setTab('/reels'); setOpen(false); }} className="text-2xl md:text-3xl">
            {tab === '/reels' ? <BsCameraReelsFill /> : <BsCameraReels />}
          </Link>
          <Link to="/search" onClick={() => { setTab('/search'); setOpen(false); }} className="text-2xl md:text-3xl">
            {tab === '/search' ? <IoSearchCircle /> : <IoSearchCircleOutline />}
          </Link>
          <Link to="/chat" onClick={() => { setTab('/chat'); setOpen(false); }} className="text-2xl md:text-3xl">
            {tab === '/chat' ? <IoChatbubbleEllipses /> : <IoChatbubbleEllipsesOutline />}
          </Link>
          <Link to="/account" onClick={() => { setTab('/account'); setOpen(false); }} className="text-2xl md:text-3xl">
            {tab === '/account' ? <RiAccountCircleFill /> : <RiAccountCircleLine />}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NavigationBar;
