import React, { useState } from 'react';
import { adminLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await adminLogin({ username, password });
            login(res.data.token);
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-100 overflow-hidden ring-4 ring-indigo-50">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Admin Portal</h2>
                    <p className="text-slate-400 text-sm font-medium tracking-tight">Anu's Touch Management System</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Username"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none ring-2 ring-transparent focus:ring-indigo-200 outline-none transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-2xl border-none ring-2 ring-transparent focus:ring-indigo-200 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm font-medium text-center">{error}</p>}

                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all hover:-translate-y-1 active:scale-[0.98]">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
