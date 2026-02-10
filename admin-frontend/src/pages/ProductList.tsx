import React, { useState, useEffect } from 'react';
import api, { getAdminProducts, addProduct, updateProduct, deleteProduct, toggleVisibility } from '../services/api';
import { Plus, Edit2, Trash2, X, CheckCircle2, Circle } from 'lucide-react';
import { Product } from '../types';
import { PageHeader } from '../components/PageHeader';

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<any>({ name: '', description: '', price: 0, category: '', images: [] });
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        const res = await getAdminProducts();
        setProducts(res.data);
    };

    const handleToggleVisibility = async (id: string) => {
        try {
            await toggleVisibility(id);
            fetchProducts();
        } catch (e) { console.error(e); }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get('/admin/categories');
            setCategories(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();

            // Helper to append nested objects to FormData
            const appendToFormData = (outerKey: string, value: any) => {
                if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof File)) {
                    Object.keys(value).forEach(innerKey => {
                        appendToFormData(`${outerKey}.${innerKey}`, value[innerKey]);
                    });
                } else if (!Array.isArray(value)) {
                    data.append(outerKey, value);
                }
            };

            Object.keys(formData).forEach(key => {
                if (key !== 'images') {
                    appendToFormData(key, formData[key]);
                }
            });

            if (selectedFiles) {
                for (let i = 0; i < selectedFiles.length; i++) {
                    data.append('images', selectedFiles[i]);
                }
            }

            if (editingProduct) await updateProduct(editingProduct._id, data);
            else await addProduct(data);

            setIsModalOpen(false);
            setSelectedFiles(null);
            fetchProducts();
        } catch (e) { console.error(e); }
    };

    const openEdit = (p: Product) => {
        setEditingProduct(p);
        setFormData({ ...p, images: p.images || [] });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                    <PageHeader
                        title="Product Catalog"
                        subtitle="Detailed overview and management of all jewelry and accessory items."
                    />
                </div>
                <button
                    onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: 0, category: '', images: [] }); setIsModalOpen(true); }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-bold flex items-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 hover:shadow-slate-200 shrink-0 mt-4 active:scale-95"
                >
                    <Plus className="w-5 h-5 stroke-[3px]" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="bg-white lg:bg-white rounded-3xl lg:border border-slate-100 lg:shadow-sm overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4">Price</th>
                                <th className="px-8 py-4">Stock</th>
                                <th className="px-8 py-4">Visibility</th>
                                <th className="px-8 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {products.map((p: Product) => (
                                <tr key={p._id} className={`hover:bg-slate-50/50 transition-colors group ${!p.visibility.showProduct ? 'opacity-40 grayscale contrast-50' : ''}`}>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0">
                                                {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className={`font-bold text-sm italic truncate max-w-[150px] ${!p.visibility.showProduct ? 'text-slate-400' : 'text-slate-800'}`}>{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{p.productCode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={`px-8 py-5 font-bold text-sm ${!p.visibility.showProduct ? 'text-slate-400' : 'text-slate-600'}`}>Rs.{p.price.toLocaleString()}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${!p.visibility.showProduct ? 'bg-slate-100 text-slate-400' : (p.stock.status === 'IN_STOCK' ? 'bg-emerald-50 text-emerald-600' :
                                            p.stock.status === 'LOW_STOCK' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600')
                                            }`}>
                                            {p.stock.totalQty} {p.stock.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <button
                                            onClick={() => handleToggleVisibility(p._id)}
                                            className={`transition-all duration-300 p-2 rounded-xl group/toggle ${p.visibility.showProduct ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 hover:bg-slate-100'}`}
                                            title={p.visibility.showProduct ? 'Shown in Catalog' : 'Hidden from Catalog'}
                                        >
                                            {p.visibility.showProduct ? <CheckCircle2 className="w-6 h-6 fill-emerald-50/50" /> : <Circle className="w-6 h-6" />}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEdit(p)} className="p-3 bg-indigo-50/50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={async () => { if (window.confirm('Are you sure?')) { await deleteProduct(p._id); fetchProducts(); } }} className="p-3 bg-red-50/50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4 px-1 py-1">
                    {products.map((p: Product) => (
                        <div key={p._id} className="bg-white rounded-3xl border border-slate-100 p-5 space-y-4 shadow-sm active:scale-[0.98] transition-all">
                            <div className="flex gap-4">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shrink-0 border border-slate-50">
                                    {p.images?.[0] && <img src={p.images[0]} className="w-full h-full object-cover" />}
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                                    <div>
                                        <h3 className="font-bold text-slate-800 leading-tight italic truncate">{p.name}</h3>
                                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{p.productCode}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-auto">
                                        <p className="font-black text-indigo-600">Rs.{p.price.toLocaleString()}</p>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.stock.status === 'IN_STOCK' ? 'bg-emerald-50 text-emerald-600' :
                                            p.stock.status === 'LOW_STOCK' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {p.stock.totalQty} {p.stock.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleToggleVisibility(p._id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-bold text-xs transition-all ${p.visibility.showProduct ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}
                                    >
                                        {p.visibility.showProduct ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                                        {p.visibility.showProduct ? 'Visible' : 'Hidden'}
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(p)} className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl active:bg-indigo-600 active:text-white transition-all"><Edit2 className="w-5 h-5" /></button>
                                    <button onClick={async () => { if (window.confirm('Are you sure?')) { await deleteProduct(p._id); fetchProducts(); } }} className="p-3 bg-red-50 text-red-600 rounded-2xl active:bg-red-600 active:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-6">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full h-full sm:h-auto sm:max-w-2xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h2 className="text-xl font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-full"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</label>
                                    <input className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat: any) => <option key={cat._id} value={cat.name}>{cat.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price (Rs.)</label>
                                <input type="number" className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                                <textarea className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 h-24" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Attach Images (jpeg, png)</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border-none outline-none focus:ring-2 focus:ring-indigo-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setSelectedFiles(e.target.files)}
                                />
                                {editingProduct && formData.images.length > 0 && (
                                    <div className="flex gap-2 mt-2">
                                        {formData.images.map((img: string, i: number) => (
                                            <img key={i} src={img} className="w-12 h-12 rounded-lg object-cover border border-slate-100" />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-1">
                                {editingProduct ? 'Update Product' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
