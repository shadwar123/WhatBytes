import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userEmail = localStorage.getItem('email');

    // Greeting messages
    const greetings = [
        'Welcome!',
        'Hello!',
        'Good to see you!',
        'Hi there!',
        'What’s up!',
        'Greetings!',
    ];
    const [greetingIndex, setGreetingIndex] = useState(0);

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

    // Change greeting on click
    const changeGreeting = () => {
        setGreetingIndex((prevIndex) => (prevIndex + 1) % greetings.length);
    };

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
            <div 
                className="text-center text-white text-6xl font-bold cursor-pointer select-none transition-all duration-300 transform hover:scale-105"
                onClick={changeGreeting}
            >
                <span className="animate-fade-in">
                    {greetings[greetingIndex]} {profile && `, ${profile.name}!`}
                </span>
            </div>
        </div>
    );
};

export default Home;
