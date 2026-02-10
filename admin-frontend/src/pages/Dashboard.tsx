import React, { useState, useEffect } from 'react';
import { getAdminProducts } from '../services/api';
import { BarChart, TrendingUp, Package, MousePointer2 } from 'lucide-react';
import { Product } from '../types';
import { PageHeader } from '../components/PageHeader';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState<{ totalProducts: number; totalClicks: number; popular: Product[] }>({
        totalProducts: 0,
        totalClicks: 0,
        popular: []
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await getAdminProducts();
            const products = res.data;
            const totalClicks = products.reduce((sum, p) => sum + p.clicks.total, 0);
            const popular = [...products].sort((a, b) => b.clicks.total - a.clicks.total).slice(0, 5);

            setStats({
                totalProducts: products.length,
                totalClicks,
                popular
            });
        } catch (e) { console.error(e); }
    };

    const cards = [
        { label: 'Total Products', value: stats.totalProducts, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Engagement', value: stats.totalClicks, icon: MousePointer2, color: 'text-purple-600', bg: 'bg-purple-50' },
        { label: 'Top Product', value: stats.popular[0]?.name || 'N/A', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    ];

    return (
        <div className="space-y-12">
            <PageHeader />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card) => (
                    <div key={card.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
                            <card.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400 mb-1">{card.label}</p>
                            <p className="text-2xl font-bold text-slate-800 truncate max-w-[150px]">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-8">
                    <BarChart className="w-6 h-6 text-indigo-500" />
                    <h2 className="text-xl font-bold text-slate-800">Popularity Rankings</h2>
                </div>

                <div className="space-y-6">
                    {stats.popular.map((product, idx) => (
                        <div key={product._id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <span className="text-slate-300 font-black text-2xl italic w-8">0{idx + 1}</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{product.name}</h4>
                                    <p className="text-xs text-slate-400 capitalize">{product.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {stats.popular[0] && (
                                    <div className="w-48 h-2 bg-slate-50 rounded-full overflow-hidden hidden md:block">
                                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(product.clicks.total / stats.popular[0].clicks.total) * 100}%` }} />
                                    </div>
                                )}
                                <span className="font-bold text-slate-600 w-12 text-right">{product.clicks.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
