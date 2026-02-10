import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { QuotationDrawer } from './components/QuotationDrawer';
import { useQuotation } from './hooks/useQuotation';
import api, { getProducts, trackClick } from './services/api';
import { Search, X, LayoutGrid, Grid3X3, StretchHorizontal } from 'lucide-react';
import { Product } from './types';

function App() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [sort, setSort] = useState('');
    const [categories, setCategories] = useState<any[]>([]);
    const [showLogoPopup, setShowLogoPopup] = useState(false);
    const [gridCols, setGridCols] = useState(0); // 0 = default (md:4, mobile:2)

    const { items, addToQuotation, removeFromQuotation, updateQuantity, total } = useQuotation();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [search, category, sort]);

    const fetchProducts = async () => {
        try {
            const res = await getProducts({ search, category, sort });
            setProducts(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const catRes = await api.get('/admin/categories');
            setCategories(catRes.data);
        } catch (e) {
            console.error('Error fetching categories:', e);
        }
    };

    const handleAdd = async (product: Product) => {
        addToQuotation(product);
        try {
            await trackClick(product._id);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="min-h-screen bg-[#fff5f7]">
            <Navbar cartCount={items.length} onCartClick={() => setIsCartOpen(true)} />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="text-center mb-16 space-y-4">
                    <div
                        onClick={() => setShowLogoPopup(true)}
                        className="mx-auto w-24 h-24 bg-white rounded-3xl p-1 shadow-xl shadow-pink-100 flex items-center justify-center mb-8 group cursor-pointer transition-transform hover:scale-110 overflow-hidden ring-4 ring-pink-50"
                    >
                        <img src="/logo.png" alt="Anu's Touch Logo" className="w-full h-full object-cover scale-110 group-hover:rotate-6 transition-transform" />
                    </div>
                    <p className="text-pink-400 font-bold tracking-[0.3em] uppercase text-xs mb-2">Anu's Touch</p>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter">
                        A touch of <span className="text-pink-500 italic underline decoration-pink-200">LOVE</span> in every gift.
                    </h1>
                    <p className="text-slate-500 max-w-xl mx-auto text-lg italic">
                        Specializing in Key tags, Hair clips, Flower bouquets, Pencil cases, and more.
                    </p>
                </div>

                {/* Filters, Search & Grid Selection */}
                <div className="flex flex-col md:flex-row gap-4 mb-12 items-center">
                    <div className="relative flex-1 group w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm shadow-pink-100 ring-2 ring-transparent focus:ring-pink-200 transition-all outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-4 w-full md:w-auto items-center">
                        <div className="flex bg-white rounded-2xl shadow-sm shadow-pink-100 p-1">
                            {/* Mobile Grid Switcher */}
                            <div className="flex md:hidden gap-1">
                                {[1, 2, 3].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setGridCols(n)}
                                        className={`p-2 rounded-xl text-[10px] font-black transition-all ${gridCols === n || (gridCols === 0 && n === 2) ? 'bg-pink-500 text-white' : 'text-slate-400'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                            {/* Web Grid Switcher */}
                            <div className="hidden md:flex gap-1">
                                {[4, 6, 8].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setGridCols(n)}
                                        className={`p-2 rounded-xl text-[10px] font-black transition-all ${gridCols === n || (gridCols === 0 && n === 4) ? 'bg-pink-500 text-white' : 'text-slate-400'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-4 flex-1 md:flex-none">
                            <select
                                className="flex-1 md:flex-none bg-white px-6 py-4 rounded-2xl shadow-sm shadow-pink-100 ring-2 ring-transparent focus:ring-pink-200 transition-all outline-none text-slate-600 font-bold text-sm appearance-none cursor-pointer"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat: any) => <option key={cat._id || cat} value={cat.name || cat}>{cat.name || cat}</option>)}
                            </select>

                            <select
                                className="flex-1 md:flex-none bg-white px-6 py-4 rounded-2xl shadow-sm shadow-pink-100 ring-2 ring-transparent focus:ring-pink-200 transition-all outline-none text-slate-600 font-bold text-sm appearance-none cursor-pointer"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="">Sort By</option>
                                <option value="newest">Newest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className={`grid gap-4 md:gap-8 animate-pulse ${gridCols === 0 ? 'grid-cols-2 lg:grid-cols-4' :
                        gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' :
                            gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                                gridCols === 6 ? 'grid-cols-2 lg:grid-cols-6' : 'grid-cols-3 lg:grid-cols-8'}`}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-[4/5] bg-pink-100 rounded-3xl" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-pink-100 border-dashed">
                        <p className="text-slate-400 font-medium italic">We couldn't find any products matching your criteria.</p>
                    </div>
                ) : (
                    <div className={`grid gap-4 md:gap-8 ${gridCols === 0 ? 'grid-cols-2 lg:grid-cols-4' :
                            gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-2' : gridCols === 3 ? 'grid-cols-3' :
                                gridCols === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                                    gridCols === 6 ? 'grid-cols-2 lg:grid-cols-6' : 'grid-cols-3 lg:grid-cols-8'
                        }`}>
                        {products.map(product => (
                            <ProductCard key={product._id} product={product} onAdd={handleAdd} />
                        ))}
                    </div>
                )}
            </main>

            <QuotationDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={items}
                onUpdateQty={updateQuantity}
                onRemove={removeFromQuotation}
                total={total}
            />

            {/* Logo Interaction Popup */}
            {showLogoPopup && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-12">
                    <div
                        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300"
                        onClick={() => setShowLogoPopup(false)}
                    />
                    <div className="relative w-full max-w-sm bg-white rounded-[3rem] p-12 shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500 ring-8 ring-pink-50">
                        <button
                            onClick={() => setShowLogoPopup(false)}
                            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="w-64 h-64 bg-white rounded-[3rem] p-3 shadow-2xl shadow-pink-200 mb-10 overflow-hidden ring-8 ring-pink-50/50">
                            <img
                                src="/logo.png"
                                alt="Anu's Touch"
                                className="w-full h-full object-cover scale-110 animate-logo-spin"
                            />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-slate-800 tracking-tighter uppercase italic">Anu's Touch</h2>
                            <div className="h-1 w-12 bg-pink-400 mx-auto rounded-full" />
                            <p className="text-pink-500 font-bold tracking-[0.2em] text-[10px] uppercase pt-2">A touch of LOVE in every gift.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
