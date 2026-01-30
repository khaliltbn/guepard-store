import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

// Submit a new rating
router.post('/', async (req, res) => {
    try {
        const { productId, rating, review, guestName } = req.body;

        if (!productId || !rating) {
            return res.status(400).json({ error: 'productId and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const newRating = await prisma.rating.create({
            data: {
                productId,
                rating: parseInt(rating),
                review: review || null,
                guestName: guestName || null,
            },
            include: { product: true }
        });

        res.status(201).json(newRating);
    } catch (error) {
        console.error('Failed to create rating:', error);
        res.status(500).json({ error: 'Failed to create rating' });
    }
});

// Get all ratings for a product
router.get('/product/:productId', async (req, res) => {
    const { productId } = req.params;

    try {
        const ratings = await prisma.rating.findMany({
            where: { productId },
            orderBy: { createdAt: 'desc' }
        });

        // Calculate average rating
        const averageRating = ratings.length > 0
            ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
            : 0;

        res.json({
            ratings,
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: ratings.length
        });
    } catch (error) {
        console.error('Failed to fetch ratings:', error);
        res.status(500).json({ error: 'Failed to fetch ratings' });
    }
});

export default router;
