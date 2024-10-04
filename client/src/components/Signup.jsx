import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = ({ onSignup }) => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    let navigate = useNavigate();

    const signup = async (name, email, password) => {
        const response = await axios.post('http://127.0.0.1:5000/signup', {
            user: JSON.stringify({ name, email, password })
        });
        if (response.status === 200) {
            localStorage.setItem("email", user.email);
            onSignup();
            navigate('/');
        } else {
            alert("Some error occurred. Please try again!");
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(user.name, user.email, user.password);
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white text-center mb-6">Signup</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-400 text-sm mb-1" htmlFor="name">Name</label>
                        <input
                            type='text'
                            name='name'
                            onChange={handleChange}
                            required
                            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
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
                        disabled={user.name.length < 1 || user.password.length < 1}
                        className={`w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-500 transition duration-200 ${user.name.length < 1 || user.password.length < 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
