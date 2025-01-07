import { db } from "../client";

async function addImageUrlColumn() {
  try {
    // Check if column exists
    const result = await db.execute(`
      SELECT name FROM pragma_table_info('inventory_items') WHERE name='image_url'
    `);

    if (result.rows.length === 0) {
      // Add the column if it doesn't exist
      await db.execute(`
        ALTER TABLE inventory_items
        ADD COLUMN image_url TEXT;
      `);
      console.log("Added image_url column successfully");
    } else {
      console.log("image_url column already exists");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}

export default addImageUrlColumn; 