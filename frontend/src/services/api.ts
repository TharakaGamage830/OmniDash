import axios from 'axios';
import { Product } from '../types';

const api = axios.create({
    baseURL: 'https://omnidash-dmsn.onrender.com/api',
});

export const getProducts = (params?: { search?: string; category?: string; sort?: string; stockStatus?: string }) =>
    api.get<Product[]>('/products', { params });

export const trackClick = (id: string) => api.post(`/products/${id}/click`);

export const logQuotation = (data: { items: any[]; totalAmount: number; whatsappMessage?: string }) =>
    api.post('/orders', data);

export default api;
