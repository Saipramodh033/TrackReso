import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./contexts/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./styles/App.css";
import "./styles/Dashboard.css";
import "./styles/Home.css";
import "./styles/Profile.css";


function Logout() {
    localStorage.clear();
    return <Navigate to="/login" />;
}

function App() {
    return (
        <ToastProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/logout" element={<Logout />} />
                    
                    {/* Public home page */}
                    <Route path="/home" element={<Home />} />
                    
                    {/* Protected routes with navigation */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard />
                            </MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/topics" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard defaultTab="my-topics" />
                            </MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/peers" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard defaultTab="peers" />
                            </MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/shared" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Dashboard defaultTab="shared" />
                            </MainLayout>
                        </ProtectedRoute>
                    } />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <MainLayout>
                                <Profile />
                            </MainLayout>
                        </ProtectedRoute>
                    } />
                    
                    {/* Default routes */}
                    <Route path="/" element={<Navigate to="/home" />} />
                    <Route path="*" element={<Navigate to="/home" />} />
                </Routes>
            </BrowserRouter>
        </ToastProvider>
    );
}

export default App;
