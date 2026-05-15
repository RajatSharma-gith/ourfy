import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    productType: {
        type: String,
        required: false
    },
    quantityStock: {
        type: Number,
        default: 0,
        min: 0
    },
    mrp: {
        type: Number,
        default: 0,
        min: 0
    },
    sellingPrice: {
        type: Number,
        required: true,
        min: 0
    },

    brandName: {
        type: String,
        required: false
    },
    exchangeEligible: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Product', productSchema);
