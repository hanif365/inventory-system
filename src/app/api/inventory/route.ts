import { db } from '@/db/client';
import { NextResponse } from 'next/server';
import { CreateInventoryItem } from '@/types/inventory';
import { schema } from '@/db/schema';

export async function GET() {
  try {
    const result = await db.execute('SELECT * FROM inventory_items ORDER BY created_at DESC');
    return NextResponse.json({ data: result.rows });
  } catch (error) {
    console.error('Failed to fetch inventory:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateInventoryItem = await request.json();
    
    // First check if table exists
    await db.execute('SELECT 1 FROM inventory_items LIMIT 1').catch(async () => {
      // If table doesn't exist, create it
      await db.execute(schema);
    });
    
    const result = await db.execute({
      sql: `
        INSERT INTO inventory_items (name, description, quantity, price)
        VALUES (?, ?, ?, ?)
      `,
      args: [body.name, body.description, body.quantity, body.price],
    });

    // Convert BigInt to Number for JSON serialization
    const id = Number(result.lastInsertRowid);

    return NextResponse.json(
      { data: { id } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
} 