import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../components/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Login.css";
import LoadingPage from "./LoadingPage";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const response = await api.post("/token/", { username, password });
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <div className="login-wrapper">
            <div className="login-box">
                <div className="brand-header">
                    <h1>TrackReso</h1>
                    <p>Your personal learning dashboard</p>
                </div>
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
                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                        style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
                <p className="register-link">
                    Don’t have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
