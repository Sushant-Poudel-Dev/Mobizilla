"use server";

import { redirect } from "next/navigation";
import { createInventoryItem, updateInventoryItem, linkCompatibility, unlinkCompatibility, createStockAdjustment } from "@/src/features/inventory/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function createInventoryItemAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Insufficient permissions to create inventory items."));
  }

  const partName = formData.get("partName") as string;
  const partCode = formData.get("partCode") as string;
  const barcode = formData.get("barcode") as string;
  const categoryId = formData.get("categoryId") as string;
  const brandId = formData.get("brandId") as string;
  const description = formData.get("description") as string;
  const sellingPrice = formData.get("sellingPrice") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!partName || !categoryId || !sellingPrice) {
    redirect("/dashboard/inventory/new?error=" + encodeURIComponent("Part name, category, and selling price are required."));
  }

  const result = await createInventoryItem({
    part_name: partName,
    part_code: partCode || null,
    barcode: barcode || null,
    category_id: categoryId,
    brand_id: brandId || null,
    description: description || null,
    selling_price: Number(sellingPrice),
    image_url: imageUrl || null,
    organization_id: appUser.organization_id,
  });

  if (!result) {
    redirect("/dashboard/inventory/new?error=" + encodeURIComponent("Failed to create inventory item."));
  }

redirect("/dashboard/inventory?success=1");
}

export async function createStockAdjustmentAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/inventory/stock?error=" + encodeURIComponent("Insufficient permissions to create stock adjustments."));
  }

  const inventoryStockId = formData.get("inventoryStockId") as string;
  const adjustmentType = formData.get("adjustmentType") as "increase" | "decrease" | "correction" | "damage" | "loss" | "return_to_supplier";
  const adjustmentQuantity = formData.get("adjustmentQuantity") as string;
  const reason = formData.get("reason") as string;
  const remarks = formData.get("remarks") as string;
  const adjustmentDate = formData.get("adjustmentDate") as string;

  if (!inventoryStockId || !adjustmentType || !adjustmentQuantity) {
    redirect("/dashboard/inventory/stock?error=" + encodeURIComponent("Inventory item, adjustment type, and quantity are required."));
  }

  const validTypes = ["increase", "decrease", "correction", "damage", "loss", "return_to_supplier"] as const;
  if (!validTypes.includes(adjustmentType)) {
    redirect("/dashboard/inventory/stock?error=" + encodeURIComponent("Invalid adjustment type."));
  }

  const adjustment_date = adjustmentDate ?? new Date().toISOString().split("T")[0];

  const result = await createStockAdjustment({
    inventory_stock_id: inventoryStockId,
    adjustment_type: adjustmentType,
    adjustment_quantity: Number(adjustmentQuantity),
    reason: reason || null,
    remarks: remarks || null,
    adjustment_date,
    branch_id: appUser.branch_id || "",
    organization_id: appUser.organization_id,
    performed_by_user_id: appUser.id,
  });

  if (!result) {
    redirect("/dashboard/inventory/stock?error=" + encodeURIComponent("Failed to create stock adjustment."));
  }

  redirect("/dashboard/inventory/stock?success=1");
}

export async function linkCompatibilityAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Insufficient permissions."));
  }

  const inventoryItemId = formData.get("inventoryItemId") as string;
  const deviceModelId = formData.get("deviceModelId") as string;

  if (!inventoryItemId || !deviceModelId) {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Missing required fields."));
  }

  const result = await linkCompatibility(inventoryItemId, deviceModelId);

  if (!result) {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Failed to link compatibility."));
  }

  redirect(`/dashboard/inventory/${inventoryItemId}?success=1`);
}

export async function unlinkCompatibilityAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Insufficient permissions."));
  }

  const inventoryItemId = formData.get("inventoryItemId") as string;
  const deviceModelId = formData.get("deviceModelId") as string;

  if (!inventoryItemId || !deviceModelId) {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Missing required fields."));
  }

  const success = await unlinkCompatibility(inventoryItemId, deviceModelId);

  if (!success) {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Failed to unlink compatibility."));
  }

  redirect(`/dashboard/inventory/${inventoryItemId}?success=1`);
}

export async function updateInventoryItemAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Insufficient permissions to update inventory items."));
  }

  const id = formData.get("id") as string;
  const partName = formData.get("partName") as string;
  const partCode = formData.get("partCode") as string;
  const barcode = formData.get("barcode") as string;
  const categoryId = formData.get("categoryId") as string;
  const brandId = formData.get("brandId") as string;
  const description = formData.get("description") as string;
  const sellingPrice = formData.get("sellingPrice") as string;
  const imageUrl = formData.get("imageUrl") as string;

  if (!id || !partName || !categoryId || !sellingPrice) {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Part name, category, and selling price are required."));
  }

  const result = await updateInventoryItem(id, {
    part_name: partName,
    part_code: partCode || null,
    barcode: barcode || null,
    category_id: categoryId,
    brand_id: brandId || null,
    description: description || null,
    selling_price: Number(sellingPrice),
    image_url: imageUrl || null,
  });

  if (!result) {
    redirect("/dashboard/inventory?error=" + encodeURIComponent("Failed to update inventory item."));
  }

  redirect("/dashboard/inventory?success=1");
}