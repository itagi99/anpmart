'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  mrp: number;
  stock: number;
  image_path: string;
  unit_name?: string;
}

interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  unit_name?: string;
}

export default function SupervisorCreateOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const res = await fetch('/api/products');
    const data = await res.json();
    setProducts(data.products || []);
  }

  const filtered = products.filter(
    (p) => p.stock > 0 && p.name.toLowerCase().includes(search.toLowerCase())
  );

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((c) => c.product_id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product_id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: 1, unit_name: product.unit_name }];
    });
  }

  function updateQuantity(productId: number, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c.product_id === productId ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function removeFromCart(productId: number) {
    setCart((prev) => prev.filter((c) => c.product_id !== productId));
  }

  const total = cart.reduce((sum, c) => sum + c.price * c.quantity, 0);

  async function handleSubmit() {
    if (!customerName || !customerPhone || cart.length === 0) {
      setMessage('Please fill customer details and add products');
      return;
    }
    setSubmitting(true);
    setMessage('');
    try {
      const res = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_address: customerAddress,
          items: cart.map((c) => ({ product_id: c.product_id, quantity: c.quantity, price: c.price })),
          total,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || 'Failed to create order');
        return;
      }
      setMessage('Order created successfully!');
      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setCustomerAddress('');
    } catch {
      setMessage('Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Create Order</h1>

      {message && (
        <div className={`px-4 py-2 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Search products..."
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-sm">Products</h2>
            </div>
            <div className="divide-y max-h-[500px] overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm">No products found</div>
              ) : (
                filtered.map((product) => (
                  <div key={product.id} className="px-4 py-3 flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.name}</p>
                      <p className="text-xs text-gray-500">₹{product.price} / {product.unit_name || 'pc'}</p>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="ml-3 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 flex-shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
            <h2 className="font-semibold text-sm">Customer Info</h2>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Customer name"
            />
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Phone number"
            />
            <textarea
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Address"
              rows={2}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-4 space-y-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <h2 className="font-semibold text-sm">Cart ({cart.length})</h2>
            </div>
            {cart.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No items added</p>
            ) : (
              <>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => updateQuantity(item.product_id, -1)} className="p-1 hover:bg-gray-100 rounded">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product_id, 1)} className="p-1 hover:bg-gray-100 rounded">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.product_id)} className="p-1 hover:bg-red-50 rounded text-red-500">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || cart.length === 0}
                  className="w-full bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                >
                  {submitting ? 'Placing Order...' : 'Place Order'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
