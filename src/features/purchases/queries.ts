import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type PurchaseItem = {
  id: string;
  purchase_id: string;
  organization_id: string;
  inventory_item_id: string;
  condition_id: string;
  quantity: number;
  unit_cost: number;
  total_cost: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  inventory_item?: {
    id: string;
    part_name: string;
    part_code: string | null;
    category?: { name: string };
    brand?: { name: string } | null;
  };
  condition?: { name: string };
};

export type Purchase = {
  id: string;
  organization_id: string;
  branch_id: string;
  supplier_id: string;
  purchase_number: string;
  purchase_date: string;
  payment_status_id: string;
  additional_cost: number;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  supplier?: { id: string; supplier_name: string };
  branch?: { id: string; branch_name: string };
  payment_status?: { name: string };
  items?: PurchaseItem[];
};

export type PurchaseInsert = Omit<Purchase, "id" | "created_at" | "updated_at" | "deleted_at" | "supplier" | "branch" | "payment_status" | "items">;

export type PurchaseItemInsert = Omit<PurchaseItem, "id" | "created_at" | "updated_at" | "deleted_at" | "inventory_item" | "condition">;

export async function getSuppliersForPurchase(): Promise<{ id: string; supplier_name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("id, supplier_name")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("supplier_name", { ascending: true });

  if (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }

  return data ?? [];
}

export async function getBranchesForPurchase(): Promise<{ id: string; branch_name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("branches")
    .select("id, branch_name")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("branch_name", { ascending: true });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  return data ?? [];
}

export async function getPaymentStatuses(): Promise<{ id: string; name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_statuses")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching payment statuses:", error);
    return [];
  }

  return data ?? [];
}

export async function getInventoryItemsForPurchase(): Promise<{ id: string; part_name: string; part_code: string | null }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, part_name, part_code")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("part_name", { ascending: true });

  if (error) {
    console.error("Error fetching inventory items:", error);
    return [];
  }

  return data ?? [];
}

export async function getConditions(): Promise<{ id: string; name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conditions")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching conditions:", error);
    return [];
  }

  return data ?? [];
}

export async function getPurchases(): Promise<Purchase[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchases")
    .select(`
      *,
      supplier:suppliers(id, supplier_name),
      branch:branches(id, branch_name),
      payment_status:payment_statuses(name)
    `)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("purchase_date", { ascending: false });

  if (error) {
    console.error("Error fetching purchases:", error);
    return [];
  }

  return data ?? [];
}

export async function getPurchaseById(id: string): Promise<Purchase | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("purchases")
    .select(`
      *,
      supplier:suppliers(id, supplier_name),
      branch:branches(id, branch_name),
      payment_status:payment_statuses(name),
      items:purchase_items(
        *,
        inventory_item:inventory_items(
          id, part_name, part_code,
          category:categories(name),
          brand:brands(name)
        ),
        condition:conditions(name)
      )
    `)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching purchase:", error);
    return null;
  }

  return data;
}

export async function createPurchase(purchase: PurchaseInsert, items: PurchaseItemInsert[]): Promise<Purchase | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data: purchaseData, error: purchaseError } = await supabase
    .from("purchases")
    .insert({
      ...purchase,
      organization_id: appUser.organization_id,
      created_by_user_id: appUser.id,
    })
    .select()
    .single();

  if (purchaseError) {
    console.error("Error creating purchase:", purchaseError);
    return null;
  }

  if (items.length > 0) {
    const itemsWithPurchaseId = items.map((item) => ({
      ...item,
      purchase_id: purchaseData.id,
      organization_id: appUser.organization_id,
      total_cost: item.quantity * item.unit_cost,
    }));

    const { error: itemsError } = await supabase
      .from("purchase_items")
      .insert(itemsWithPurchaseId);

    if (itemsError) {
      console.error("Error creating purchase items:", itemsError);
      return null;
    }
  }

  return getPurchaseById(purchaseData.id);
}