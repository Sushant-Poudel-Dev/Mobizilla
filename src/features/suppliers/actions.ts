"use server";

import { redirect } from "next/navigation";
import { createSupplier, updateSupplier, deleteSupplier } from "@/src/features/suppliers/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function createSupplierAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Insufficient permissions to create suppliers."));
  }

  const supplierName = formData.get("supplierName") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const remarks = formData.get("remarks") as string;

  if (!supplierName) {
    redirect("/dashboard/suppliers/new?error=" + encodeURIComponent("Supplier name is required."));
  }

  const result = await createSupplier({
    supplier_name: supplierName,
    contact_person: contactPerson || null,
    phone_number: phone || null,
    email: email || null,
    address: address || null,
    remarks: remarks || null,
    organization_id: appUser.organization_id,
  });

  if (!result) {
    redirect("/dashboard/suppliers/new?error=" + encodeURIComponent("Failed to create supplier."));
  }

  redirect("/dashboard/suppliers?success=1");
}

export async function updateSupplierAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Insufficient permissions to update suppliers."));
  }

  const id = formData.get("id") as string;
  const supplierName = formData.get("supplierName") as string;
  const contactPerson = formData.get("contactPerson") as string;
  const phone = formData.get("phone") as string;
  const email = formData.get("email") as string;
  const address = formData.get("address") as string;
  const remarks = formData.get("remarks") as string;

  if (!id || !supplierName) {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Supplier name is required."));
  }

  const result = await updateSupplier(id, {
    supplier_name: supplierName,
    contact_person: contactPerson || null,
    phone_number: phone || null,
    email: email || null,
    address: address || null,
    remarks: remarks || null,
  });

  if (!result) {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Failed to update supplier."));
  }

  redirect("/dashboard/suppliers?success=1");
}

export async function deleteSupplierAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Insufficient permissions to delete suppliers."));
  }

  const id = formData.get("id") as string;

  if (!id) {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Supplier ID is required."));
  }

  const success = await deleteSupplier(id);

  if (!success) {
    redirect("/dashboard/suppliers?error=" + encodeURIComponent("Failed to delete supplier."));
  }

  redirect("/dashboard/suppliers?success=1");
}