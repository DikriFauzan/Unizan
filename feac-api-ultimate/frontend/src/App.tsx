import AdminBilling from './admin/AdminBilling';
import { AuthProvider } from './context/AuthContext';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <Routes>
            <Route path="/login" element={<Login/>} /><Route path="/register" element={<Register/>} /><Route path="/admin/billing" element={<AdminBilling/>} /></Routes>
        </Router>
    );
}
