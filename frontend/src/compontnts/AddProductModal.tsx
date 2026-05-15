import { useState } from 'react';
import './AddProductModal.css';

interface AddProductModalProps {
    onClose: () => void;
    onAdd: (productData: any) => void;
}

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        productType: '',
        quantityStock: '',
        mrp: '',
        sellingPrice: '',
        brandName: '',
        description: '',
        image: '',
        exchangeEligible: 'Yes',
        isPublished: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;

        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        setError('');
    };
    const [fileName, setFileName] = useState('');
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.name.trim()) {
            setError('Product name is required');
            return;
        }

        if (!formData.productType) {
            setError('Product type is required');
            return;
        }

        if (!formData.quantityStock || parseInt(formData.quantityStock, 10) < 0) {
            setError('Quantity stock must be a valid number');
            return;
        }

        if (!formData.sellingPrice || parseFloat(formData.sellingPrice) <= 0) {
            setError('Selling price must be a valid number');
            return;
        }

        setLoading(true);

        try {
            await onAdd({
                name: formData.name,
                productType: formData.productType,
                quantityStock: parseInt(formData.quantityStock, 10),
                mrp: formData.mrp ? parseFloat(formData.mrp) : 0,
                sellingPrice: parseFloat(formData.sellingPrice),
                brandName: formData.brandName,
                description: formData.description,
                image: formData.image,
                exchangeEligible: formData.exchangeEligible === 'Yes',
                isPublished: formData.isPublished
            });
            setFormData({
                name: '',
                productType: '',
                quantityStock: '',
                mrp: '',
                sellingPrice: '',
                brandName: '',
                description: '',
                image: '',
                exchangeEligible: 'Yes',
                isPublished: false
            });
        } catch (err: any) {
            setError(err.message || 'Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Add Product</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label htmlFor="name">Product Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="CakeZone Walnut Brownie"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="productType">Product Type *</label>
                        <select
                            id="productType"
                            name="productType"
                            value={formData.productType}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="">Select product type</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Cloths">Cloths</option>
                            <option value="Beauty Product">Beauty Product</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="quantityStock">Quantity Stock</label>
                            <input
                                type="number"
                                id="quantityStock"
                                name="quantityStock"
                                value={formData.quantityStock}
                                onChange={handleChange}
                                placeholder="Total numbers of stock available"
                                min="0"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="mrp">MRP</label>
                            <input
                                type="number"
                                id="mrp"
                                name="mrp"
                                value={formData.mrp}
                                onChange={handleChange}
                                placeholder="Total numbers of stock available"
                                step="0.01"
                                min="0"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="sellingPrice">Selling Price *</label>
                            <input
                                type="number"
                                id="sellingPrice"
                                name="sellingPrice"
                                value={formData.sellingPrice}
                                onChange={handleChange}
                                placeholder="Total numbers of stock available"
                                step="0.01"
                                min="0"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="brandName">Brand Name</label>
                            <input
                                type="text"
                                id="brandName"
                                name="brandName"
                                value={formData.brandName}
                                onChange={handleChange}
                                placeholder="Enter brand name"
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="imageFile">Upload Product Images</label>
                        <input
                            type="file"
                            id="imageFile"
                            name="imageFile"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="form-file-input"
                        />
                    </div>

                    {formData.image && (
                        <div className="image-preview">
                            <img src={formData.image} alt="Preview" />
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="description">Enter Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter Description"
                            className="form-textarea"
                            rows={4}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="exchangeEligible">Exchange or return eligibility</label>
                        <select
                            id="exchangeEligible"
                            name="exchangeEligible"
                            value={formData.exchangeEligible}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="isPublished"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleChange}
                            className="form-checkbox"
                        />
                        <label htmlFor="isPublished">Publish this product immediately</label>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
