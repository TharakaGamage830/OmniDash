import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import CategoryManagement from './pages/Categories';
import Inventory from './pages/Inventory';
import History from './pages/History';
import AdminManagement from './pages/Admins';
import Settings from './pages/Settings';

import { Menu } from 'lucide-react';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { token } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    if (!token) return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Overlay for Mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
            </div>

            <div className="flex-1 flex flex-col min-h-screen lg:pl-72 xl:pl-80 transition-all duration-300">
                <header className="fixed top-0 right-0 left-0 bg-white/70 backdrop-blur-xl border-b border-white/20 z-30 lg:hidden px-6 h-16 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center overflow-hidden shadow-lg shadow-indigo-200">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-150 invert brightness-0" />
                        </div>
                        <span className="font-black text-slate-800 text-sm tracking-tight uppercase italic">Admin</span>
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-600 transition-all active:scale-95 border border-slate-100"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <main className="p-4 sm:p-6 md:p-12 lg:p-16 mt-16 lg:mt-0 flex-1 max-w-[1600px]">
                    {children}
                </main>
            </div>
        </div>
    );
};

function App() {
    return (
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                    <Route path="/products" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
                    <Route path="/categories" element={<ProtectedRoute><CategoryManagement /></ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
                    <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                    <Route path="/admins" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
