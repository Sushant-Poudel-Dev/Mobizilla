import { createClient } from "@/src/lib/supabase/server";
import { getCurrentAppUser } from "@/src/lib/data/currentUser";

export type RepairStatus = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type RepairTicket = {
  id: string;
  organization_id: string;
  branch_id: string;
  customer_id: string;
  device_model_id: string | null;
  status_id: string;
  assigned_technician_id: string | null;
  ticket_number: string;
  issue_description: string | null;
  created_by_user_id: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer?: { id: string; full_name: string; phone_number: string | null };
  device_model?: { id: string; name: string; brand?: { name: string } } | null;
  status?: { id: string; name: string };
  assigned_technician?: { id: string; full_name: string } | null;
  branch?: { id: string; branch_name: string };
  parts?: RepairPart[];
  services?: RepairService[];
};

export type RepairPart = {
  id: string;
  repair_ticket_id: string;
  organization_id: string;
  inventory_stock_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  inventory_stock?: {
    id: string;
    inventory_item_id: string;
    condition_id: string;
    inventory_item?: { part_name: string; part_code: string | null };
    condition?: { name: string };
  };
};

export type RepairService = {
  id: string;
  repair_ticket_id: string;
  organization_id: string;
  service_name: string;
  service_price: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type RepairTicketInsert = Omit<RepairTicket, "id" | "created_at" | "updated_at" | "deleted_at" | "customer" | "device_model" | "status" | "assigned_technician" | "branch" | "parts" | "services">;

export async function getRepairStatuses(): Promise<RepairStatus[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_statuses")
    .select("*")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching repair statuses:", error);
    return [];
  }

  return data ?? [];
}

export async function getCustomersForRepair(): Promise<{ id: string; customer_name: string; phone: string | null }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, phone_number")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching customers:", error);
    return [];
  }

  return (data ?? []).map(c => ({ id: c.id, customer_name: c.full_name, phone: c.phone_number }));
}

export async function getDeviceModelsForRepair(): Promise<{ id: string; name: string; brand?: { name: string } }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("device_models")
    .select(`
      id,
      name,
      brand:brands(name)
    `)
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching device models:", error);
    return [];
  }

  return data ?? [];
}

export async function getTechniciansForRepair(): Promise<{ id: string; full_name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("app_users")
    .select("id, full_name")
    .eq("organization_id", appUser.organization_id)
    .in("role", ["technician", "owner", "admin"])
    .is("deleted_at", null)
    .order("full_name", { ascending: true });

  if (error) {
    console.error("Error fetching technicians:", error);
    return [];
  }

  return data ?? [];
}

export async function getBranchesForRepair(): Promise<{ id: string; branch_name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("branches")
    .select("id, branch_name")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("branch_name", { ascending: true });

  if (error) {
    console.error("Error fetching branches:", error);
    return [];
  }

  return data ?? [];
}

export async function getRepairTickets(filters?: {
  statusId?: string;
  branchId?: string;
  technicianId?: string;
}): Promise<RepairTicket[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  let query = supabase
    .from("repair_tickets")
.select(`
      *,
      customer:customers(id, full_name, phone_number),
      device_model:device_models(id, name, brand:brands(name)),
      status:repair_statuses(id, name),
      assigned_technician:app_users!repair_tickets_assigned_technician_id_fkey(id, full_name),
      branch:branches(id, branch_name)
    `)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (filters?.statusId) {
    query = query.eq("status_id", filters.statusId);
  }
  if (filters?.branchId) {
    query = query.eq("branch_id", filters.branchId);
  }
  if (filters?.technicianId) {
    query = query.eq("assigned_technician_id", filters.technicianId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching repair tickets:", error);
    return [];
  }

  return data ?? [];
}

export async function getRepairTicketById(id: string): Promise<RepairTicket | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_tickets")
    .select(`
      *,
      customer:customers(id, full_name, phone_number),
      device_model:device_models(id, name, brand:brands(name)),
      status:repair_statuses(id, name),
      assigned_technician:app_users!repair_tickets_assigned_technician_id_fkey(id, full_name),
      branch:branches(id, branch_name),
      parts:repair_parts(
        *,
        inventory_stock:inventory_stock(
          id,
          inventory_item_id,
          condition_id,
          inventory_item:inventory_items(part_name, part_code),
          condition:conditions(name)
        )
      ),
      services:repair_services(*)
    `)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .single();

  if (error) {
    console.error("Error fetching repair ticket:", error);
    return null;
  }

  return data;
}

export async function createRepairTicket(ticket: RepairTicketInsert): Promise<RepairTicket | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_tickets")
    .insert({
      ...ticket,
      organization_id: appUser.organization_id,
      created_by_user_id: appUser.id,
    })
    .select(`
      *,
      customer:customers(id, full_name, phone_number),
      device_model:device_models(id, name, brand:brands(name)),
      status:repair_statuses(id, name),
      assigned_technician:app_users!repair_tickets_assigned_technician_id_fkey(id, full_name),
      branch:branches(id, branch_name)
    `)
    .single();

  if (error) {
    console.error("Error creating repair ticket:", error);
    return null;
  }

  return data;
}

export async function updateTicketStatus(id: string, statusId: string): Promise<RepairTicket | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const updates = {
    status_id: statusId,
    closed_at: undefined as string | undefined,
  };
  
  // If status is "completed" or similar, set closed_at
  const { data: status } = await supabase
    .from("repair_statuses")
    .select("name")
    .eq("id", statusId)
    .single();
  
  if (status?.name?.toLowerCase().includes("complete") || status?.name?.toLowerCase().includes("closed")) {
    updates.closed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("repair_tickets")
    .update(updates)
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .select(`
      *,
      customer:customers(id, full_name, phone_number),
      device_model:device_models(id, name, brand:brands(name)),
      status:repair_statuses(id, name),
      assigned_technician:app_users!repair_tickets_assigned_technician_id_fkey(id, full_name),
      branch:branches(id, branch_name)
    `)
    .single();

  if (error) {
    console.error("Error updating ticket status:", error);
    return null;
  }

  return data;
}

