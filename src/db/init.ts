import { db } from "./client";
import { schema } from "./schema";
import addImageUrlColumn from "./migrations/addImageUrl";

export async function initializeDatabase() {
  try {
    // Create base table
    await db.execute(schema);
    console.log("Database schema initialized successfully");

    // Run migrations
    await addImageUrlColumn();
    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}
