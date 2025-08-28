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
      admin_settings: {
        Row: {
          admin_dashboard_theme: string
          audit_log_retention: number
          created_at: string
          email_notifications: boolean
          id: string
          security_alerts: boolean
          session_timeout: number
          two_factor_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_dashboard_theme?: string
          audit_log_retention?: number
          created_at?: string
          email_notifications?: boolean
          id?: string
          security_alerts?: boolean
          session_timeout?: number
          two_factor_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_dashboard_theme?: string
          audit_log_retention?: number
          created_at?: string
          email_notifications?: boolean
          id?: string
          security_alerts?: boolean
          session_timeout?: number
          two_factor_enabled?: boolean
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
      boq_items: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          item_code: string | null
          notes: string | null
          project_id: string
          quantity: number
          specifications: Json | null
          status: string | null
          total_price: number | null
          unit: string
          unit_price: number | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          id?: string
          item_code?: string | null
          notes?: string | null
          project_id: string
          quantity: number
          specifications?: Json | null
          status?: string | null
          total_price?: number | null
          unit: string
          unit_price?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          item_code?: string | null
          notes?: string | null
          project_id?: string
          quantity?: number
          specifications?: Json | null
          status?: string | null
          total_price?: number | null
          unit?: string
          unit_price?: number | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_boq_items_project"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      call_invitations: {
        Row: {
          call_id: string
          created_at: string
          expires_at: string
          id: string
          invitee_id: string
          inviter_id: string
          response_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          call_id: string
          created_at?: string
          expires_at?: string
          id?: string
          invitee_id: string
          inviter_id: string
          response_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          call_id?: string
          created_at?: string
          expires_at?: string
          id?: string
          invitee_id?: string
          inviter_id?: string
          response_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "call_invitations_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "video_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name_ar: string
          name_en: string
          parent_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar: string
          name_en: string
          parent_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name_ar?: string
          name_en?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      communication_settings: {
        Row: {
          created_at: string
          id: string
          settings_data: Json
          settings_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          settings_data?: Json
          settings_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          settings_data?: Json
          settings_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          client_id: string
          conversation_type: string | null
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          offer_id: string | null
          request_id: string | null
          status: string
          support_ticket_id: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          client_id: string
          conversation_type?: string | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          offer_id?: string | null
          request_id?: string | null
          status?: string
          support_ticket_id?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          client_id?: string
          conversation_type?: string | null
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          offer_id?: string | null
          request_id?: string | null
          status?: string
          support_ticket_id?: string | null
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
          {
            foreignKeyName: "conversations_support_ticket_id_fkey"
            columns: ["support_ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
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
          file_metadata: Json | null
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
          file_metadata?: Json | null
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
          file_metadata?: Json | null
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
          client_approval_date: string | null
          client_approval_notes: string | null
          client_approval_status: string | null
          created_at: string
          currency: string | null
          delivery_time: number | null
          delivery_time_days: number | null
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
          client_approval_date?: string | null
          client_approval_notes?: string | null
          client_approval_status?: string | null
          created_at?: string
          currency?: string | null
          delivery_time?: number | null
          delivery_time_days?: number | null
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
          client_approval_date?: string | null
          client_approval_notes?: string | null
          client_approval_status?: string | null
          created_at?: string
          currency?: string | null
          delivery_time?: number | null
          delivery_time_days?: number | null
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
          currency: string | null
          delivery_date: string | null
          description: string | null
          id: string
          notes: string | null
          offer_id: string | null
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
          currency?: string | null
          delivery_date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          offer_id?: string | null
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
          currency?: string | null
          delivery_date?: string | null
          description?: string | null
          id?: string
          notes?: string | null
          offer_id?: string | null
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
            foreignKeyName: "orders_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
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
      projects: {
        Row: {
          budget_total: number | null
          category: string | null
          client_id: string
          created_at: string
          currency: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          metadata: Json | null
          priority: string | null
          start_date: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_total?: number | null
          category?: string | null
          client_id: string
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          priority?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_total?: number | null
          category?: string | null
          client_id?: string
          created_at?: string
          currency?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          priority?: string | null
          start_date?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          attempt_count: number | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          user_id: string | null
          window_start: string | null
        }
        Insert: {
          action_type: string
          attempt_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
          window_start?: string | null
        }
        Update: {
          action_type?: string
          attempt_count?: number | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
          window_start?: string | null
        }
        Relationships: []
      }
      request_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          request_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          request_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "request_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_categories_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
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
          legacy_category: string | null
          location: string | null
          project_id: string | null
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
          legacy_category?: string | null
          location?: string | null
          project_id?: string | null
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
          legacy_category?: string | null
          location?: string | null
          project_id?: string | null
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
          {
            foreignKeyName: "requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_admin_id: string | null
          category: string
          created_at: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          assigned_admin_id?: string | null
          category?: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          assigned_admin_id?: string | null
          category?: string
          created_at?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_notification_settings: {
        Row: {
          created_at: string
          email_notifications: boolean
          id: string
          push_notifications: boolean
          sms_notifications: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          push_notifications?: boolean
          sms_notifications?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email_notifications?: boolean
          id?: string
          push_notifications?: boolean
          sms_notifications?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
          legacy_category: string | null
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
          verification_notes: string | null
          verification_status: string | null
          verified_at: string | null
          verified_by: string | null
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
          legacy_category?: string | null
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
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
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
          legacy_category?: string | null
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
          verification_notes?: string | null
          verification_status?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      vendor_categories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          vendor_id: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          vendor_id: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_categories_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_categories_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles_extended: {
        Row: {
          business_size: string | null
          certifications: string[] | null
          coverage_locations: string[] | null
          created_at: string
          employee_count: string | null
          equipment: string[] | null
          established_year: number | null
          experience_years: number | null
          id: string
          team_size: string | null
          updated_at: string
          vendor_id: string
        }
        Insert: {
          business_size?: string | null
          certifications?: string[] | null
          coverage_locations?: string[] | null
          created_at?: string
          employee_count?: string | null
          equipment?: string[] | null
          established_year?: number | null
          experience_years?: number | null
          id?: string
          team_size?: string | null
          updated_at?: string
          vendor_id: string
        }
        Update: {
          business_size?: string | null
          certifications?: string[] | null
          coverage_locations?: string[] | null
          created_at?: string
          employee_count?: string | null
          equipment?: string[] | null
          established_year?: number | null
          experience_years?: number | null
          id?: string
          team_size?: string | null
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_profiles_extended_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_profiles_extended_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendor_public_info"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_requests: {
        Row: {
          created_at: string
          document_type: string
          document_url: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_notes: string | null
          status: string
          submitted_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          document_type?: string
          document_url: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          document_type?: string
          document_url?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_notes?: string | null
          status?: string
          submitted_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_verification_requests_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      video_calls: {
        Row: {
          answered_at: string | null
          call_type: string
          callee_id: string
          caller_id: string
          conversation_id: string | null
          created_at: string
          duration: number | null
          ended_at: string | null
          id: string
          metadata: Json | null
          quality_score: number | null
          recording_url: string | null
          started_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          answered_at?: string | null
          call_type?: string
          callee_id: string
          caller_id: string
          conversation_id?: string | null
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          quality_score?: number | null
          recording_url?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          answered_at?: string | null
          call_type?: string
          callee_id?: string
          caller_id?: string
          conversation_id?: string | null
          created_at?: string
          duration?: number | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          quality_score?: number | null
          recording_url?: string | null
          started_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_calls_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vendor_public_info: {
        Row: {
          avatar_url: string | null
          bio: string | null
          categories: string[] | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          portfolio_url: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          categories?: string[] | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          portfolio_url?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          categories?: string[] | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          portfolio_url?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_admin_statistics: {
        Args: { admin_user_id: string }
        Returns: Json
      }
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
      get_growth_statistics: {
        Args: Record<PropertyKey, never>
        Returns: {
          active_subscriptions: number
          offers_growth: number
          requests_growth: number
          revenue_growth: number
          total_admins: number
          total_clients: number
          total_offers: number
          total_orders: number
          total_requests: number
          total_revenue: number
          total_transactions: number
          total_users: number
          total_vendors: number
          users_growth: number
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
