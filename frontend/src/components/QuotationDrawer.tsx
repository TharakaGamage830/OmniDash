import React from 'react';
import { X, Trash2, Plus, Minus, Send, ShoppingBag } from 'lucide-react';
import { formatWhatsAppMessage } from '../utils/whatsapp';
import { QuotationItem } from '../types';

interface QuotationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: QuotationItem[];
    onUpdateQty: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
    total: number;
}

export const QuotationDrawer: React.FC<QuotationDrawerProps> = ({ isOpen, onClose, items, onUpdateQty, onRemove, total }) => {
    if (!isOpen) return null;

    const handlePlaceOrder = () => {
        const encodedMessage = formatWhatsAppMessage(items, total);
        const whatsappUrl = `https://wa.me/94762310156?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-pink-900/20 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                <div className="p-6 border-b border-pink-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-pink-500" />
                        <h2 className="text-xl font-bold text-slate-800">Your Quotation</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-pink-50 rounded-full text-slate-400">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center text-pink-200">
                                <ShoppingBag className="w-10 h-10" />
                            </div>
                            <p className="text-slate-400 font-medium italic">Your quotation is currently empty.</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item._id} className="flex gap-4 group">
                                <div className="w-20 h-20 bg-pink-50 rounded-2xl overflow-hidden flex-shrink-0">
                                    {item.images && item.images[0] && (
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between mb-1">
                                        <h4 className="font-bold text-slate-800 truncate uppercase text-sm">{item.name}</h4>
                                        <button onClick={() => onRemove(item._id)} className="text-slate-300 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mb-2 uppercase tracking-wide">{item.productCode}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center bg-pink-50 rounded-full px-2 py-1 gap-3">
                                            <button onClick={() => onUpdateQty(item._id, -1)} className="text-pink-600 hover:bg-pink-100 rounded-full p-1"><Minus className="w-3 h-3" /></button>
                                            <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                            <button onClick={() => onUpdateQty(item._id, 1)} className="text-pink-600 hover:bg-pink-100 rounded-full p-1"><Plus className="w-3 h-3" /></button>
                                        </div>
                                        <p className="font-bold text-pink-600 text-sm">Rs.{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className="p-6 bg-pink-50/50 border-t border-pink-100 space-y-4">
                        <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-pink-100">
                            <span className="text-slate-500 font-medium">Total Amount</span>
                            <span className="text-2xl font-black text-pink-600">Rs.{total.toLocaleString()}</span>
                        </div>

                        <button
                            onClick={handlePlaceOrder}
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-pink-200 transition-all hover:-translate-y-1 active:scale-[0.98]"
                        >
                            <Send className="w-5 h-5" />
                            SEND QUOTATION VIA WHATSAPP
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
