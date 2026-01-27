import { Product, Category, Review } from "../types/types";
import { CartItem } from '@/contexts/CartContext'; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type ProductFormData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  categoryId: string;
};

type GetProductsParams = {
  search?: string;
  category?: string; 
};

export interface OrderPayload {
  clientInfo: {
    name: string;
    phone: string;
    address: string;
  };
  cartItems: CartItem[];
}


export const getProducts = async (params: GetProductsParams = {}): Promise<Product[]> => {
  const queryParams = new URLSearchParams();

  if (params.search) {
    queryParams.append('q', params.search);
  }
  if (params.category) {
    queryParams.append('category', params.category);
  }

  const queryString = queryParams.toString();

  const requestUrl = `${API_BASE_URL}/products${queryString ? `?${queryString}` : ''}`;

  const response = await fetch(requestUrl);
  if (!response.ok) throw new Error('Failed to fetch products');

  const products: Product[] = await response.json();
  return products.map(product => ({
    ...product,
    price: parseFloat(product.price as any), 
  }));
};



export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  return response.json();
};



export const createProduct = async (productData: ProductFormData): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
};

export const updateProduct = async ({ id, data }: { id: string; data: Partial<ProductFormData> }): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
};

export const deleteProduct = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete product');
};


export const createOrder = async (orderData: OrderPayload) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create order');
  }

  return response.json();
};

export const getReviews = async (productId: string): Promise<Review[]> => {
  const response = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return response.json();
};

export const createReview = async (reviewData: { productId: string; rating: number; comment?: string }): Promise<Review> => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to create review');
  }
  return response.json();
};