import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../components/api";
import "../styles/Register.css";
import LoadingPage from "./LoadingPage";

function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/user/register/", { username, email, password });
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
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingPage />;

    return (
        <div className="register-container">
            <div className="register-card">
                <h1 className="brand-title">Resource Tracker</h1>
                <p className="brand-desc">
                    Efficiently manage and track your resources with ease. Monitor usage,
                    allocations, and availability all in one place.
                </p>
                <h2 className="form-title">Create an Account</h2>
                <form onSubmit={handleRegister}>
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
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group password-group">
                        <label>Password</label>
                        <div className="password-flex">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                Show
                            </label>
                        </div>
                    </div>

                    <div className="input-group password-group">
                        <label>Confirm Password</label>
                        <div className="password-flex">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={showPassword}
                                    onChange={() => setShowPassword(!showPassword)}
                                />
                                Show
                            </label>
                        </div>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <button
                        type="submit"
                        className="login-btn"
                        disabled={loading}
                        style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "not-allowed" : "pointer" }}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>

                    <p className="register-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
