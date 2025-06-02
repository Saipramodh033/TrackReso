import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopicManager from '../components/TopicManager';
import '../styles/Home.css'; // Keep your custom home styles here

function Home() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // You can also clear localStorage here or rely on /logout route
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="home-container">
            <button className="logout-btn" onClick={handleLogout}>
                Logout
            </button>

            <div className="home-header">
                <h1 className="home-title">Welcome to Your Learning Hub</h1>
                <p className="home-subtitle">Organize your topics, track progress, and stay motivated.</p>
            </div>
            <div className="home-content">
                <TopicManager />
            </div>
        </div>
    );
}

export default Home;
