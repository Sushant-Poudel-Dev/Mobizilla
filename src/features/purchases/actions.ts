"use server";

import { redirect } from "next/navigation";
import { createPurchase } from "@/src/features/purchases/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function createPurchaseAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/purchases/new?error=" + encodeURIComponent("Insufficient permissions to create purchases."));
  }

  const supplierId = formData.get("supplierId") as string;
  const branchId = formData.get("branchId") as string;
  const purchaseNumber = formData.get("purchaseNumber") as string;
  const purchaseDate = formData.get("purchaseDate") as string;
  const paymentStatusId = formData.get("paymentStatusId") as string;
  const additionalCost = formData.get("additionalCost") as string;

  const itemCount = Number(formData.get("itemCount") || "0");
  const items: Array<{
    inventoryItemId: string;
    conditionId: string;
    quantity: number;
    unitCost: number;
  }> = [];

  for (let i = 0; i < itemCount; i++) {
    const inventoryItemId = formData.get(`items[${i}].inventoryItemId`) as string;
    const conditionId = formData.get(`items[${i}].conditionId`) as string;
    const quantity = formData.get(`items[${i}].quantity`) as string;
    const unitCost = formData.get(`items[${i}].unitCost`) as string;

    if (inventoryItemId && conditionId && quantity && unitCost) {
      items.push({
        inventoryItemId,
        conditionId,
        quantity: Number(quantity),
        unitCost: Number(unitCost),
      });
    }
  }

  if (!supplierId || !branchId || !purchaseNumber || !purchaseDate || !paymentStatusId) {
    redirect("/dashboard/purchases/new?error=" + encodeURIComponent("All required fields must be filled."));
  }

  if (items.length === 0) {
    redirect("/dashboard/purchases/new?error=" + encodeURIComponent("At least one line item is required."));
  }

  const result = await createPurchase(
    {
      supplier_id: supplierId,
      branch_id: branchId,
      purchase_number: purchaseNumber,
      purchase_date: purchaseDate,
      payment_status_id: paymentStatusId,
      additional_cost: Number(additionalCost) || 0,
      organization_id: appUser.organization_id,
      created_by_user_id: appUser.id,
    },
items.map((item) => ({
      inventory_item_id: item.inventoryItemId,
      condition_id: item.conditionId,
      quantity: item.quantity,
      unit_cost: item.unitCost,
      total_cost: item.quantity * item.unitCost,
      organization_id: appUser.organization_id,
      purchase_id: "",
    }))
  );

  if (!result) {
    redirect("/dashboard/purchases/new?error=" + encodeURIComponent("Failed to create purchase."));
  }

  redirect("/dashboard/purchases?success=1");
}