export async function assignTechnician(id: string, technicianId: string | null): Promise<RepairTicket | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_tickets")
    .update({ assigned_technician_id: technicianId })
    .eq("id", id)
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .select(`
      *,
      customer:customers(id, full_name, phone_number),
      device_model:device_models(id, name, brand:brands(name)),
      status:repair_statuses(id, name),
      assigned_technician:app_users!repair_tickets_assigned_technician_id_fkey(id, full_name),
      branch:branches(id, branch_name)
    `)
    .single();

  if (error) {
    console.error("Error assigning technician:", error);
    return null;
  }

  return data;
}

export async function addRepairPart(
  repairTicketId: string,
  inventoryStockId: string,
  quantity: number,
  unitPrice: number
): Promise<RepairPart | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_parts")
    .insert({
      repair_ticket_id: repairTicketId,
      inventory_stock_id: inventoryStockId,
      quantity,
      unit_price: unitPrice,
      total_price: quantity * unitPrice,
      organization_id: appUser.organization_id,
    })
    .select(`
      *,
      inventory_stock:inventory_stock(
        id,
        inventory_item_id,
        condition_id,
        inventory_item:inventory_items(part_name, part_code),
        condition:conditions(name)
      )
    `)
    .single();

  if (error) {
    console.error("Error adding repair part:", error);
    return null;
  }

  return data;
}

export async function addRepairService(
  repairTicketId: string,
  serviceName: string,
  servicePrice: number
): Promise<RepairService | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("repair_services")
    .insert({
      repair_ticket_id: repairTicketId,
      service_name: serviceName,
      service_price: servicePrice,
      organization_id: appUser.organization_id,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding repair service:", error);
    return null;
  }

  return data;
}

export async function getInventoryItemsForRepair(): Promise<{ id: string; part_name: string; part_code: string | null }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .select("id, part_name, part_code")
    .eq("organization_id", appUser.organization_id)
    .is("deleted_at", null)
    .order("part_name", { ascending: true });

  if (error) {
    console.error("Error fetching inventory items:", error);
    return [];
  }

  return data ?? [];
}

export async function getConditionsForRepair(): Promise<{ id: string; name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conditions")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching conditions:", error);
    return [];
  }

  return data ?? [];
}

export type InventoryReservation = {
  id: string;
  organization_id: string;
  branch_id: string;
  inventory_stock_id: string;
  repair_ticket_id: string;
  reservation_date: string;
  reserved_quantity: number;
  status_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  inventory_stock?: {
    id: string;
    inventory_item_id: string;
    condition_id: string;
    current_quantity: number;
    reserved_quantity: number;
    inventory_item?: { part_name: string; part_code: string | null };
    condition?: { name: string };
  };
  status?: { id: string; name: string };
};

export async function reserveStock(
  repairTicketId: string,
  inventoryStockId: string,
  quantity: number,
  statusId: string
): Promise<InventoryReservation | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  // Check available stock
  const { data: stock, error: stockError } = await supabase
    .from("inventory_stock")
    .select("current_quantity, reserved_quantity")
    .eq("id", inventoryStockId)
    .eq("organization_id", appUser.organization_id)
    .single();

  if (stockError || !stock) {
    console.error("Error fetching stock:", stockError);
    return null;
  }

  const available = stock.current_quantity - stock.reserved_quantity;
  if (available < quantity) {
    console.error("Insufficient stock for reservation");
    return null;
  }

  // Create reservation
  const { data, error } = await supabase
    .from("inventory_reservations")
    .insert({
      repair_ticket_id: repairTicketId,
      inventory_stock_id: inventoryStockId,
      reserved_quantity: quantity,
      status_id: statusId,
      reservation_date: new Date().toISOString().split("T")[0],
      organization_id: appUser.organization_id,
      branch_id: appUser.branch_id || "",
    })
    .select(`
      *,
      inventory_stock:inventory_stock(
        id,
        inventory_item_id,
        condition_id,
        current_quantity,
        reserved_quantity,
        inventory_item:inventory_items(part_name, part_code),
        condition:conditions(name)
      ),
      status:reservation_statuses(id, name)
    `)
    .single();

  if (error) {
    console.error("Error creating reservation:", error);
    return null;
  }

  return data;
}

export async function releaseReservation(
  reservationId: string,
  newStatusId: string
): Promise<InventoryReservation | null> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("inventory_reservations")
    .update({ status_id: newStatusId })
    .eq("id", reservationId)
    .eq("organization_id", appUser.organization_id)
    .select(`
      *,
      inventory_stock:inventory_stock(
        id,
        inventory_item_id,
        condition_id,
        current_quantity,
        reserved_quantity,
        inventory_item:inventory_items(part_name, part_code),
        condition:conditions(name)
      ),
      status:reservation_statuses(id, name)
    `)
    .single();

  if (error) {
    console.error("Error releasing reservation:", error);
    return null;
  }

  return data;
}

export async function getReservationStatuses(): Promise<{ id: string; name: string }[]> {
  const appUser = await getCurrentAppUser();

  if (!appUser) {
    return [];
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reservation_statuses")
    .select("id, name")
    .is("deleted_at", null)
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching reservation statuses:", error);
    return [];
  }

  return data ?? [];
}