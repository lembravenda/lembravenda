export type PaymentStatus = "pending" | "paid" | "canceled";

export type DeliveryStatus =
  | "to_prepare"
  | "prepared"
  | "delivered"
  | "canceled";

export type FollowUpType = "payment" | "repurchase" | "delivery" | "custom";

export type FollowUpStatus = "pending" | "done" | "dismissed";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  brand_name: string | null;
  phone: string | null;
  pix_key: string | null;
  primary_category: string;
  created_at: string;
  updated_at: string;
};

export type Customer = {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  birthday: string | null;
  tags: string[];
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  user_id: string;
  name: string;
  price_cents: number;
  category: string | null;
  repurchase_interval_days: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  customer_id: string;
  payment_status: PaymentStatus;
  delivery_status: DeliveryStatus;
  total_cents: number;
  payment_due_date: string | null;
  delivery_due_date: string | null;
  paid_at: string | null;
  delivered_at: string | null;
  canceled_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: string;
  user_id: string;
  order_id: string;
  product_id: string | null;
  product_name_snapshot: string;
  unit_price_cents: number;
  quantity: number;
  line_total_cents: number;
  created_at: string;
  updated_at: string;
};

export type FollowUp = {
  id: string;
  user_id: string;
  customer_id: string;
  product_id: string | null;
  order_id: string | null;
  type: FollowUpType;
  status: FollowUpStatus;
  due_date: string;
  message_snapshot: string | null;
  done_at: string | null;
  dismissed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<
          Profile,
          "id" | "user_id" | "created_at" | "updated_at"
        > & {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Profile, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      customers: {
        Row: Customer;
        Insert: Omit<
          Customer,
          "id" | "user_id" | "created_at" | "updated_at"
        > & {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Customer, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      products: {
        Row: Product;
        Insert: Omit<
          Product,
          "id" | "user_id" | "created_at" | "updated_at"
        > & {
          id?: string;
          user_id?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Product, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, "id" | "user_id" | "created_at" | "updated_at"> & {
          id?: string;
          user_id?: string;
          payment_status?: PaymentStatus;
          delivery_status?: DeliveryStatus;
          total_cents?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<Order, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      order_items: {
        Row: OrderItem;
        Insert: Omit<
          OrderItem,
          "id" | "user_id" | "created_at" | "updated_at"
        > & {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<OrderItem, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
      follow_ups: {
        Row: FollowUp;
        Insert: Omit<
          FollowUp,
          "id" | "user_id" | "created_at" | "updated_at"
        > & {
          id?: string;
          user_id?: string;
          status?: FollowUpStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Omit<FollowUp, "id" | "user_id" | "created_at" | "updated_at">
        >;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
