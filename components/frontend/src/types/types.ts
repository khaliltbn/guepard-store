export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

export interface Rating {
  id: string;
  productId: string;
  rating: number;
  review?: string;
  guestName?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category?: Category;
  imageUrl: string;
  created_at: string;
  updated_at: string;
  ratings?: Rating[];
  averageRating?: number;
  totalRatings?: number;
}

export interface Order {
  id: string;
  user_id?: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  price_at_time: number;
  created_at: string;
}

