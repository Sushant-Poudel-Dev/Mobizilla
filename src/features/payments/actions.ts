"use server";

import { redirect } from "next/navigation";
import { recordPayment } from "@/src/features/payments/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function recordPaymentAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  // Only owner, admin, and front_desk can record payments
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

  const result = await recordPayment({
    invoice_id: invoiceId,
    amount_paid: Number(amountPaid),
    payment_method_id: paymentMethodId,
    payment_date: paymentDate,
    remarks: remarks || null,
  });

  if (!result) {
    redirect(`/dashboard/invoices/${invoiceId}?error=` + encodeURIComponent("Failed to record payment."));
  }

  redirect(`/dashboard/invoices/${invoiceId}?success=1`);
}