import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type Customer = {
  id: string;
  organization_id: string;
  branch_id: string | null;
  customer_name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CustomerInsert = Omit<Customer, "id" | "created_at" | "updated_at" | "deleted_at">;

function mapCustomer(row: {
  id: string;
  organization_id: string;
  full_name: string;
  phone_number: string | null;
  email: string | null;
  address: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  branch_id?: string | null;
}): Customer {
  return {
    id: row.id,
    organization_id: row.organization_id,
    branch_id: row.branch_id ?? null,
    customer_name: row.full_name,
    phone: row.phone_number,
    email: row.email,
    address: row.address,
    notes: row.remarks,
    created_at: row.created_at,
    updated_at: row.updated_at,
    deleted_at: row.deleted_at,
  };
}

export async function getCustomers(): Promise<Customer[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data ?? []).map(mapCustomer);
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching customer:", error);
    return null;
  }

  return data ? mapCustomer(data) : null;
}

export async function createCustomer(customer: CustomerInsert): Promise<Customer | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .insert({
      full_name: customer.customer_name,
      phone_number: customer.phone,
      email: customer.email,
      address: customer.address,
      remarks: customer.notes,
      organization_id: appUser.organization_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating customer:", error);
    return null;
  }

  return mapCustomer(data);
}

export async function updateCustomer(
  id: string,
  updates: Partial<CustomerInsert>
): Promise<Customer | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const dbUpdates: {
    full_name?: string;
    phone_number?: string | null;
    email?: string | null;
    address?: string | null;
    remarks?: string | null;
  } = {};
  if (updates.customer_name !== undefined) dbUpdates.full_name = updates.customer_name;
  if (updates.phone !== undefined) dbUpdates.phone_number = updates.phone;
  if (updates.email !== undefined) dbUpdates.email = updates.email;
  if (updates.address !== undefined) dbUpdates.address = updates.address;
  if (updates.notes !== undefined) dbUpdates.remarks = updates.notes;

  const { data, error } = await supabase
    .from("customers")
    .update(dbUpdates)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    console.error("Error updating customer:", error);
    return null;
  }

  return mapCustomer(data);
}

export async function deleteCustomer(id: string): Promise<boolean> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return false;
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("customers")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null);

  if (error) {
    console.error("Error deleting customer:", error);
    return false;
  }

  return true;
}