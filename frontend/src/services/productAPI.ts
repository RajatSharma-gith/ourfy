import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const productAPI = {
    getAll: () =>
        api.get('/products'),

    getPublished: () =>
        api.get('/products/published'),

    getUnpublished: () =>
        api.get('/products/unpublished'),

    create: (productData: any) =>
        api.post('/products', productData),

    update: (productId: string, productData: any) =>
        api.put(`/products/${productId}`, productData),

    delete: (productId: string) =>
        api.delete(`/products/${productId}`),

    publish: (productId: string, isPublished: boolean) =>
        api.patch(`/products/${productId}/publish`, { isPublished })
};

export default api;
