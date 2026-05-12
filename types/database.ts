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
      inventory_items: {
        Row: {
          id: string;
          current_stock: number;
        };
        Insert: {
          id: string;
          current_stock: number;
        };
        Update: Partial<{
          id: string;
          current_stock: number;
        }>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
