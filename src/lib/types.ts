export interface Product {
  id: number;
  category_id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  mrp: number;
  mrp2: number;
  discount_type: string;
  discount_value: number;
  visible: number;
  is_deal_of_day: number;
  is_best_seller: number;
  is_product_of_week: number;
  is_must_buy: number;
  stock: number;
  image_path: string;
  unit_name?: string;
  secondary_unit_name?: string;
  unit_conversion?: number;
  hsn_code?: string;
  gst_rate?: number;
}

export interface Category {
  id: number;
  name: string;
  image_path: string;
}

export interface Banner {
  id: number;
  title: string;
  image_path: string;
  link_url: string;
  active: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  delivery_charge: number;
  status: string;
  payment_method: string;
  created_at: string;
  address?: string;
  phone?: string;
  name?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}
