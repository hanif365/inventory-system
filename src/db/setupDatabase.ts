import { initializeDatabase } from "./init";

async function setupDatabase() {
  try {
    await initializeDatabase();
    console.log("Database setup completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Database setup failed:", error);
    process.exit(1);
  }
}

setupDatabase();
