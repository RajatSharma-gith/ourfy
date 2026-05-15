import { useState } from 'react';

interface AddProductModalProps {
    onClose: () => void;
    onAdd: (productData: any) => void;
}

export function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
    const [form, setForm] = useState({
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
    const [fileName, setFileName] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as any;
        if (type === 'checkbox') {
            setForm(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm(prev => ({ ...prev, [name]: value }));
        }
        setError('');
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = () => setForm(prev => ({ ...prev, image: reader.result as string }));
        reader.readAsDataURL(file);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) { setError('Product name is required'); return; }
        if (!form.productType) { setError('Product type is required'); return; }
        if (!form.sellingPrice || parseFloat(form.sellingPrice) <= 0) { setError('Selling price required'); return; }

        setLoading(true);
        try {
            await onAdd({
                name: form.name,
                productType: form.productType,
                quantityStock: parseInt(form.quantityStock) || 0,
                mrp: form.mrp ? parseFloat(form.mrp) : 0,
                sellingPrice: parseFloat(form.sellingPrice),
                brandName: form.brandName,
                description: form.description,
                image: form.image,
                exchangeEligible: form.exchangeEligible === 'Yes',
                isPublished: form.isPublished
            });
        } catch (err: any) { setError(err.message || 'Error'); }
        finally { setLoading(false); }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
                    <h2 className="text-lg font-bold text-slate-800">Add Product</h2>
                    <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all text-xl leading-none">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name *</label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="CakeZone Walnut Brownie" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Type *</label>
                        <select name="productType" value={form.productType} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white">
                            <option value="">Select product type</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Cloths">Cloths</option>
                            <option value="Beauty Product">Beauty Product</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity Stock</label>
                            <input type="number" name="quantityStock" value={form.quantityStock} onChange={handleChange} placeholder="Stock available" min="0" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">MRP</label>
                            <input type="number" name="mrp" value={form.mrp} onChange={handleChange} placeholder="MRP" step="0.01" min="0" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price *</label>
                            <input type="number" name="sellingPrice" value={form.sellingPrice} onChange={handleChange} placeholder="Selling price" step="0.01" min="0" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Brand Name</label>
                            <input type="text" name="brandName" value={form.brandName} onChange={handleChange} placeholder="Brand name" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Upload Product Images</label>
                        <div className="relative">
                            <input type="file" accept="image/*" onChange={handleFile} className="w-full py-8 px-4 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 file:hidden cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-center" />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-slate-400">
                                <span className="text-xs font-medium">{fileName || 'Enter Description'}</span>
                                <span className="text-xs font-semibold text-slate-600 mt-0.5">Browse</span>
                            </div>
                        </div>
                    </div>

                    {form.image && (
                        <div className="h-40 rounded-lg overflow-hidden border border-slate-200 bg-slate-50">
                            <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Enter Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Enter Description" rows={3} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Exchange or return eligibility</label>
                        <select name="exchangeEligible" value={form.exchangeEligible} onChange={handleChange} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white">
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <input type="checkbox" id="isPublished" name="isPublished" checked={form.isPublished} onChange={handleChange} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                        <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 cursor-pointer select-none">Publish this product immediately</label>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose} disabled={loading} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50">
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-sm font-semibold rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}