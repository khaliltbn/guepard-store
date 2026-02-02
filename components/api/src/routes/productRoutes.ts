import { Router } from 'express';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', async (req, res) => {
  const { q, category } = req.query;

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: q ? [
          { name: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
        ] : undefined,
        category: category ? {
          slug: category as string
        } : undefined
      },
      include: { category: true, ratings: true },
      orderBy: { createdAt: 'desc' },
    });

    // Add averageRating to each product
    const productsWithRatings = products.map(product => {
      const avgRating = product.ratings.length > 0
        ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
        : 0;
      return {
        ...product,
        averageRating: Math.round(avgRating * 10) / 10,
        totalRatings: product.ratings.length
      };
    });

    res.json(productsWithRatings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, ratings: true },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const avgRating = product.ratings.length > 0
      ? product.ratings.reduce((sum, r) => sum + r.rating, 0) / product.ratings.length
      : 0;

    res.json({
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      totalRatings: product.ratings.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        categoryId: categoryId,
      },
    });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { name, description, price, stock, imageUrl, categoryId } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl,
        categoryId: categoryId,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.product.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;