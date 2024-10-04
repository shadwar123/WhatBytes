import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const handlePasswordReset = async () => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        try {
            await axios.post('http://127.0.0.1:5000/reset-password', {
                token,
                new_password: newPassword,
            });
            alert("Password has been reset successfully.");
            navigate('/login');
        } catch (error) {
            alert("Failed to reset password. Try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Reset Password</h1>
                <input 
                    type="password" 
                    placeholder="Enter new password" 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    required 
                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                    onClick={handlePasswordReset}
                    className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200 ${newPassword.length < 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={newPassword.length < 1}
                >
                    Reset Password
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
