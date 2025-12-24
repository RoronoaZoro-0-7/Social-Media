import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  async function fetchUsers() {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/all/profiles?search=${search}`,
        {
          withCredentials: true,
        }
      );
      setUsers(data.user);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter Name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            onClick={fetchUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            Search
          </button>
        </div>

        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map((e) => (
              <Link
                key={e._id}
                to={`/user/${e._id}`}
                className="flex items-center gap-4 bg-white p-3 rounded-md shadow hover:shadow-lg transition duration-300"
              >
                <img
                  src={e.profilePic?.url}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p className="text-gray-800 font-medium">{e.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mt-8">
            No users found. Please try searching.
          </p>
        )}
      </div>
    </div>
  );
};

export default Search;