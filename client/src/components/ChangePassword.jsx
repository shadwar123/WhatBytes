import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Retrieve email from local storage
        const email = localStorage.getItem('email');
        if (!email) {
            alert("No email found in local storage. Please log in again.");
            return;
        }

        const response = await fetch('http://127.0.0.1:5000/change_password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                old_password: oldPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }),
        });

        const data = await response.json();
        if (response.ok) {
            alert(data.message);
            navigate('/');
        } else {
            alert(`An error occurred: ${data.message}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Change Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">Old Password</label>
                        <input
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-2">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500"
                    >
                        Change Password
                    </button>
                </form>
                {/* <button
                    onClick={() => navigate('/')}
                    className="mt-4 w-full bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-gray-500"
                >
                    Go Back to Dashboard
                </button> */}
            </div>
        </div>
    );
};

export default ChangePassword;
