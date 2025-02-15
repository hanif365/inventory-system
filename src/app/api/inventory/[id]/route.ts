import { db } from "@/db/client";
import { NextResponse } from "next/server";
import { UpdateInventoryItem } from "@/types/inventory";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const parsedId = parseInt((await params).id);
    const updates: UpdateInventoryItem = await request.json();

    if ('name' in updates) {
      return NextResponse.json(
        { error: "Name field cannot be updated" },
        { status: 400 }
      );
    }

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
      args: [...values, parsedId],
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const parsedId = parseInt((await params).id);

    await db.execute({
      sql: "DELETE FROM inventory_items WHERE id = ?",
      args: [parsedId],
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
