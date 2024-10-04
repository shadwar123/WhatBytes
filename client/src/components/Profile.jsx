import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userEmail = localStorage.getItem('email');

    useEffect(() => {
        if (userEmail) {
            axios.get(`http://127.0.0.1:5000/profile?email=${userEmail}`)
                .then(response => {
                    setProfile(response.data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                    setError('Failed to load profile data. Please try again.');
                    setLoading(false);
                });
        } else {
            setError('No email found. Please log in.');
            setLoading(false);
        }
    }, [userEmail]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">Profile Information</h2>
                <div className="mb-4">
                    <p className="text-gray-400 mb-2">
                        <strong className="text-white">Name:</strong> {profile.name || 'N/A'}
                    </p>
                    <p className="text-gray-400 mb-2">
                        <strong className="text-white">Email:</strong> {profile.email || 'N/A'}
                    </p>
                </div>
                <div className="mb-4">
                    <p className="text-gray-400 mb-2">
                        <strong className="text-white">Created At:</strong> {new Date(profile.created_time).toLocaleString()}
                    </p>
                    <p className="text-gray-400">
                        <strong className="text-white">Last Updated At:</strong> {new Date(profile.last_updated_time).toLocaleString()}
                    </p>
                </div>
                <button
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded mt-4 transition duration-200"
                    onClick={() => window.location.reload()}
                >
                    Refresh Profile
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;
