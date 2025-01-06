import { db } from './client';
import { schema } from './schema';

export async function initializeDatabase() {
  try {
    await db.execute(schema);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
} 