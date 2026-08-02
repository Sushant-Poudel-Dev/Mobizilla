import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type Supplier = {
  id: string;
  organization_id: string;
  supplier_name: string;
  contact_person: string | null;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type SupplierInsert = Omit<Supplier, "id" | "created_at" | "updated_at" | "deleted_at">;

export async function getSuppliers(): Promise<Supplier[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("supplier_name", { ascending: true });

  if (error) {
    console.error("Error fetching suppliers:", error);
    return [];
  }

  return data ?? [];
}

export async function getSupplierById(id: string): Promise<Supplier | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching supplier:", error);
    return null;
  }

  return data;
}

export async function createSupplier(supplier: SupplierInsert): Promise<Supplier | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .insert({
      ...supplier,
      organization_id: appUser.organization_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating supplier:", error);
    return null;
  }

  return data;
}

export async function updateSupplier(
  id: string,
  updates: Partial<SupplierInsert>
): Promise<Supplier | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("suppliers")
    .update(updates)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error updating supplier:", error);
    return null;
  }

  return data;
}

export async function deleteSupplier(id: string): Promise<boolean> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return false;
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("suppliers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null);

  if (error) {
    console.error("Error deleting supplier:", error);
    return false;
  }

  return true;
}