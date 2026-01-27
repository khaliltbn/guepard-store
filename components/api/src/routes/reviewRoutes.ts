import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/product/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Invalid review data' });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    const reviews = await prisma.review.findMany({
      where: { productId },
    });

    const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const reviewCount = reviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        averageRating: averageRating,
        reviewCount: reviewCount,
      },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create review' });
  }
});

export default router;
