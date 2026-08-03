import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type Invoice = {
  id: string;
  organization_id: string;
  branch_id: string;
  customer_id: string;
  repair_ticket_id: string;
  invoice_number: string;
  invoice_date: string;
  payment_status_id: string;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  created_by_user_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer?: { id: string; full_name: string; phone_number: string | null };
  branch?: { id: string; branch_name: string };
  payment_status?: { id: string; name: string };
  repair_ticket?: { id: string; ticket_number: string };
  line_items?: InvoiceLineItem[];
  payments?: Payment[];
};

export type InvoiceLineItem = {
  id: string;
  invoice_id: string;
  organization_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  repair_part_id: string | null;
  repair_service_id: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  repair_part?: { id: string; inventory_stock?: { inventory_item?: { part_name: string } } } | null;
  repair_service?: { id: string; service_name: string } | null;
};

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

export type InvoiceInsert = Omit<Invoice, "id" | "created_at" | "updated_at" | "deleted_at" | "customer" | "branch" | "payment_status" | "repair_ticket" | "line_items" | "payments">;

export type PaymentInsert = Omit<Payment, "id" | "created_at" | "updated_at" | "deleted_at" | "payment_method" | "received_by">;

export async function getInvoices(): Promise<Invoice[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers(id, full_name, phone_number),
      branch:branches(id, branch_name),
      payment_status:payment_statuses(id, name),
      repair_ticket:repair_tickets(id, ticket_number)
    `)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("invoice_date", { ascending: false });

  if (error) {
    console.error("Error fetching invoices:", error);
    return [];
  }

  return data ?? [];
}

export async function getInvoiceById(id: string): Promise<Invoice | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("invoices")
    .select(`
      *,
      customer:customers(id, full_name, phone_number),
      branch:branches(id, branch_name),
      payment_status:payment_statuses(id, name),
      repair_ticket:repair_tickets(id, ticket_number),
      line_items:invoice_line_items(
        *,
        repair_part:repair_parts(id, inventory_stock:inventory_stock(inventory_item:inventory_items(part_name))),
        repair_service:repair_services(id, service_name)
      ),
      payments:payments(
        *,
        payment_method:payment_methods(id, name),
        received_by:app_users(id, full_name)
      )
    `)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching invoice:", error);
    return null;
  }

  return data;
}

export async function createInvoiceFromTicket(repairTicketId: string): Promise<Invoice | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  // First, get the repair ticket with its parts and services
  const { data: ticket, error: ticketError } = await supabase
    .from("repair_tickets")
    .select(`
      *,
      customer:customers(id, full_name),
      branch:branches(id, branch_name),
      parts:repair_parts(
        *,
        inventory_stock:inventory_stock(inventory_item:inventory_items(part_name))
      ),
      services:repair_services(*)
    `)
    .eq("id", repairTicketId)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (ticketError || !ticket) {
    console.error("Error fetching repair ticket:", ticketError);
    return null;
  }

  // Check if invoice already exists for this ticket
  const { data: existingInvoice } = await supabase
    .from("invoices")
    .select("id")
    .eq("repair_ticket_id", repairTicketId)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (existingInvoice) {
    console.error("Invoice already exists for this ticket");
    return null;
  }

  // Calculate totals from parts and services
  const partsTotal = ticket.parts?.reduce((sum, p) => sum + Number(p.total_price), 0) ?? 0;
  const servicesTotal = ticket.services?.reduce((sum, s) => sum + Number(s.service_price), 0) ?? 0;
  const subtotal = partsTotal + servicesTotal;

  // Get default payment status (e.g., "Pending")
  const { data: pendingStatus } = await supabase
    .from("payment_statuses")
    .select("id")
    .ilike("name", "pending")
    .limit(1)
    .single();

  // Generate invoice number
  const invoiceNumber = `INV-${Date.now()}`;

  // Create invoice
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .insert({
      organization_id: appUser.organization_id,
      branch_id: ticket.branch_id,
      customer_id: ticket.customer_id,
      repair_ticket_id: repairTicketId,
      invoice_number: invoiceNumber,
      invoice_date: new Date().toISOString().split("T")[0],
      payment_status_id: pendingStatus?.id ?? "",
      tax_amount: 0,
      discount_amount: 0,
      total_amount: subtotal,
      created_by_user_id: appUser.id,
    })
    .select()
    .single();

  if (invoiceError || !invoice) {
    console.error("Error creating invoice:", invoiceError);
    return null;
  }

  // Create line items for parts
  if (ticket.parts && ticket.parts.length > 0) {
    const partItems = ticket.parts.map((part) => ({
      invoice_id: invoice.id,
      organization_id: appUser.organization_id,
      description: part.inventory_stock?.inventory_item?.part_name ?? "Part",
      quantity: part.quantity,
      unit_price: part.unit_price,
      total_price: part.total_price,
      repair_part_id: part.id,
      repair_service_id: null,
    }));

    const { error: partsError } = await supabase
      .from("invoice_line_items")
      .insert(partItems);

    if (partsError) {
      console.error("Error creating part line items:", partsError);
    }
  }

  // Create line items for services
  if (ticket.services && ticket.services.length > 0) {
    const serviceItems = ticket.services.map((service) => ({
      invoice_id: invoice.id,
      organization_id: appUser.organization_id,
      description: service.service_name,
      quantity: 1,
      unit_price: service.service_price,
      total_price: service.service_price,
      repair_part_id: null,
      repair_service_id: service.id,
    }));

    const { error: servicesError } = await supabase
      .from("invoice_line_items")
      .insert(serviceItems);

    if (servicesError) {
      console.error("Error creating service line items:", servicesError);
    }
  }

  // Return the full invoice with line items and payments
  return getInvoiceById(invoice.id);
}

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