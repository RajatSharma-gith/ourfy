import API from '../api/axios.ts';

// Add auth token to requests
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const productAPI = {
    getAll: () =>
        API.get('/products'),

    getPublished: () =>
        API.get('/products/published'),

    getUnpublished: () =>
        API.get('/products/unpublished'),

    create: (productData: any) =>
        API.post('/products', productData),

    update: (productId: string, productData: any) =>
        API.put(`/products/${productId}`, productData),

    delete: (productId: string) =>
        API.delete(`/products/${productId}`),

    publish: (productId: string, isPublished: boolean) =>
        API.patch(`/products/${productId}/publish`, { isPublished })
};


