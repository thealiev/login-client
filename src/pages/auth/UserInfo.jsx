import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CiLogout } from 'react-icons/ci';
import axios from '../api/axios';  // Ensure axios is correctly imported

function UserInfo() {
  const router = useRouter();
  const { username } = router.query;  // Assumes username is passed as a query parameter
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5001/users/me');
        setUsers(response.data);  // Assuming the data is an array of users
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data');
      }
    };

    fetchUserInfo();
  }, []);

  const handleAction = async (id, action) => {
    const endpoint = action === 'delete' ? `${id}` : `${id}/${action}`;
    const method = action === 'delete' ? 'DELETE' : 'PUT';
    const body = action !== 'delete' ? { block: action === 'block' } : null;

    try {
      await axios({
        method,
        url: `http://localhost:5001/users/${endpoint}`,
        data: body,
        headers: { 'Content-Type': 'application/json' }
      });
      fetchUserInfo(); // Refresh data after action
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      setError(`Failed to ${action} user`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div>
      <div className="bg-gray-200 p-4 flex items-center justify-end gap-12">
        <p className="text-lg font-semibold hover:underline cursor-pointer">
          Welcome, {username || 'User'}!
        </p>
        <button
          className="flex items-center gap-4 bg-black border-none py-2 px-8 rounded-md hover:bg-gray-700 transition duration-500 text-white"
          onClick={handleLogout}
        >
          Logout <CiLogout size={20} />
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      <div className="p-14 flex flex-wrap items-center gap-6">
        {users.map(user => (
          <div key={user.id} className="flex flex-col items-center">
            <span>{user.username}</span>
            <button onClick={() => handleAction(user.id, 'block')}>Block</button>
            <button onClick={() => handleAction(user.id, 'unblock')}>Unblock</button>
            <button onClick={() => handleAction(user.id, 'delete')}>Delete</button>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center bg-gray-200 px-4 py-2 mb-4">
        <div className="flex items-center space-x-12">
          <input type="checkbox" className="form-checkbox text-indigo-600 h-5 w-5" />
          <span className="text-gray-700 font-semibold">Select All</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Last Login</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{new Date(user.lastLogin).toLocaleString()}</td>
                <td>{user.blocked ? 'Blocked' : 'Active'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserInfo;
