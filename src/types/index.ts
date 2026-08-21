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
  primary_unit_id: number;
  secondary_unit_id: number;
  unit_conversion: number;
  hsn_code?: string;
  gst_rate?: number;
  deal_start?: string;
  deal_end?: string;
  created_at: string;
  updated_at: string;
  unit_name?: string;
  primary_unit?: string;
  secondary_unit?: string;
}

export interface Category {
  id: number;
  name: string;
  image_path: string;
  created_at: string;
}

export interface Banner {
  id: number;
  title: string;
  image_path: string;
  link_url: string;
  active: number;
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
  total: number;
  delivery_charge: number;
  status: string;
  payment_method: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price_each: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: 'customer' | 'admin' | 'salesman' | 'supervisor' | 'deliveryman';
  created_at: string;
}

export interface TierPricing {
  min_qty: number;
  type: string;
  value: number;
}

export interface FlashDeal {
  product_id: number;
  flash_price: number;
  flash_start: string;
  flash_end: string;
}

export interface Popup {
  id: number;
  title: string;
  message: string;
  image_url: string;
  button_text: string;
  button_link: string;
  active: number;
  start_date: string;
  end_date: string;
  per_session: number;
  dismissible: number;
}