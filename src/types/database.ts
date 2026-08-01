export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      app_users: {
        Row: {
          auth_user_id: string
          branch_id: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          auth_user_id: string
          branch_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email: string
          full_name: string
          id?: string
          organization_id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          auth_user_id?: string
          branch_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string
          full_name?: string
          id?: string
          organization_id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_users_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      branches: {
        Row: {
          address: string | null
          branch_name: string
          created_at: string
          deleted_at: string | null
          id: string
          organization_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          branch_name: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          organization_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          branch_name?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          organization_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      brands: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      conditions: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          full_name: string
          id: string
          organization_id: string
          phone_number: string | null
          remarks: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name: string
          id?: string
          organization_id: string
          phone_number?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          organization_id?: string
          phone_number?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      device_models: {
        Row: {
          brand_id: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          brand_id: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          brand_id?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_models_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_compatibility: {
        Row: {
          created_at: string
          device_model_id: string
          id: string
          inventory_item_id: string
          organization_id: string
        }
        Insert: {
          created_at?: string
          device_model_id: string
          id?: string
          inventory_item_id: string
          organization_id: string
        }
        Update: {
          created_at?: string
          device_model_id?: string
          id?: string
          inventory_item_id?: string
          organization_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_compatibility_device_model_id_fkey"
            columns: ["device_model_id"]
            isOneToOne: false
            referencedRelation: "device_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_compatibility_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_compatibility_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_items: {
        Row: {
          barcode: string | null
          brand_id: string | null
          category_id: string
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          image_url: string | null
          organization_id: string
          part_code: string | null
          part_name: string
          selling_price: number
          updated_at: string
        }
        Insert: {
          barcode?: string | null
          brand_id?: string | null
          category_id: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          organization_id: string
          part_code?: string | null
          part_name: string
          selling_price?: number
          updated_at?: string
        }
        Update: {
          barcode?: string | null
          brand_id?: string | null
          category_id?: string
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          organization_id?: string
          part_code?: string | null
          part_name?: string
          selling_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          branch_id: string
          created_at: string
          id: string
          inventory_reservation_id: string | null
          inventory_stock_id: string
          movement_date: string
          movement_type: Database["public"]["Enums"]["inventory_movement_type"]
          organization_id: string
          performed_by_user_id: string | null
          purchase_item_id: string | null
          quantity: number
          remarks: string | null
          repair_part_id: string | null
          stock_adjustment_id: string | null
        }
        Insert: {
          branch_id: string
          created_at?: string
          id?: string
          inventory_reservation_id?: string | null
          inventory_stock_id: string
          movement_date?: string
          movement_type: Database["public"]["Enums"]["inventory_movement_type"]
          organization_id: string
          performed_by_user_id?: string | null
          purchase_item_id?: string | null
          quantity: number
          remarks?: string | null
          repair_part_id?: string | null
          stock_adjustment_id?: string | null
        }
        Update: {
          branch_id?: string
          created_at?: string
          id?: string
          inventory_reservation_id?: string | null
          inventory_stock_id?: string
          movement_date?: string
          movement_type?: Database["public"]["Enums"]["inventory_movement_type"]
          organization_id?: string
          performed_by_user_id?: string | null
          purchase_item_id?: string | null
          quantity?: number
          remarks?: string | null
          repair_part_id?: string | null
          stock_adjustment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_inventory_reservation_id_fkey"
            columns: ["inventory_reservation_id"]
            isOneToOne: false
            referencedRelation: "inventory_reservations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_inventory_stock_id_fkey"
            columns: ["inventory_stock_id"]
            isOneToOne: false
            referencedRelation: "inventory_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_performed_by_user_id_fkey"
            columns: ["performed_by_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_purchase_item_id_fkey"
            columns: ["purchase_item_id"]
            isOneToOne: false
            referencedRelation: "purchase_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_repair_part_id_fkey"
            columns: ["repair_part_id"]
            isOneToOne: false
            referencedRelation: "repair_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_stock_adjustment_id_fkey"
            columns: ["stock_adjustment_id"]
            isOneToOne: false
            referencedRelation: "stock_adjustments"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_reservations: {
        Row: {
          branch_id: string
          created_at: string
          deleted_at: string | null
          id: string
          inventory_stock_id: string
          organization_id: string
          repair_ticket_id: string
          reservation_date: string
          reserved_quantity: number
          status_id: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_stock_id: string
          organization_id: string
          repair_ticket_id: string
          reservation_date?: string
          reserved_quantity: number
          status_id: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_stock_id?: string
          organization_id?: string
          repair_ticket_id?: string
          reservation_date?: string
          reserved_quantity?: number
          status_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_reservations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_inventory_stock_id_fkey"
            columns: ["inventory_stock_id"]
            isOneToOne: false
            referencedRelation: "inventory_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_repair_ticket_id_fkey"
            columns: ["repair_ticket_id"]
            isOneToOne: false
            referencedRelation: "repair_tickets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_reservations_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "reservation_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_statuses: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_stock: {
        Row: {
          branch_id: string
          condition_id: string
          created_at: string
          current_quantity: number
          deleted_at: string | null
          id: string
          inventory_item_id: string
          location_note: string | null
          max_stock_level: number | null
          min_stock_level: number
          organization_id: string
          reserved_quantity: number
          status_id: string
          updated_at: string
        }
        Insert: {
          branch_id: string
          condition_id: string
          created_at?: string
          current_quantity?: number
          deleted_at?: string | null
          id?: string
          inventory_item_id: string
          location_note?: string | null
          max_stock_level?: number | null
          min_stock_level?: number
          organization_id: string
          reserved_quantity?: number
          status_id: string
          updated_at?: string
        }
        Update: {
          branch_id?: string
          condition_id?: string
          created_at?: string
          current_quantity?: number
          deleted_at?: string | null
          id?: string
          inventory_item_id?: string
          location_note?: string | null
          max_stock_level?: number | null
          min_stock_level?: number
          organization_id?: string
          reserved_quantity?: number
          status_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_stock_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_condition_id_fkey"
            columns: ["condition_id"]
            isOneToOne: false
            referencedRelation: "conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_stock_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "inventory_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string
          id: string
          invoice_id: string
          organization_id: string
          quantity: number
          repair_part_id: string | null
          repair_service_id: string | null
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description: string
          id?: string
          invoice_id: string
          organization_id: string
          quantity?: number
          repair_part_id?: string | null
          repair_service_id?: string | null
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string
          id?: string
          invoice_id?: string
          organization_id?: string
          quantity?: number
          repair_part_id?: string | null
          repair_service_id?: string | null
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_repair_part_id_fkey"
            columns: ["repair_part_id"]
            isOneToOne: false
            referencedRelation: "repair_parts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_line_items_repair_service_id_fkey"
            columns: ["repair_service_id"]
            isOneToOne: false
            referencedRelation: "repair_services"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          branch_id: string
          created_at: string
          created_by_user_id: string | null
          customer_id: string
          deleted_at: string | null
          discount_amount: number
          id: string
          invoice_date: string
          invoice_number: string
          organization_id: string
          payment_status_id: string
          repair_ticket_id: string
          tax_amount: number
          total_amount: number
          updated_at: string
        }
        Insert: {
          branch_id: string
          created_at?: string
          created_by_user_id?: string | null
          customer_id: string
          deleted_at?: string | null
          discount_amount?: number
          id?: string
          invoice_date?: string
          invoice_number: string
          organization_id: string
          payment_status_id: string
          repair_ticket_id: string
          tax_amount?: number
          total_amount: number
          updated_at?: string
        }
        Update: {
          branch_id?: string
          created_at?: string
          created_by_user_id?: string | null
          customer_id?: string
          deleted_at?: string | null
          discount_amount?: number
          id?: string
          invoice_date?: string
          invoice_number?: string
          organization_id?: string
          payment_status_id?: string
          repair_ticket_id?: string
          tax_amount?: number
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_payment_status_id_fkey"
            columns: ["payment_status_id"]
            isOneToOne: false
            referencedRelation: "payment_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_repair_ticket_id_fkey"
            columns: ["repair_ticket_id"]
            isOneToOne: false
            referencedRelation: "repair_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address: string | null
          business_name: string
          created_at: string
          currency: string
          deleted_at: string | null
          email: string | null
          id: string
          phone_number: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          business_name: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          business_name?: string
          created_at?: string
          currency?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_statuses: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount_paid: number
          created_at: string
          deleted_at: string | null
          id: string
          invoice_id: string
          organization_id: string
          payment_date: string
          payment_method_id: string
          received_by_user_id: string | null
          remarks: string | null
          updated_at: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          invoice_id: string
          organization_id: string
          payment_date?: string
          payment_method_id: string
          received_by_user_id?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          deleted_at?: string | null
          id?: string
          invoice_id?: string
          organization_id?: string
          payment_date?: string
          payment_method_id?: string
          received_by_user_id?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_received_by_user_id_fkey"
            columns: ["received_by_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          condition_id: string
          created_at: string
          deleted_at: string | null
          id: string
          inventory_item_id: string
          organization_id: string
          purchase_id: string
          quantity: number
          total_cost: number
          unit_cost: number
          updated_at: string
        }
        Insert: {
          condition_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_item_id: string
          organization_id: string
          purchase_id: string
          quantity: number
          total_cost: number
          unit_cost: number
          updated_at?: string
        }
        Update: {
          condition_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_item_id?: string
          organization_id?: string
          purchase_id?: string
          quantity?: number
          total_cost?: number
          unit_cost?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_condition_id_fkey"
            columns: ["condition_id"]
            isOneToOne: false
            referencedRelation: "conditions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          additional_cost: number
          branch_id: string
          created_at: string
          created_by_user_id: string | null
          deleted_at: string | null
          id: string
          organization_id: string
          payment_status_id: string
          purchase_date: string
          purchase_number: string
          supplier_id: string
          updated_at: string
        }
        Insert: {
          additional_cost?: number
          branch_id: string
          created_at?: string
          created_by_user_id?: string | null
          deleted_at?: string | null
          id?: string
          organization_id: string
          payment_status_id: string
          purchase_date?: string
          purchase_number: string
          supplier_id: string
          updated_at?: string
        }
        Update: {
          additional_cost?: number
          branch_id?: string
          created_at?: string
          created_by_user_id?: string | null
          deleted_at?: string | null
          id?: string
          organization_id?: string
          payment_status_id?: string
          purchase_date?: string
          purchase_number?: string
          supplier_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_payment_status_id_fkey"
            columns: ["payment_status_id"]
            isOneToOne: false
            referencedRelation: "payment_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_parts: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          inventory_stock_id: string
          organization_id: string
          quantity: number
          repair_ticket_id: string
          total_price: number
          unit_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_stock_id: string
          organization_id: string
          quantity: number
          repair_ticket_id: string
          total_price: number
          unit_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_stock_id?: string
          organization_id?: string
          quantity?: number
          repair_ticket_id?: string
          total_price?: number
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_parts_inventory_stock_id_fkey"
            columns: ["inventory_stock_id"]
            isOneToOne: false
            referencedRelation: "inventory_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_parts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_parts_repair_ticket_id_fkey"
            columns: ["repair_ticket_id"]
            isOneToOne: false
            referencedRelation: "repair_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_services: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          organization_id: string
          repair_ticket_id: string
          service_name: string
          service_price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          organization_id: string
          repair_ticket_id: string
          service_name: string
          service_price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          organization_id?: string
          repair_ticket_id?: string
          service_name?: string
          service_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_services_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_services_repair_ticket_id_fkey"
            columns: ["repair_ticket_id"]
            isOneToOne: false
            referencedRelation: "repair_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      repair_statuses: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      repair_tickets: {
        Row: {
          assigned_technician_id: string | null
          branch_id: string
          closed_at: string | null
          created_at: string
          created_by_user_id: string | null
          customer_id: string
          deleted_at: string | null
          device_model_id: string | null
          id: string
          issue_description: string | null
          organization_id: string
          status_id: string
          ticket_number: string
          updated_at: string
        }
        Insert: {
          assigned_technician_id?: string | null
          branch_id: string
          closed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          customer_id: string
          deleted_at?: string | null
          device_model_id?: string | null
          id?: string
          issue_description?: string | null
          organization_id: string
          status_id: string
          ticket_number: string
          updated_at?: string
        }
        Update: {
          assigned_technician_id?: string | null
          branch_id?: string
          closed_at?: string | null
          created_at?: string
          created_by_user_id?: string | null
          customer_id?: string
          deleted_at?: string | null
          device_model_id?: string | null
          id?: string
          issue_description?: string | null
          organization_id?: string
          status_id?: string
          ticket_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "repair_tickets_assigned_technician_id_fkey"
            columns: ["assigned_technician_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_tickets_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_tickets_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_tickets_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_tickets_device_model_id_fkey"
            columns: ["device_model_id"]
            isOneToOne: false
            referencedRelation: "device_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_tickets_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "repair_tickets_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "repair_statuses"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_statuses: {
        Row: {
          created_at: string
          deleted_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      stock_adjustments: {
        Row: {
          adjustment_date: string
          adjustment_quantity: number
          adjustment_type: Database["public"]["Enums"]["stock_adjustment_type"]
          branch_id: string
          created_at: string
          deleted_at: string | null
          id: string
          inventory_stock_id: string
          organization_id: string
          performed_by_user_id: string | null
          reason: string | null
          remarks: string | null
          updated_at: string
        }
        Insert: {
          adjustment_date?: string
          adjustment_quantity: number
          adjustment_type: Database["public"]["Enums"]["stock_adjustment_type"]
          branch_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_stock_id: string
          organization_id: string
          performed_by_user_id?: string | null
          reason?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Update: {
          adjustment_date?: string
          adjustment_quantity?: number
          adjustment_type?: Database["public"]["Enums"]["stock_adjustment_type"]
          branch_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          inventory_stock_id?: string
          organization_id?: string
          performed_by_user_id?: string | null
          reason?: string | null
          remarks?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stock_adjustments_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_inventory_stock_id_fkey"
            columns: ["inventory_stock_id"]
            isOneToOne: false
            referencedRelation: "inventory_stock"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_adjustments_performed_by_user_id_fkey"
            columns: ["performed_by_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          id: string
          organization_id: string
          phone_number: string | null
          remarks: string | null
          supplier_name: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          organization_id: string
          phone_number?: string | null
          remarks?: string | null
          supplier_name: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          id?: string
          organization_id?: string
          phone_number?: string | null
          remarks?: string | null
          supplier_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suppliers_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_write_transactions: { Args: never; Returns: boolean }
      current_app_user: {
        Args: never
        Returns: {
          auth_user_id: string
          branch_id: string | null
          created_at: string
          deleted_at: string | null
          email: string
          full_name: string
          id: string
          organization_id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "app_users"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      current_app_user_id: { Args: never; Returns: string }
      current_branch_id: { Args: never; Returns: string }
      current_organization_id: { Args: never; Returns: string }
      in_own_branch: { Args: { p_branch_id: string }; Returns: boolean }
      is_admin_or_owner: { Args: never; Returns: boolean }
      is_admin_or_owner_for: { Args: { p_org_id: string }; Returns: boolean }
      is_owner: { Args: never; Returns: boolean }
      onboard_organization: {
        Args: {
          p_address?: string
          p_auth_user_id: string
          p_branch_name: string
          p_business_name: string
          p_currency: string
          p_email: string
          p_full_name: string
          p_phone_number?: string
        }
        Returns: {
          app_user_id: string
          branch_id: string
          organization_id: string
        }[]
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "technician" | "front_desk" | "staff"
      inventory_movement_type:
        | "purchase_in"
        | "sale_out"
        | "repair_consumption"
        | "adjustment_increase"
        | "adjustment_decrease"
        | "reservation_hold"
        | "reservation_release"
        | "transfer_in"
        | "transfer_out"
      stock_adjustment_type:
        | "increase"
        | "decrease"
        | "correction"
        | "damage"
        | "loss"
        | "return_to_supplier"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      app_role: ["owner", "admin", "technician", "front_desk", "staff"],
      inventory_movement_type: [
        "purchase_in",
        "sale_out",
        "repair_consumption",
        "adjustment_increase",
        "adjustment_decrease",
        "reservation_hold",
        "reservation_release",
        "transfer_in",
        "transfer_out",
      ],
      stock_adjustment_type: [
        "increase",
        "decrease",
        "correction",
        "damage",
        "loss",
        "return_to_supplier",
      ],
    },
  },
} as const
