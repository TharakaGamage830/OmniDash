import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Lock, Phone, Camera, Save, CheckCircle } from 'lucide-react';

const Settings: React.FC = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        whatsappNumber: '',
        profilePic: ''
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/admin/profile');
            setFormData({
                fullName: res.data.fullName,
                email: res.data.email,
                password: '',
                whatsappNumber: res.data.whatsappNumber || '',
                profilePic: res.data.profilePic || ''
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('whatsappNumber', formData.whatsappNumber);
            if (formData.password) data.append('password', formData.password);
            if (selectedFile) data.append('profilePic', selectedFile);

            await api.put('/admin/profile', data);
            setMessage('Profile updated successfully!');
            setFormData({ ...formData, password: '' });
            setSelectedFile(null);
            fetchProfile();
        } catch (e) {
            console.error(e);
            setMessage('Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
                <p className="text-slate-500">Manage your profile information and security settings.</p>
            </header>

            {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    <CheckCircle className="w-5 h-5" />
                    <p className="font-bold text-sm">{message}</p>
                </div>
            )}

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[2rem] bg-slate-100 overflow-hidden ring-4 ring-slate-50 shadow-xl">
                                    {selectedFile ? (
                                        <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                                    ) : formData.profilePic ? (
                                        <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                            <User className="w-12 h-12" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-indigo-700 transition-all active:scale-95 group-hover:scale-110">
                                    <Camera className="w-5 h-5" />
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} />
                                </label>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Profile Picture</p>
                        </div>

                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 italic">
                                    <User className="w-3 h-3" /> Full Name
                                </label>
                                <input
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 italic">
                                    <Mail className="w-3 h-3" /> Email Address
                                </label>
                                <input
                                    type="email"
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700 font-mono"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 italic">
                                    <Phone className="w-3 h-3" /> WhatsApp Number
                                </label>
                                <input
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700 font-mono"
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2 flex items-center gap-2 italic">
                                    <Lock className="w-3 h-3" /> New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Leave blank to keep current"
                                    className="w-full px-5 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-4 focus:ring-indigo-100 transition-all font-medium text-slate-700"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
