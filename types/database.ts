export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_number: string;
          payment_method: string;
          subtotal: number;
          total: number;
          estimated_cost: number;
          sync_state: string;
          created_at: string;
        };
        Insert: {
          id: string;
          order_number: string;
          payment_method: string;
          subtotal: number;
          total: number;
          estimated_cost: number;
          sync_state: string;
          created_at: string;
        };
        Update: Partial<{
          id: string;
          order_number: string;
          payment_method: string;
          subtotal: number;
          total: number;
          estimated_cost: number;
          sync_state: string;
          created_at: string;
        }>;
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_size_id: string;
          product_type_id: string;
          flavor_id: string;
          quantity: number;
          unit_price: number;
          unit_cost: number;
          line_total: number;
        };
        Insert: {
          id: string;
          order_id: string;
          product_size_id: string;
          product_type_id: string;
          flavor_id: string;
          quantity: number;
          unit_price: number;
          unit_cost: number;
          line_total: number;
        };
        Update: Partial<{
          id: string;
          order_id: string;
          product_size_id: string;
          product_type_id: string;
          flavor_id: string;
          quantity: number;
          unit_price: number;
          unit_cost: number;
          line_total: number;
        }>;
        Relationships: [];
      };
      order_item_extras: {
        Row: {
          order_item_id: string;
          extra_id: string;
        };
        Insert: {
          order_item_id: string;
          extra_id: string;
        };
        Update: Partial<{
          order_item_id: string;
          extra_id: string;
        }>;
        Relationships: [];
      };
      users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          full_name: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          full_name: string;
          email: string;
          role: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<{
          id: string;
          auth_user_id: string | null;
          full_name: string;
          email: string;
          role: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        }>;
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<{
          id: string;
          name: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        }>;
        Relationships: [];
      };
      product_sizes: {
        Row: {
          id: string;
          code: string;
          label: string;
          ounces: number;
          base_price: number;
          base_cost: number;
          inventory_item_id: string | null;
          usage_quantity: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          label: string;
          ounces: number;
          base_price: number;
          base_cost: number;
          inventory_item_id?: string | null;
          usage_quantity?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<{
          id: string;
          code: string;
          label: string;
          ounces: number;
          base_price: number;
          base_cost: number;
          inventory_item_id: string | null;
          usage_quantity: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        }>;
        Relationships: [];
      };
      product_types: {
        Row: {
          id: string;
          code: string;
          label: string;
          price_modifier: number;
          cost_modifier: number;
          inventory_item_id: string | null;
          usage_quantity: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          code: string;
          label: string;
          price_modifier?: number;
          cost_modifier?: number;
          inventory_item_id?: string | null;
          usage_quantity?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<{
          id: string;
          code: string;
          label: string;
          price_modifier: number;
          cost_modifier: number;
          inventory_item_id: string | null;
          usage_quantity: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        }>;
        Relationships: [];
      };
      extras: {
        Row: {
          id: string;
          name: string;
          price: number;
          cost: number;
          inventory_item_id: string | null;
          usage_quantity: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          cost?: number;
          inventory_item_id?: string | null;
          usage_quantity?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<{
          id: string;
          name: string;
          price: number;
          cost: number;
          inventory_item_id: string | null;
          usage_quantity: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        }>;
        Relationships: [];
      };
      inventory_movements: {
        Row: {
          id: string;
          inventory_item_id: string;
          movement_type: string;
          quantity: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          inventory_item_id: string;
          movement_type: string;
          quantity: number;
          note?: string | null;
          created_at: string;
        };
        Update: Partial<{
          id: string;
          inventory_item_id: string;
          movement_type: string;
          quantity: number;
          note: string | null;
          created_at: string;
        }>;
        Relationships: [];
      };
      purchases: {
        Row: {
          id: string;
          inventory_item_id: string;
          vendor: string;
          quantity: number;
          total: number;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          inventory_item_id: string;
          vendor: string;
          quantity: number;
          total: number;
          note?: string | null;
          created_at: string;
        };
        Update: Partial<{
          id: string;
          inventory_item_id: string;
          vendor: string;
          quantity: number;
          total: number;
          note: string | null;
          created_at: string;
        }>;
        Relationships: [];
      };
      cash_sessions: {
        Row: {
          id: string;
          opening_cash: number;
          closing_cash: number | null;
          expected_cash: number | null;
          difference: number | null;
          status: string;
          opened_at: string;
          closed_at: string | null;
        };
        Insert: {
          id: string;
          opening_cash: number;
          closing_cash?: number | null;
          expected_cash?: number | null;
          difference?: number | null;
          status: string;
          opened_at: string;
          closed_at?: string | null;
        };
        Update: Partial<{
          id: string;
          opening_cash: number;
          closing_cash: number | null;
          expected_cash: number | null;
          difference: number | null;
          status: string;
          opened_at: string;
          closed_at: string | null;
        }>;
        Relationships: [];
      };
      expenses: {
        Row: {
          id: string;
          concept: string;
          amount: number;
          category: string;
          created_at: string;
        };
        Insert: {
          id: string;
          concept: string;
          amount: number;
          category: string;
          created_at: string;
        };
        Update: Partial<{
          id: string;
          concept: string;
          amount: number;
          category: string;
          created_at: string;
        }>;
        Relationships: [];
      };
      loan_payments: {
        Row: {
          id: string;
          lender: string;
          amount: number;
          balance_after_payment: number;
          created_at: string;
        };
        Insert: {
          id: string;
          lender: string;
          amount: number;
          balance_after_payment: number;
          created_at: string;
        };
        Update: Partial<{
          id: string;
          lender: string;
          amount: number;
          balance_after_payment: number;
          created_at: string;
        }>;
        Relationships: [];
      };
      active_flavors: {
        Row: {
          id: string;
          flavor_id: string;
          business_date: string;
          tank_number: number;
        };
        Insert: {
          id?: string;
          flavor_id: string;
          business_date: string;
          tank_number: number;
        };
        Update: Partial<{
          id: string;
          flavor_id: string;
          business_date: string;
          tank_number: number;
        }>;
        Relationships: [];
      };
      flavors: {
        Row: {
          id: string;
          name: string;
          color: string;
          is_active: boolean;
          inventory_item_id: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          is_active: boolean;
          inventory_item_id?: string | null;
        };
        Update: Partial<{
          id: string;
          name: string;
          color: string;
          is_active: boolean;
          inventory_item_id: string | null;
        }>;
        Relationships: [];
      };
      inventory_consumption_rules: {
        Row: {
          id: string;
          product_type_id: string | null;
          product_size_id: string | null;
          extra_id: string | null;
          consumes_selected_flavor: boolean;
          inventory_item_id: string | null;
          quantity: number;
          note: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          product_type_id?: string | null;
          product_size_id?: string | null;
          extra_id?: string | null;
          consumes_selected_flavor?: boolean;
          inventory_item_id?: string | null;
          quantity: number;
          note?: string | null;
          is_active?: boolean;
        };
        Update: Partial<{
          id: string;
          product_type_id: string | null;
          product_size_id: string | null;
          extra_id: string | null;
          consumes_selected_flavor: boolean;
          inventory_item_id: string | null;
          quantity: number;
          note: string | null;
          is_active: boolean;
        }>;
        Relationships: [];
      };
      inventory_items: {
        Row: {
          id: string;
          name: string;
          unit: string;
          category: string;
          current_stock: number;
          reorder_point: number;
          unit_cost: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          unit: string;
          category: string;
          current_stock?: number;
          reorder_point?: number;
          unit_cost?: number;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: Partial<{
          id: string;
          name: string;
          unit: string;
          category: string;
          current_stock: number;
          reorder_point: number;
          unit_cost: number;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
