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

export type DeviceModel = {
  id: string;
  brand_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  brand?: Brand;
};

export type InventoryCompatibility = {
  id: string;
  organization_id: string;
  inventory_item_id: string;
  device_model_id: string;
  created_at: string;
  device_model?: DeviceModel;
};

export type InventoryStock = {
  id: string;
  organization_id: string;
  branch_id: string;
  inventory_item_id: string;
  condition_id: string;
  status_id: string;
  current_quantity: number;
  reserved_quantity: number;
  min_stock_level: number;
  max_stock_level: number | null;
  location_note: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  inventory_item?: InventoryItem;
  condition?: Condition;
  branch?: { id: string; branch_name: string };
  status?: { id: string; name: string };
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

export async function getDeviceModels(): Promise<DeviceModel[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_models")
    .select(`
      *,
      brand:brands(*)
    `)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching device models:", error);
    return [];
  }

  return data ?? [];
}

export async function getCompatibilityByItem(inventoryItemId: string): Promise<InventoryCompatibility[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_compatibility")
    .select(`
      *,
      device_model:device_models(
        *,
        brand:brands(*)
      )
    `)
    .eq("inventory_item_id", inventoryItemId)
    .eq("organization_id", appUser.organization_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching compatibility:", error);
    return [];
  }

  return data ?? [];
}

export async function getStockByBranch(branchId?: string): Promise<InventoryStock[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("inventory_stock")
    .select(`
      *,
      inventory_item:inventory_items(
        *,
        category:categories(*),
        brand:brands(*)
      ),
      condition:conditions(*),
      branch:branches(id, branch_name),
      status:inventory_statuses(id, name)
    `)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (branchId) {
    query = query.eq("branch_id", branchId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching stock:", error);
    return [];
  }

  return data ?? [];
}

export async function linkCompatibility(inventoryItemId: string, deviceModelId: string): Promise<InventoryCompatibility | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_compatibility")
    .insert({
      inventory_item_id: inventoryItemId,
      device_model_id: deviceModelId,
      organization_id: appUser.organization_id,
    })
    .select(`
      *,
      device_model:device_models(
        *,
        brand:brands(*)
      )
    `)
    .single();

  if (error) {
    console.error("Error linking compatibility:", error);
    return null;
  }

  return data;
}

export async function unlinkCompatibility(inventoryItemId: string, deviceModelId: string): Promise<boolean> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return false;
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    return false;
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("inventory_compatibility")
    .delete()
    .eq("inventory_item_id", inventoryItemId)
    .eq("device_model_id", deviceModelId)
    .eq("organization_id", appUser.organization_id);

  if (error) {
    console.error("Error unlinking compatibility:", error);
    return false;
  }

  return true;
}

export type StockAdjustment = {
  id: string;
  organization_id: string;
  branch_id: string;
  inventory_stock_id: string;
  adjustment_type: "increase" | "decrease" | "correction" | "damage" | "loss" | "return_to_supplier";
  adjustment_quantity: number;
  adjustment_date: string;
  reason: string | null;
  remarks: string | null;
  performed_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type StockAdjustmentInsert = Omit<StockAdjustment, "id" | "created_at" | "updated_at" | "deleted_at">;

export async function createStockAdjustment(adjustment: StockAdjustmentInsert): Promise<StockAdjustment | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("stock_adjustments")
    .insert({
      ...adjustment,
      organization_id: appUser.organization_id,
      performed_by_user_id: appUser.id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating stock adjustment:", error);
    return null;
  }

  return data;
}