import { useState, useEffect } from 'react';
import { productAPI } from '../services/productAPI';
import { AddProductModal } from './AddProductModal.tsx';

interface Product {
    _id: string;
    name: string;
    description: string;
    productType: string;
    quantityStock: number;
    mrp: number;
    sellingPrice: number;
    brandName: string;
    exchangeEligible: boolean;
    image: string;
    isPublished: boolean;
    createdAt: string;
}

export function Products() {
    const [published, setPublished] = useState<Product[]>([]);
    const [unpublished, setUnpublished] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'published' | 'unpublished'>('published');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState('');

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        setLoading(true); setError('');
        try {
            const [pub, unpub] = await Promise.all([
                productAPI.getPublished(),
                productAPI.getUnpublished()
            ]);
            setPublished(pub.data.products);
            setUnpublished(unpub.data.products);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error fetching products');
        } finally { setLoading(false); }
    };

    const handleAdd = async (data: any) => {
        try {
            await productAPI.create(data);
            setShowModal(false);
            setToast('Product added Successfully');
            setTimeout(() => setToast(''), 3000);
            fetchProducts();
        } catch (err: any) { setError(err.response?.data?.message || 'Error adding product'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this product?')) return;
        setDeletingId(id);
        try { await productAPI.delete(id); fetchProducts(); }
        catch (err: any) { setError(err.response?.data?.message || 'Error deleting'); }
        finally { setDeletingId(null); }
    };

    const handlePublishToggle = async (product: Product) => {
        try { await productAPI.publish(product._id, !product.isPublished); fetchProducts(); }
        catch (err: any) { setError(err.response?.data?.message || 'Error updating'); }
    };

    const current = activeTab === 'published' ? published : unpublished;
    const isEmpty = current.length === 0;

    return (
        <div className="p-6 max-w-7xl mx-auto">

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white border border-green-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 z-50">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium text-slate-700">{toast}</span>
                    <button onClick={() => setToast('')} className="text-slate-400 hover:text-slate-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                    {error}
                </div>
            )}


            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-slate-800">Products</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Products
                </button>
            </div>


            <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('published')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'published' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Published ({published.length})
                </button>
                <button
                    onClick={() => setActiveTab('unpublished')}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'unpublished' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    Unpublished ({unpublished.length})
                </button>
            </div>

            {/* Empty State */}
            {isEmpty && !loading && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="w-16 h-16 text-blue-900 mb-4">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <path d="M17.5 17.5h-3v-3h3v3zm0-3v3m-3-3h3" strokeLinecap="round" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-semibold text-slate-700 mb-2">Feels a little empty over here...</h2>
                    <p className="text-sm text-slate-400 max-w-xs mb-6">
                        You can create products without connecting store you can add products to store anytime
                    </p>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-8 py-2.5 bg-linear-to-r from-blue-800 to-blue-800 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all"
                    >
                        Add your Products
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm text-slate-500">Loading products...</p>
                </div>
            )}

            {/* Product Grid */}
            {!isEmpty && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {current.map(product => (
                        <div key={product._id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {product.image && (
                                <div className="h-48 bg-slate-50 flex items-center justify-center p-4">
                                    <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain rounded-lg" />
                                </div>
                            )}

                            <div className="p-5">
                                <h3 className="font-bold text-slate-800 mb-3 text-sm">{product.name}</h3>

                                <div className="space-y-1.5 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Product type</span>
                                        <span className="text-slate-700 font-medium">{product.productType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Quantity Stock</span>
                                        <span className="text-slate-700 font-medium">{product.quantityStock}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">MRP</span>
                                        <span className="text-slate-700 font-medium">₹{product.mrp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Selling Price</span>
                                        <span className="text-slate-700 font-medium">₹{product.sellingPrice}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Brand Name</span>
                                        <span className="text-slate-700 font-medium">{product.brandName || '-'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Total Number of images</span>
                                        <span className="text-slate-700 font-medium">{product.image ? 1 : 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Exchange Eligibility</span>
                                        <span className="text-slate-700 font-medium">{product.exchangeEligible ? 'YES' : 'NO'}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-5">
                                    <button
                                        onClick={() => handlePublishToggle(product)}
                                        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${product.isPublished
                                            ? 'bg-linear-to-r from-blue-600 to-indigo-700 text-white hover:shadow-md'
                                            : 'bg-linear-to-r from-green-500 to-emerald-600 text-white hover:shadow-md'
                                            }`}
                                    >
                                        {product.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button className="px-3 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        disabled={deletingId === product._id}
                                        className="px-3 py-2 border border-slate-200 rounded-lg text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <AddProductModal onClose={() => setShowModal(false)} onAdd={handleAdd} />
            )}
        </div>
    );
}