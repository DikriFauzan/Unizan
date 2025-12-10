import ModelAdmin from './admin/ModelAdmin';
import RagPlannerAdmin from './admin/RagPlannerAdmin';
import AriesEmergentAdmin from './admin/AriesEmergentAdmin';
import SuperKeyAdmin from './admin/SuperKeyAdmin';
import AdminBilling from './admin/AdminBilling';
import { AuthProvider } from './context/AuthContext';
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
    return (
        <Router>
            <Routes>
            <Route path="/login" element={<Login/>} /><Route path="/register" element={<Register/>} /><Route path="/admin/billing" element={<AdminBilling/>} />  <Route path="/admin/superkey" element={<SuperKeyAdmin/>} />
  <Route path="/admin/emer" element={<AriesEmergentAdmin/>} />
  <Route path="/admin/rag" element={<RagPlannerAdmin/>} />
  <Route path="/admin/models" element={<ModelAdmin/>} />
</Routes>
        </Router>
    );
}
