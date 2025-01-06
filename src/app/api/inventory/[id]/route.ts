import { db } from "@/db/client";
import { NextResponse } from "next/server";
import { UpdateInventoryItem } from "@/types/inventory";

export async function PATCH(
  request: Request,
  context: { params: { id: number } }
) {
  try {
    const { id } = await context.params;
    const updates: UpdateInventoryItem = await request.json();

    // Build the SQL update statement dynamically
    const updateFields = Object.entries(updates)
      .map(([key]) => `${key} = ?`)
      .join(", ");

    const values = Object.values(updates);

    await db.execute({
      sql: `
        UPDATE inventory_items 
        SET ${updateFields}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [...values, id],
    });

    return NextResponse.json(
      { message: "Item updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update item:", error);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: number } }
) {
  try {
    const { id } = await context.params;

    await db.execute({
      sql: "DELETE FROM inventory_items WHERE id = ?",
      args: [id],
    });

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete item:", error);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
}
