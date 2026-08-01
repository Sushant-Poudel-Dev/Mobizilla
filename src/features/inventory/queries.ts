import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type Category = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Brand = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Condition = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type InventoryItem = {
  id: string;
  organization_id: string;
  category_id: string;
  brand_id: string | null;
  part_name: string;
  part_code: string | null;
  barcode: string | null;
  description: string | null;
  selling_price: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  category?: Category;
  brand?: Brand | null;
};

export type InventoryItemInsert = Omit<InventoryItem, "id" | "created_at" | "updated_at" | "deleted_at" | "category" | "brand">;

export async function getCategories(): Promise<Category[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data ?? [];
}

export async function getBrands(): Promise<Brand[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching brands:", error);
    return [];
  }

  return data ?? [];
}

export async function getConditions(): Promise<Condition[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conditions")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching conditions:", error);
    return [];
  }

  return data ?? [];
}

export async function getInventoryItems(): Promise<InventoryItem[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select(`
      *,
      category:categories(*),
      brand:brands(*)
    `)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("part_name", { ascending: true });

  if (error) {
    console.error("Error fetching inventory items:", error);
    return [];
  }

  return data ?? [];
}

export async function getInventoryItemById(id: string): Promise<InventoryItem | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select(`
      *,
      category:categories(*),
      brand:brands(*)
    `)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching inventory item:", error);
    return null;
  }

  return data;
}

export async function createInventoryItem(item: InventoryItemInsert): Promise<InventoryItem | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .insert({
      ...item,
      organization_id: appUser.organization_id,
    })
    .select(`
      *,
      category:categories(*),
      brand:brands(*)
    `)
    .single();

  if (error) {
    console.error("Error creating inventory item:", error);
    return null;
  }

  return data;
}

export async function updateInventoryItem(
  id: string,
  updates: Partial<InventoryItemInsert>
): Promise<InventoryItem | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .update(updates)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .select(`
      *,
      category:categories(*),
      brand:brands(*)
    `)
    .single();

  if (error) {
    console.error("Error updating inventory item:", error);
    return null;
  }

  return data;
}