import { NextResponse } from 'next/server';
import { dbQuery, dbInsert } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await dbQuery(`
      SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC
    `, [session.userId]);

    for (const order of orders) {
      const items = await dbQuery(`
        SELECT * FROM order_items WHERE order_id = ?
      `, [order.id]);
      order.items = items;
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, address, payment_method, items } = body;

    if (!name || !phone || !address || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

    const orderId = await dbInsert(`
      INSERT INTO orders (user_id, name, phone, address, total, delivery_charge, status, payment_method)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [session.userId, name, phone, address, total, 0, 'pending', payment_method || 'cod']);

    for (const item of items) {
      await dbInsert(`
        INSERT INTO order_items (order_id, product_id, product_name, quantity, price_each)
        VALUES (?, ?, ?, ?, ?)
      `, [orderId, item.product_id, item.product_name || '', item.quantity, item.price]);
    }

    return NextResponse.json({ success: true, orderId });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}