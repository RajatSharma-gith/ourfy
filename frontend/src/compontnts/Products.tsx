import { useState, useEffect } from 'react';
import { productAPI } from '../services/productAPI';
import { AddProductModal } from './AddProductModal.tsx';
import './Products.css';

interface Product {
    _id: string;
    name: string;
    description: string;
    productType: string;
    quantityStock: number;
    mrp: number;
    sellingPrice: number;
    price?: number;
    brandName: string;
    exchangeEligible: boolean;
    image: string;
    isPublished: boolean;
    createdAt: string;
}

export function Products() {
    const [publishedProducts, setPublishedProducts] = useState<Product[]>([]);
    const [unpublishedProducts, setUnpublishedProducts] = useState<Product[]>([]);
    const [activeTab, setActiveTab] = useState<'published' | 'unpublished'>('published');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError('');

        try {
            const [publishedRes, unpublishedRes] = await Promise.all([
                productAPI.getPublished(),
                productAPI.getUnpublished()
            ]);

            setPublishedProducts(publishedRes.data.products);
            setUnpublishedProducts(unpublishedRes.data.products);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error fetching products');
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (productData: any) => {
        try {
            await productAPI.create(productData);
            setShowAddModal(false);
            fetchProducts();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error adding product');
        }
    };

    const handleDeleteProduct = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        setDeletingId(productId);

        try {
            await productAPI.delete(productId);
            fetchProducts();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error deleting product');
        } finally {
            setDeletingId(null);
        }
    };

    const handlePublishToggle = async (product: Product) => {
        try {
            await productAPI.publish(product._id, !product.isPublished);
            fetchProducts();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error updating product');
        }
    };

    const currentProducts = activeTab === 'published' ? publishedProducts : unpublishedProducts;
    const isEmpty = currentProducts.length === 0;

    return (
        <div className="products-container">
            {error && <div className="alert alert-error">{error}</div>}

            <div className="products-header">
                <h1>{activeTab === 'published' ? 'Published Products' : 'Unpublished Products'}</h1>
                <button
                    className="btn-add-product"
                    onClick={() => setShowAddModal(true)}
                >
                    + Add Product
                </button>
            </div>

            <div className="products-tabs">
                <button
                    className={`tab-btn ${activeTab === 'published' ? 'active' : ''}`}
                    onClick={() => setActiveTab('published')}
                >
                    Published ({publishedProducts.length})
                </button>
                <button
                    className={`tab-btn ${activeTab === 'unpublished' ? 'active' : ''}`}
                    onClick={() => setActiveTab('unpublished')}
                >
                    Unpublished ({unpublishedProducts.length})
                </button>
            </div>

            {isEmpty && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h2>No {activeTab === 'published' ? 'Published' : 'Unpublished'} Products</h2>
                    <p>
                        Your {activeTab === 'published' ? 'published' : 'unpublished'} products will appear here.
                        Create your first product to get started.
                    </p>
                    <button
                        className="btn-create-first"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Product
                    </button>
                </div>
            )}

            {loading && (
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading products...</p>
                </div>
            )}

            {!isEmpty && !loading && (
                <div className="products-grid">
                    {currentProducts.map((product) => (
                        <div key={product._id} className="product-card">
                            {product.image && (
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                            )}

                            <div className="product-content">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-description">{product.productType}</p>
                                <div className="product-meta-block">
                                    <div className="product-meta-row">
                                        <span className="meta-label">Qty:</span>
                                        <span>{product.quantityStock}</span>
                                    </div>
                                    <div className="product-meta-row">
                                        <span className="meta-label">MRP:</span>
                                        <span>₹{product.mrp.toFixed(2)}</span>
                                    </div>
                                    <div className="product-meta-row">
                                        <span className="meta-label">Selling:</span>
                                        <span>₹{product.sellingPrice.toFixed(2)}</span>
                                    </div>
                                    {product.brandName && (
                                        <div className="product-meta-row">
                                            <span className="meta-label">Brand:</span>
                                            <span>{product.brandName}</span>
                                        </div>
                                    )}
                                    <div className="product-meta-row">
                                        <span className="meta-label">Exchange:</span>
                                        <span>{product.exchangeEligible ? 'YES' : 'NO'}</span>
                                    </div>
                                </div>
                                {product.description && (
                                    <p className="product-description-detail">{product.description}</p>
                                )}

                                <div className="product-date">
                                    Created {new Date(product.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    className={`btn-status ${product.isPublished ? 'published' : 'unpublished'}`}
                                    onClick={() => handlePublishToggle(product)}
                                    title={product.isPublished ? 'Unpublish' : 'Publish'}
                                >
                                    {product.isPublished ? 'Unpublish' : 'Publish'}
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() => handleDeleteProduct(product._id)}
                                    disabled={deletingId === product._id}
                                >
                                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <AddProductModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddProduct}
                />
            )}
        </div>
    );
}
