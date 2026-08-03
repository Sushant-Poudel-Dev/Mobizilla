"use server";

import { redirect } from "next/navigation";
import {
  createRepairTicket,
  updateTicketStatus,
  assignTechnician,
  addRepairPart,
  addRepairService,
  reserveStock,
  releaseReservation,
} from "@/src/features/repairs/queries";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export async function createRepairTicketAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  const customerId = formData.get("customerId") as string;
  const deviceModelId = formData.get("deviceModelId") as string;
  const issueDescription = formData.get("issueDescription") as string;
  const branchId = formData.get("branchId") as string;
  const statusId = formData.get("statusId") as string;

  if (!customerId || !branchId || !statusId) {
    redirect("/dashboard/repairs/new?error=" + encodeURIComponent("Customer, branch, and status are required."));
  }

  const result = await createRepairTicket({
    customer_id: customerId,
    device_model_id: deviceModelId || null,
    issue_description: issueDescription || null,
    branch_id: branchId,
    status_id: statusId,
    organization_id: appUser.organization_id,
    created_by_user_id: appUser.id,
    assigned_technician_id: null,
    closed_at: null,
    ticket_number: `RT-${Date.now()}`,
  });

  if (!result) {
    redirect("/dashboard/repairs/new?error=" + encodeURIComponent("Failed to create repair ticket."));
  }

  redirect(`/dashboard/repairs/${result.id}?success=1`);
}

export async function updateTicketStatusAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const statusId = formData.get("statusId") as string;

  if (!id || !statusId) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Ticket ID and status are required."));
  }

  const result = await updateTicketStatus(id, statusId);

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to update ticket status."));
  }

  redirect(`/dashboard/repairs/${id}?success=1`);
}

export async function assignTechnicianAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin") {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Insufficient permissions to assign technicians."));
  }

  const id = formData.get("id") as string;
  const technicianId = formData.get("technicianId") as string;

  if (!id) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Ticket ID is required."));
  }

  const result = await assignTechnician(id, technicianId || null);

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to assign technician."));
  }

  redirect(`/dashboard/repairs/${id}?success=1`);
}

export async function addRepairPartAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin" && appUser.role !== "technician" && appUser.role !== "front_desk") {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Insufficient permissions to add parts."));
  }

  const repairTicketId = formData.get("repairTicketId") as string;
  const inventoryStockId = formData.get("inventoryStockId") as string;
  const quantity = formData.get("quantity") as string;
  const unitPrice = formData.get("unitPrice") as string;

  if (!repairTicketId || !inventoryStockId || !quantity || !unitPrice) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("All fields are required."));
  }

  const result = await addRepairPart(
    repairTicketId,
    inventoryStockId,
    Number(quantity),
    Number(unitPrice)
  );

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to add repair part."));
  }

redirect(`/dashboard/repairs/${repairTicketId}?success=1`);
}

export async function reserveStockAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin" && appUser.role !== "technician" && appUser.role !== "front_desk") {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Insufficient permissions to reserve stock."));
  }

  const repairTicketId = formData.get("repairTicketId") as string;
  const inventoryStockId = formData.get("inventoryStockId") as string;
  const quantity = formData.get("quantity") as string;
  const statusId = formData.get("statusId") as string;

  if (!repairTicketId || !inventoryStockId || !quantity || !statusId) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("All fields are required."));
  }

  const result = await reserveStock(
    repairTicketId,
    inventoryStockId,
    Number(quantity),
    statusId
  );

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to reserve stock. Check available quantity."));
  }

  redirect(`/dashboard/repairs/${repairTicketId}?success=1`);
}

export async function releaseReservationAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin" && appUser.role !== "technician" && appUser.role !== "front_desk") {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Insufficient permissions to release reservation."));
  }

  const reservationId = formData.get("reservationId") as string;
  const statusId = formData.get("statusId") as string;

  if (!reservationId || !statusId) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("All fields are required."));
  }

  const result = await releaseReservation(reservationId, statusId);

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to release reservation."));
  }

  redirect(`/dashboard/repairs?success=1`);
}

export async function addRepairServiceAction(formData: FormData) {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    redirect("/login");
  }

  if (appUser.role !== "owner" && appUser.role !== "admin" && appUser.role !== "technician" && appUser.role !== "front_desk") {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Insufficient permissions to add services."));
  }

  const repairTicketId = formData.get("repairTicketId") as string;
  const serviceName = formData.get("serviceName") as string;
  const servicePrice = formData.get("servicePrice") as string;

  if (!repairTicketId || !serviceName || !servicePrice) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("All fields are required."));
  }

  const result = await addRepairService(
    repairTicketId,
    serviceName,
    Number(servicePrice)
  );

  if (!result) {
    redirect("/dashboard/repairs?error=" + encodeURIComponent("Failed to add repair service."));
  }

  redirect(`/dashboard/repairs/${repairTicketId}?success=1`);
}