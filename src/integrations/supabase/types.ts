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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      activity_feed: {
        Row: {
          activity_type: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_type: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_type?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string
          entity_type: string
          id: string
          new_values: Json | null
          old_values: Json | null
          reason: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id: string
          entity_type: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string
          entity_type?: string
          id?: string
          new_values?: Json | null
          old_values?: Json | null
          reason?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      conversations: {
        Row: {
          client_id: string
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          offer_id: string | null
          request_id: string | null
          status: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          offer_id?: string | null
          request_id?: string | null
          status?: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          offer_id?: string | null
          request_id?: string | null
          status?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_consultations: {
        Row: {
          company: string | null
          created_at: string
          email: string
          event_description: string | null
          event_type: string
          full_name: string
          id: string
          message: string | null
          notes: string | null
          phone: string | null
          scheduled_date: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          event_description?: string | null
          event_type: string
          full_name: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          event_description?: string | null
          event_type?: string
          full_name?: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_consultations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          order_id: string | null
          payment_method: string | null
          status: string
          transaction_ref: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          payment_method?: string | null
          status?: string
          transaction_ref?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          order_id?: string | null
          payment_method?: string | null
          status?: string
          transaction_ref?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment_url: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          attachment_url?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          attachment_url?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          category: string | null
          created_at: string
          data: Json | null
          id: string
          message: string
          priority: string | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          priority?: string | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          priority?: string | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      offers: {
        Row: {
          admin_approval_status: string | null
          client_approval_status: string | null
          created_at: string
          delivery_time: number | null
          description: string
          id: string
          price: number
          request_id: string
          status: string | null
          title: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          admin_approval_status?: string | null
          client_approval_status?: string | null
          created_at?: string
          delivery_time?: number | null
          description: string
          id?: string
          price: number
          request_id: string
          status?: string | null
          title: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          admin_approval_status?: string | null
          client_approval_status?: string | null
          created_at?: string
          delivery_time?: number | null
          description?: string
          id?: string
          price?: number
          request_id?: string
          status?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      orders: {
        Row: {
          amount: number
          client_id: string
          completion_date: string | null
          created_at: string
          delivery_date: string | null
          description: string | null
          id: string
          notes: string | null
          request_id: string
          status: Database["public"]["Enums"]["order_status"]
          title: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          amount: number
          client_id: string
          completion_date?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          request_id: string
          status?: Database["public"]["Enums"]["order_status"]
          title: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          amount?: number
          client_id?: string
          completion_date?: string | null
          created_at?: string
          delivery_date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          request_id?: string
          status?: Database["public"]["Enums"]["order_status"]
          title?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      requests: {
        Row: {
          admin_approval_status: string | null
          budget_max: number | null
          budget_min: number | null
          category: string
          client_id: string
          created_at: string
          currency: string | null
          deadline: string | null
          description: string
          id: string
          location: string | null
          requirements: Json | null
          status: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at: string
          urgency: string | null
          vendor_id: string | null
        }
        Insert: {
          admin_approval_status?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category: string
          client_id: string
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description: string
          id?: string
          location?: string | null
          requirements?: Json | null
          status?: Database["public"]["Enums"]["request_status"]
          title: string
          updated_at?: string
          urgency?: string | null
          vendor_id?: string | null
        }
        Update: {
          admin_approval_status?: string | null
          budget_max?: number | null
          budget_min?: number | null
          category?: string
          client_id?: string
          created_at?: string
          currency?: string | null
          deadline?: string | null
          description?: string
          id?: string
          location?: string | null
          requirements?: Json | null
          status?: Database["public"]["Enums"]["request_status"]
          title?: string
          updated_at?: string
          urgency?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          bio: string | null
          categories: string[] | null
          company_name: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          portfolio_url: string | null
          role: Database["public"]["Enums"]["user_role"]
          status: Database["public"]["Enums"]["user_status"]
          subscription_expires_at: string | null
          subscription_plan: string | null
          subscription_status: string | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          categories?: string[] | null
          company_name?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          bio?: string | null
          categories?: string[] | null
          company_name?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          portfolio_url?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          status?: Database["public"]["Enums"]["user_status"]
          subscription_expires_at?: string | null
          subscription_plan?: string | null
          subscription_status?: string | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_analytics_data: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_users: number
          success_rate: number
          total_offers: number
          total_orders: number
          total_requests: number
          total_revenue: number
          total_users: number
        }[]
      }
      get_platform_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_admins: number
          total_clients: number
          total_offers: number
          total_orders: number
          total_requests: number
          total_users: number
          total_vendors: number
        }[]
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      get_user_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_admins: number
          total_clients: number
          total_users: number
          total_vendors: number
        }[]
      }
    }
    Enums: {
      order_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      request_status:
        | "new"
        | "in_progress"
        | "completed"
        | "disputed"
        | "cancelled"
      user_role: "admin" | "client" | "vendor"
      user_status: "pending" | "approved" | "blocked" | "rejected"
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
  public: {
    Enums: {
      order_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      request_status: [
        "new",
        "in_progress",
        "completed",
        "disputed",
        "cancelled",
      ],
      user_role: ["admin", "client", "vendor"],
      user_status: ["pending", "approved", "blocked", "rejected"],
    },
  },
} as const
