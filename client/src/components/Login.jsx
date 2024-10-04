import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ onLogin }) => {
    const [user, setUser] = useState({ email: "dd4321@gmail.com", password: "dd4321" });
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    let navigate = useNavigate();

    const loginUser = async () => {
        const response = await axios.post('http://127.0.0.1:5000/login', { user });
        if (response.status === 200) {
            localStorage.setItem("email", user.email);
            onLogin();
            navigate('/');
        } else {
            alert("Some error occurred. Please try again!");
        }
    };

    const handleForgotPassword = async () => {
        try {
            await axios.post('http://127.0.0.1:5000/forgot-password', { email: forgotPasswordEmail });
            alert("Password reset instructions have been sent to your email.");
            setShowForgotPassword(false);
        } catch (error) {
            alert("Error sending password reset email.");
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-1" htmlFor="email">Email</label>
                        <input
                            type='email'
                            name='email'
                            onChange={handleChange}
                            required
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-400 text-sm mb-1" htmlFor="password">Password</label>
                        <input
                            type='password'
                            name='password'
                            onChange={handleChange}
                            required
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={user.password.length < 1}
                        className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200 ${user.password.length < 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Submit
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="mt-4 w-full text-blue-500 hover:underline"
                    >
                        Forgot Password?
                    </button>
                </form>
                {showForgotPassword && (
                    <div className='mt-6'>
                        <h4 className="text-gray-400 text-sm mb-2">Enter your email to reset password</h4>
                        <input
                            type="email"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                            required
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <button
                            onClick={handleForgotPassword}
                            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200"
                        >
                            Send Reset Instructions
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
