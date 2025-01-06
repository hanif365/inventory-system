import { initializeDatabase } from '../src/db/init';

async function setup() {
  try {
    await initializeDatabase();
    console.log('Database setup completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setup(); 