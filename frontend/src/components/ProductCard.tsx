import React from 'react';
import { Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd }) => {
    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-pink-100 transition-all duration-300 hover:shadow-xl hover:shadow-pink-100 hover:-translate-y-1">
            <div className="aspect-square bg-pink-50 relative overflow-hidden">
                {product.images && product.images[0] ? (
                    <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-pink-200 uppercase font-bold text-xs">
                        No Image
                    </div>
                )}

                {product.stock.status !== 'IN_STOCK' && (
                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-pink-600 shadow-sm">
                        {product.stock.status.replace('_', ' ')}
                    </div>
                )}
            </div>

            <div className="p-3 sm:p-5">
                <div className="flex flex-col mb-2">
                    <p className="text-[8px] sm:text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-0.5">{product.category}</p>
                    <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-slate-800 leading-tight group-hover:text-pink-600 transition-colors uppercase text-xs sm:text-sm line-clamp-2">{product.name}</h3>
                        <p className="font-black text-pink-600 text-xs sm:text-sm shrink-0">Rs.{product.price.toLocaleString()}</p>
                    </div>
                </div>

                <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 mb-4 h-4 sm:h-8">{product.description}</p>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
                    <p className="text-[9px] font-mono text-slate-400 order-2 sm:order-1">{product.productCode}</p>
                    <button
                        onClick={() => onAdd(product)}
                        className="w-full sm:flex-1 bg-pink-100 hover:bg-pink-500 text-pink-600 hover:text-white px-2 sm:px-4 py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 group/btn order-1 sm:order-2"
                    >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/btn:rotate-90" />
                        <span className="hidden xs:inline">ADD TO QUOTE</span>
                        <span className="xs:hidden">ADD</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
