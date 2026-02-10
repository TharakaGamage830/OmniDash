import axios from 'axios';
import { Product, Order } from '../types';

const api = axios.create({
    baseURL: 'https://omnidash-dmsn.onrender.com/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const adminLogin = (creds: any) => api.post<{ token: string }>('/admin/login', creds);
export const getAdminProducts = () => api.get<Product[]>('/products?includeHidden=true');
export const addProduct = (data: any) => api.post<Product>('/products/admin/add', data);
export const updateProduct = (id: string, data: any) => api.put<Product>(`/products/admin/update/${id}`, data);
export const deleteProduct = (id: string) => api.delete(`/products/admin/delete/${id}`);
export const handleGRN = (data: { productId: string; quantity: number; reason?: string }) => api.post<Product>('/products/admin/grn', data);
export const handleReturn = (data: { productId: string; quantity: number; reason?: string }) => api.post<Product>('/products/admin/return', data);
export const toggleVisibility = (id: string) => api.patch<Product>(`/products/admin/toggle-visibility/${id}`);
export const getOrderHistory = () => api.get<Order[]>('/orders/admin/history');
export const getStockHistory = () => api.get<any[]>('/products/admin/stock-history');

export default api;
