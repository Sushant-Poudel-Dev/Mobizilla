"use server";

import { redirect } from "next/navigation";
import { createCustomer, updateCustomer, deleteCustomer } from "@/src/features/customers/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function createCustomerAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  const customerName = formData.get("customerName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;

  if (!customerName) {
    redirect("/dashboard/customers?error=" + encodeURIComponent("Customer name is required."));
  }

  const result = await createCustomer({
    customer_name: customerName,
    phone: phone || null,
    email: email || null,
    address: address || null,
    notes: notes || null,
    branch_id: appUser.branch_id,
    organization_id: appUser.organization_id,
  });

  if (!result) {
    redirect("/dashboard/customers?error=" + encodeURIComponent("Failed to create customer."));
  }

  redirect("/dashboard/customers?success=1");
}

export async function updateCustomerAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const customerName = formData.get("customerName") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const notes = formData.get("notes") as string;

  if (!id || !customerName) {
    redirect("/dashboard/customers?error=" + encodeURIComponent("Customer name is required."));
  }

  const result = await updateCustomer(id, {
    customer_name: customerName,
    phone: phone || null,
    email: email || null,
    address: address || null,
    notes: notes || null,
  });

  if (!result) {
    redirect("/dashboard/customers?error=" + encodeURIComponent("Failed to update customer."));
  }

  redirect("/dashboard/customers?success=1");
}

export async function deleteCustomerAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  const id = formData.get("id") as string;

  if (!id) {
    redirect("/dashboard/customers?error=" + encodeURIComponent("Customer ID is required."));
  }

  const success = await deleteCustomer(id);

  if (!success) {
    redirect("/dashboard/customers?error=" + encodeURIComponent("Failed to delete customer."));
  }

  redirect("/dashboard/customers?success=1");
}