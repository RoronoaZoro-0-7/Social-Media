import React from 'react';
import { Link } from 'react-router-dom';

const Modal = ({ value, title, setShow }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div className="bg-white rounded-lg p-4 shadow-lg w-[300px] max-h-[300px] overflow-y-auto">
        <div className="flex justify-end">
          <button onClick={setShow} className="text-gray-500 text-2xl font-bold hover:scale-110">&times;</button>
        </div>
        <h1 className="text-xl font-semibold text-blue-600 mb-2">{title}</h1>
        <div className="flex flex-col gap-2">
          {value.length > 0 ? (
            value.map((e) => (
              <Link
                key={e._id}
                to={`/user/${e._id}`}
                onClick={setShow}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
              >
                <img src={e.profilePic?.url} alt={e.name} className="w-8 h-8 rounded-full" />
                <span>{e.name}</span>
              </Link>
            ))
          ) : (
            <span className="text-gray-500">No {title} found</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;