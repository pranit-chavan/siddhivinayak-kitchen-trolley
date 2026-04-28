import { BrowserRouter, Route, Routes } from "react-router-dom";

// Portfolio
import Home from "./pages/portfolio/Home";

// Standalone public page
import Tracker from "./pages/tracker";

// Auth System
import ProtectedRoute from "./components/erp/Auth/ProtectedRoute";
import Login from "./pages/erp/Login";

// ERP Modules
import Dashboard from "./pages/erp/Dashboard";
import Projects from "./pages/erp/Projects";
import Production from "./pages/erp/Production";
import Quotation from "./pages/erp/Quotation";
import Finance from "./pages/erp/Finance";
import Design3D from "./pages/erp/Design3D";
import CuttingOptimizer from "./pages/erp/CuttingOptimizer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC — Single Page Portfolio */}
        <Route path="/" element={<Home />} />

        {/* PUBLIC — Standalone Project Tracker */}
        <Route path="/track/:projectId" element={<Tracker />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/tracker/:projectId" element={<Tracker />} />

        {/* PUBLIC — Login Page */}
        <Route path="/admin/login" element={<Login />} />

        {/* PRIVATE — ERP System Guarded by Auth */}
        <Route path="/admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/admin/production" element={<ProtectedRoute><Production /></ProtectedRoute>} />
        <Route path="/admin/quotation" element={<ProtectedRoute><Quotation /></ProtectedRoute>} />
        <Route path="/admin/finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
        <Route path="/admin/design" element={<ProtectedRoute><Design3D /></ProtectedRoute>} />
        <Route path="/admin/cutting" element={<ProtectedRoute><CuttingOptimizer /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
