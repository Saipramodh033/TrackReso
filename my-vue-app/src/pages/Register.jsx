import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../components/api";
import "../styles/Register.css"; // New CSS file for this component

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await api.post("/user/register/", {
                username,
                email,
                password
            });
            navigate("/login");
        } catch (err) {
            if (err.response) {
                setError(
                    err.response.data.detail ||
                    "Registration failed. Please check your details."
                );
            } else {
                setError("Failed to connect to server. Please try again.");
            }
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-left">
                <div className="brand">
                    <h1>Resource Tracker</h1>
                    <p>
                        Efficiently manage and track your resources with ease.
                        Monitor usage, allocations, and availability all in one place.
                        Stay organized and maximize productivity.
                    </p>
                </div>
            </div>

            <div className="login-right">
                <div className="login-box">
                    <h2>Register</h2>
                    <form onSubmit={handleRegister}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirm-password">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm-password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="login-btn">Register</button>
                    </form>

                    <p className="register-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
