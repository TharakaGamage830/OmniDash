import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface NavbarProps {
    cartCount: number;
    onCartClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg shadow-pink-200 ring-2 ring-white">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-cover scale-110" />
                </div>
                <div className="flex flex-col">
                    <span className="text-pink-600 font-black tracking-tighter text-xl leading-none">Anu's Touch</span>
                    <span className="text-[10px] text-pink-400 font-bold uppercase tracking-widest pl-0.5">Gift Shop</span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={onCartClick}
                    className="relative p-2 text-pink-600 hover:bg-pink-50 rounded-full transition-colors"
                >
                    <ShoppingCart className="w-6 h-6" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                            {cartCount}
                        </span>
                    )}
                </button>
            </div>
        </nav>
    );
};
