import React, { useState, useEffect } from 'react';
import { getAdminProducts, handleGRN, handleReturn, getStockHistory } from '../services/api';
import { Download, Upload, PackageCheck, History as HistoryIcon, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { PageHeader } from '../components/PageHeader';

const Inventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [history, setHistory] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [reason, setReason] = useState('');
    const [type, setType] = useState('GRN');
    const [historyTab, setHistoryTab] = useState<'GRN' | 'RETURN'>('GRN');

    useEffect(() => {
        fetchProducts();
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await getStockHistory();
            setHistory(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchProducts = async () => {
        const res = await getAdminProducts();
        setProducts(res.data);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (type === 'GRN') await handleGRN({ productId: selectedProduct, quantity, reason });
            else await handleReturn({ productId: selectedProduct, quantity, reason });

            setQuantity(0);
            setReason('');
            fetchProducts();
            fetchHistory();
            window.alert(`Successfully ${type === 'GRN' ? 'added' : 'returned'} stock`);
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-12">
            <PageHeader
                title="Inventory Management"
                subtitle="Track stock levels, record new arrivals (GRN), and manage product returns."
            />

            <div className="xl:col-span-2 space-y-8 order-2 xl:order-1">
                {/* Current Stock Table */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <PackageCheck className="w-5 h-5 text-indigo-500" />
                            <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Current Stock Levels</h2>
                        </div>
                    </div>
                    <div className="p-0">
                        {/* Desktop Table */}
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left min-w-[500px]">
                                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Item</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {products.map((p) => (
                                        <tr key={p._id}>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-700 text-sm italic">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-mono">{p.productCode}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${p.stock.status === 'IN_STOCK' ? 'text-emerald-500 bg-emerald-50' :
                                                    p.stock.status === 'LOW_STOCK' ? 'text-amber-500 bg-amber-50' : 'text-red-500 bg-red-50'
                                                    }`}>
                                                    {p.stock.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-slate-600">{p.stock.totalQty}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden divide-y divide-slate-50">
                            {products.map((p) => (
                                <div key={p._id} className="p-5 flex items-center justify-between gap-4 active:bg-slate-50 transition-colors">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-700 text-sm italic truncate">{p.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <p className="text-[9px] text-slate-400 font-mono uppercase">{p.productCode}</p>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-bold ${p.stock.status === 'IN_STOCK' ? 'text-emerald-500 bg-emerald-50' :
                                                p.stock.status === 'LOW_STOCK' ? 'text-amber-500 bg-amber-50' : 'text-red-500 bg-red-50'
                                                }`}>
                                                {p.stock.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-lg font-black text-slate-600 leading-none">{p.stock.totalQty}</p>
                                        <p className="text-[9px] text-slate-400 uppercase font-bold mt-1 tracking-widest">Qty</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


            </div>

            <div className="bg-white rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-100/20 p-8 h-fit space-y-8 order-1 xl:order-2">
                <div className="space-y-2">
                    <h2 className="font-black text-slate-800 text-xl tracking-tight">Post Transaction</h2>
                    <p className="text-slate-400 text-sm">Update stock availability manually.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl">
                        <button type="button" onClick={() => setType('GRN')} className={`py-3 rounded-xl font-bold text-sm transition-all ${type === 'GRN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>GRN</button>
                        <button type="button" onClick={() => setType('RETURN')} className={`py-3 rounded-xl font-bold text-sm transition-all ${type === 'RETURN' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>RETURN</button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Select Item</label>
                        <select className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer text-slate-700 font-medium" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                            <option value="">Choose a product...</option>
                            {products.map((p) => <option key={p._id} value={p._id}>{p.name} ({p.productCode})</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Quantity</label>
                        <input type="number" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 font-black text-lg" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required min="1" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-2">Reference / Note</label>
                        <input type="text" placeholder="e.g. New Shipment #102" className="w-full px-4 py-4 bg-slate-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-indigo-100 text-sm" value={reason} onChange={(e) => setReason(e.target.value)} />
                    </div>

                    <button type="submit" className={`w-full py-5 rounded-3xl font-black text-white shadow-lg transition-all hover:-translate-y-1 active:scale-95 ${type === 'GRN' ? 'bg-indigo-600 shadow-indigo-200' : 'bg-orange-500 shadow-orange-200'}`}>
                        {type === 'GRN' ? <Download className="inline w-5 h-5 mr-2" /> : <Upload className="inline w-5 h-5 mr-2" />}
                        {type === 'GRN' ? 'POST GRN' : 'POST RETURN'}
                    </button>
                </form>
            </div>
            {/* Inventory History Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <HistoryIcon className="w-5 h-5 text-indigo-500" />
                        <h2 className="font-bold text-slate-800 uppercase tracking-wider text-xs">Inventory History</h2>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setHistoryTab('GRN')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${historyTab === 'GRN' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>GRN</button>
                        <button onClick={() => setHistoryTab('RETURN')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${historyTab === 'RETURN' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-400'}`}>RETURN</button>
                    </div>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        {history.filter(m => m.type === historyTab).slice(0, 10).map((move) => (
                            <div key={move._id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${move.type === 'GRN' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                                        {move.type === 'GRN' ? <Download className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-sm italic">{move.productName}</h4>
                                        <p className="text-[10px] text-slate-400 font-medium">{new Date(move.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className={`font-black text-sm ${move.type === 'GRN' ? 'text-emerald-600' : 'text-orange-600'}`}>
                                            {move.type === 'GRN' ? '+' : '-'}{move.quantity}
                                        </p>
                                        <p className="text-[9px] text-slate-300 font-bold uppercase">Balance: {move.newQty}</p>
                                    </div>
                                    <button className="p-2 bg-white text-slate-300 rounded-lg group-hover:text-indigo-500 transition-colors shadow-sm">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {history.filter(m => m.type === historyTab).length === 0 && (
                            <div className="text-center py-10 italic text-slate-400 text-sm">No history records found for {historyTab}.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Inventory;
