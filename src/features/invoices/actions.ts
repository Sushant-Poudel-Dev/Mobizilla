"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { createInvoiceFromTicket } from "@/src/features/invoices/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function createInvoiceFromTicketAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin" && appUser.role !== "front_desk") {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Insufficient permissions to create invoices."));
  }

  const repairTicketId = formData.get("repairTicketId") as string;

  if (!repairTicketId) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Repair ticket ID is required."));
  }

  const result = await createInvoiceFromTicket(repairTicketId);

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to create invoice. Invoice may already exist or ticket not found."));
  }

  redirect(`/dashboard/invoices/${result.id}?success=1`);
}

export async function addPaymentAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin" && appUser.role !== "front_desk") {
    redirect("/dashboard/invoices?error=" + encodeURIComponent("Insufficient permissions to record payments."));
  }

  const invoiceId = formData.get("invoiceId") as string;
  const amountPaid = formData.get("amountPaid") as string;
  const paymentMethodId = formData.get("paymentMethodId") as string;
  const paymentDate = formData.get("paymentDate") as string;
  const remarks = formData.get("remarks") as string;

  if (!invoiceId || !amountPaid || !paymentMethodId || !paymentDate) {
    redirect("/dashboard/invoices?error=" + encodeURIComponent("All fields are required."));
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("payments")
    .insert({
      invoice_id: invoiceId,
      amount_paid: Number(amountPaid),
      payment_method_id: paymentMethodId,
      payment_date: paymentDate,
      remarks: remarks || null,
      received_by_user_id: appUser.id,
      organization_id: appUser.organization_id,
    });

  if (error) {
    console.error("Error recording payment:", error);
    redirect(`/dashboard/invoices/${invoiceId}?error=` + encodeURIComponent("Failed to record payment."));
  }

  redirect(`/dashboard/invoices/${invoiceId}?success=1`);
}