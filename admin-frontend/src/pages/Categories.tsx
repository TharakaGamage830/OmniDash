import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: '', prefix: '', description: '' });

    useEffect(() => { fetchCategories(); }, []);

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/admin/categories', formData);
            setIsModalOpen(false);
            setFormData({ name: '', prefix: '', description: '' });
            fetchCategories();
        } catch (e) {
            console.error(e);
            alert('Failed to add category');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure? This might affect existing product code generation labels (though existing codes wont change).')) {
            try {
                await api.delete(`/admin/categories/${id}`);
                fetchCategories();
            } catch (e) { console.error(e); }
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                    <PageHeader
                        title="Category Management"
                        subtitle="Organize your product catalog with custom categories and prefixes."
                    />
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 hover:shadow-slate-200 shrink-0 mt-4 active:scale-95"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span>Add Category</span>
                </button>
            </div>

            <div className="bg-white lg:bg-white rounded-3xl lg:border border-slate-100 lg:shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-8 py-4">Category Name</th>
                                <th className="px-8 py-4">Prefix</th>
                                <th className="px-8 py-4">Description</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-slate-800">{cat.name}</td>
                                    <td className="px-8 py-5">
                                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-mono font-bold text-xs">
                                            {cat.prefix}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-500">{cat.description}</td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => handleDelete(cat._id)}
                                            className="p-3 bg-red-50 text-red-500 rounded-xl lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 px-1 py-1">
                    {categories.map((cat) => (
                        <div key={cat._id} className="bg-white rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm active:scale-[0.98] transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg italic">{cat.name}</h3>
                                    <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg font-mono font-bold text-xs">
                                        {cat.prefix}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="p-3 bg-red-50 text-red-500 rounded-2xl active:bg-red-600 active:text-white transition-all shadow-sm shadow-red-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                            {cat.description && (
                                <p className="text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                                    {cat.description}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full h-full sm:h-auto sm:max-w-lg bg-white sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-800">Add New Category</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto flex-1">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Name</label>
                                <input
                                    placeholder="e.g. Earrings"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Prefix (3 letters)</label>
                                <input
                                    placeholder="e.g. EAR"
                                    maxLength={3}
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-mono"
                                    value={formData.prefix}
                                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value.toUpperCase() })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Description</label>
                                <textarea
                                    placeholder="Short description..."
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-indigo-100">
                                Create Category
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
