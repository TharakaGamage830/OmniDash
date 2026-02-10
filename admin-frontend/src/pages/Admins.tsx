import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, User, Mail, Phone, X } from 'lucide-react';

const AdminManagement: React.FC = () => {
    const [admins, setAdmins] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '', whatsappNumber: '', profilePic: '' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => { fetchAdmins(); }, []);

    const fetchAdmins = async () => {
        try {
            const res = await api.get('/admin/list');
            setAdmins(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('fullName', formData.fullName);
            data.append('email', formData.email);
            data.append('password', formData.password);
            data.append('whatsappNumber', formData.whatsappNumber);
            if (selectedFile) data.append('profilePic', selectedFile);

            await api.post('/admin/add', data);

            setIsModalOpen(false);
            setFormData({ fullName: '', email: '', password: '', whatsappNumber: '', profilePic: '' });
            setSelectedFile(null);
            fetchAdmins();
        } catch (e) {
            console.error(e);
            alert('Failed to add admin');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to remove this admin?')) {
            try {
                await api.delete(`/admin/${id}`);
                fetchAdmins();
            } catch (e: any) { alert(e.response?.data?.message || 'Delete failed'); }
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800">Administrator Management</h1>
                    <p className="text-slate-500">Manage who has access to Anu's Touch admin panel.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                >
                    <Plus className="w-5 h-5" />
                    Add New Admin
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {admins.map((admin) => (
                    <div key={admin._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative group overflow-hidden">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                                {admin.profilePic ? (
                                    <img src={admin.profilePic} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <User className="w-8 h-8" />
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{admin.fullName}</h3>
                                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-md uppercase">
                                    {admin.isSuperAdmin ? 'Super Admin' : 'Admin'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Mail className="w-4 h-4" />
                                <span>{admin.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-slate-500">
                                <Phone className="w-4 h-4" />
                                <span>{admin.whatsappNumber || 'N/A'}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleDelete(admin._id)}
                            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 mb-2"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full h-full sm:h-auto sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col scale-in-center">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-slate-800">Add New Administrator</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto flex-1">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                                <input
                                    placeholder="e.g. Anu Perera"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Email</label>
                                <input
                                    placeholder="admin@anutouch.com"
                                    type="email"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Password</label>
                                <input
                                    placeholder="••••••••"
                                    type="password"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">WhatsApp</label>
                                <input
                                    placeholder="+94 7X XXX XXXX"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100"
                                    value={formData.whatsappNumber}
                                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Profile Photo</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-6 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1">
                                Create Admin Account
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminManagement;
