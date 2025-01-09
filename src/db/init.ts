import { db } from "./client";
import { schema } from "./schema";
import addImageUrlColumn from "./migrations/addImageUrl";

export async function initializeDatabase() {
  try {
    // Create tables one by one
    for (const [table, query] of Object.entries(schema)) {
      await db.execute(query);
      console.log(`Created ${table} table successfully`);
    }
    console.log("Database schema initialized successfully");

    // Run migrations
    await addImageUrlColumn();
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
