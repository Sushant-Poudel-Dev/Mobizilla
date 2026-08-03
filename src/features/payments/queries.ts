import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type Payment = {
  id: string;
  invoice_id: string;
  organization_id: string;
  amount_paid: number;
  payment_date: string;
  payment_method_id: string;
  received_by_user_id: string | null;
  remarks: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  payment_method?: { id: string; name: string };
  received_by?: { id: string; full_name: string } | null;
};

export type PaymentInsert = Omit<Payment, "id" | "created_at" | "updated_at" | "deleted_at" | "payment_method" | "received_by" | "organization_id" | "received_by_user_id">;

export async function getPaymentMethods(): Promise<{ id: string; name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_methods")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching payment methods:", error);
    return [];
  }

  return data ?? [];
}

export async function getPaymentsByInvoice(invoiceId: string): Promise<Payment[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select(`
      *,
      payment_method:payment_methods(id, name),
      received_by:app_users(id, full_name)
    `)
    .eq("invoice_id", invoiceId)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("payment_date", { ascending: false });

  if (error) {
    console.error("Error fetching payments:", error);
    return [];
  }

  return data ?? [];
}

export async function recordPayment(payment: PaymentInsert): Promise<Payment | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .insert({
      ...payment,
      organization_id: appUser.organization_id,
      received_by_user_id: appUser.id,
    })
    .select(`
      *,
      payment_method:payment_methods(id, name),
      received_by:app_users(id, full_name)
    `)
    .single();

  if (error) {
    console.error("Error recording payment:", error);
    return null;
  }

  return data;
}