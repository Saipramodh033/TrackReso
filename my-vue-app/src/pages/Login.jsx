import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../components/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Login.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await api.post("/token/", { username, password });
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            navigate("/topics");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to login. Please try again.");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-left">
                <div className="brand">
                    <h1>StudySpace</h1>
                    <p>Your personal learning dashboard to organize topics, save resources, and track progress efficiently.</p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-box">
                    <h2>Sign In</h2>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-btn">Login</button>
                    </form>
                    <p className="register-link">
                        Don’t have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
