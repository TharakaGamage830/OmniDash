import { useState, useEffect } from 'react';
import { Product, QuotationItem } from '../types';

export const useQuotation = () => {
    const [items, setItems] = useState<QuotationItem[]>([]);

    // Load from session storage (persists on refresh but not new visit)
    useEffect(() => {
        const saved = sessionStorage.getItem('quotation');
        if (saved) setItems(JSON.parse(saved));
    }, []);

    useEffect(() => {
        sessionStorage.setItem('quotation', JSON.stringify(items));
    }, [items]);

    const addToQuotation = (product: Product) => {
        setItems((prev) => {
            const existing = prev.find((item) => item._id === product._id);
            if (existing) {
                return prev.map((item) =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromQuotation = (id: string) => {
        setItems((prev) => prev.filter((item) => item._id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item._id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return { items, addToQuotation, removeFromQuotation, updateQuantity, total };
};
