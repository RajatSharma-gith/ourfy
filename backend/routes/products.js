import express from 'express';
import Product from '../models/Product.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Error fetching products' });
    }
});


router.get('/published', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId, isPublished: true }).sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        console.error('Get published products error:', error);
        res.status(500).json({ message: 'Error fetching published products' });
    }
});

router.get('/unpublished', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find({ userId: req.userId, isPublished: false }).sort({ createdAt: -1 });
        res.status(200).json({ products });
    } catch (error) {
        console.error('Get unpublished products error:', error);
        res.status(500).json({ message: 'Error fetching unpublished products' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            name,
            description,
            productType,
            quantityStock,
            mrp,
            sellingPrice,
            brandName,
            exchangeEligible,
            image,
            isPublished
        } = req.body;

        if (!name || sellingPrice === undefined) {
            return res.status(400).json({ message: 'Name and selling price are required' });
        }

        const product = new Product({
            userId: req.userId,
            name,
            description,
            productType,
            quantityStock: quantityStock || 0,
            mrp: mrp || 0,
            sellingPrice,
            brandName,
            exchangeEligible: exchangeEligible || false,
            image,
            isPublished: isPublished || false,

        });

        await product.save();
        res.status(201).json({ message: 'Product created successfully', product });
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Error creating product' });
    }
});

router.put('/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const {
            name,
            description,
            productType,
            quantityStock,
            mrp,
            sellingPrice,
            brandName,
            exchangeEligible,
            image,
            isPublished
        } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.productType = productType || product.productType;
        product.quantityStock = quantityStock !== undefined ? quantityStock : product.quantityStock;
        product.mrp = mrp !== undefined ? mrp : product.mrp;
        product.sellingPrice = sellingPrice !== undefined ? sellingPrice : product.sellingPrice;
        product.price = product.sellingPrice;
        product.brandName = brandName || product.brandName;
        product.exchangeEligible = exchangeEligible !== undefined ? exchangeEligible : product.exchangeEligible;
        product.image = image || product.image;
        product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
        product.updatedAt = new Date();

        await product.save();
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
});

router.delete('/:productId', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await Product.findByIdAndDelete(productId);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Error deleting product' });
    }
});

router.patch('/:productId/publish', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.params;
        const { isPublished } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.userId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        product.isPublished = isPublished;
        product.updatedAt = new Date();
        await product.save();

        res.status(200).json({ message: 'Product status updated', product });
    } catch (error) {
        console.error('Publish product error:', error);
        res.status(500).json({ message: 'Error updating product status' });
    }
});

export default router;
