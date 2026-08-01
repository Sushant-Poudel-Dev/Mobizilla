"use server";

import { redirect } from "next/navigation";
import { createInventoryItem, updateInventoryItem } from "@/src/features/inventory/queries";
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