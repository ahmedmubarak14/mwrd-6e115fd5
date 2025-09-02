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
      automated_tasks: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          priority: string
          reference_id: string | null
          reference_type: string | null
          status: string
          title: string
          updated_at: string
          workflow_execution_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          title: string
          updated_at?: string
          workflow_execution_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: string
          reference_id?: string | null
          reference_type?: string | null
          status?: string
          title?: string
          updated_at?: string
          workflow_execution_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automated_tasks_workflow_execution_id_fkey"
            columns: ["workflow_execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_executions"
            referencedColumns: ["id"]
          },
        ]
      }
      bid_attachments: {
        Row: {
          bid_id: string
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          storage_path: string
        }
        Insert: {
          bid_id: string
          created_at?: string
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          storage_path: string
        }
        Update: {
          bid_id?: string
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "bid_attachments_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
        ]
      }
      bids: {
        Row: {
          created_at: string
          currency: string
          delivery_timeline_days: number
          expires_at: string | null
          id: string
          payment_terms: string | null
          proposal: string
          rfq_id: string
          status: string
          submitted_at: string | null
          technical_specifications: Json | null
          total_price: number
          updated_at: string
          vendor_id: string
          warranty_period_months: number | null
        }
        Insert: {
          created_at?: string
          currency?: string
          delivery_timeline_days: number
          expires_at?: string | null
          id?: string
          payment_terms?: string | null
          proposal: string
          rfq_id: string
          status?: string
          submitted_at?: string | null
          technical_specifications?: Json | null
          total_price: number
          updated_at?: string
          vendor_id: string
          warranty_period_months?: number | null
        }
        Update: {
          created_at?: string
          currency?: string
          delivery_timeline_days?: number
          expires_at?: string | null
          id?: string
          payment_terms?: string | null
          proposal?: string
          rfq_id?: string
          status?: string
          submitted_at?: string | null
          technical_specifications?: Json | null
          total_price?: number
          updated_at?: string
          vendor_id?: string
          warranty_period_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bids_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
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
      communication_metrics: {
        Row: {
          campaign_id: string | null
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string
        }
        Insert: {
          campaign_id?: string | null
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          metric_value?: number
          recorded_at?: string
        }
        Update: {
          campaign_id?: string | null
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string
        }
        Relationships: []
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
      device_registrations: {
        Row: {
          device_info: Json | null
          device_token: string
          id: string
          is_active: boolean
          last_used_at: string | null
          platform: string
          registered_at: string
          user_id: string
        }
        Insert: {
          device_info?: Json | null
          device_token: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          platform: string
          registered_at?: string
          user_id: string
        }
        Update: {
          device_info?: Json | null
          device_token?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          platform?: string
          registered_at?: string
          user_id?: string
        }
        Relationships: []
      }
      email_campaigns: {
        Row: {
          clicked_count: number | null
          created_at: string
          created_by: string
          id: string
          name: string
          opened_count: number | null
          recipients_count: number | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          subject: string
          target_audience: string
          template_id: string | null
          updated_at: string
        }
        Insert: {
          clicked_count?: number | null
          created_at?: string
          created_by: string
          id?: string
          name: string
          opened_count?: number | null
          recipients_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject: string
          target_audience?: string
          template_id?: string | null
          updated_at?: string
        }
        Update: {
          clicked_count?: number | null
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          opened_count?: number | null
          recipients_count?: number | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          subject?: string
          target_audience?: string
          template_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string
          html_content: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          created_by: string
          html_content: string
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string
          html_content?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
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
          user_id: string
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
          user_id: string
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
          user_id?: string
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
      platform_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_type: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_type: string
          setting_value?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_type?: string
          setting_value?: Json
          updated_at?: string
        }
        Relationships: []
      }
      procurement_categories: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          icon: string | null
          id: string
          is_active: boolean
          name: string
          name_ar: string | null
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name: string
          name_ar?: string | null
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          name?: string
          name_ar?: string | null
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "procurement_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "procurement_categories"
            referencedColumns: ["id"]
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
      push_notifications: {
        Row: {
          created_at: string
          created_by: string
          delivery_stats: Json | null
          id: string
          message: string
          metadata: Json | null
          scheduled_for: string | null
          sent_at: string | null
          status: string
          target_audience: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          delivery_stats?: Json | null
          id?: string
          message: string
          metadata?: Json | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          target_audience?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          delivery_stats?: Json | null
          id?: string
          message?: string
          metadata?: Json | null
          scheduled_for?: string | null
          sent_at?: string | null
          status?: string
          target_audience?: string
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
      rfq_attachments: {
        Row: {
          created_at: string
          description: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          rfq_id: string
          storage_path: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          rfq_id: string
          storage_path: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          rfq_id?: string
          storage_path?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfq_attachments_rfq_id_fkey"
            columns: ["rfq_id"]
            isOneToOne: false
            referencedRelation: "rfqs"
            referencedColumns: ["id"]
          },
        ]
      }
      rfqs: {
        Row: {
          budget_max: number | null
          budget_min: number | null
          category_id: string | null
          client_id: string
          created_at: string
          currency: string
          delivery_location: string | null
          delivery_location_coordinates: unknown | null
          description: string
          evaluation_criteria: Json
          id: string
          invited_vendors: string[] | null
          is_public: boolean
          priority: Database["public"]["Enums"]["rfq_priority"]
          project_end_date: string | null
          project_start_date: string | null
          requirements: Json
          status: Database["public"]["Enums"]["rfq_status"]
          subcategory_id: string | null
          submission_deadline: string
          terms_and_conditions: string | null
          title: string
          updated_at: string
        }
        Insert: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          client_id: string
          created_at?: string
          currency?: string
          delivery_location?: string | null
          delivery_location_coordinates?: unknown | null
          description: string
          evaluation_criteria?: Json
          id?: string
          invited_vendors?: string[] | null
          is_public?: boolean
          priority?: Database["public"]["Enums"]["rfq_priority"]
          project_end_date?: string | null
          project_start_date?: string | null
          requirements?: Json
          status?: Database["public"]["Enums"]["rfq_status"]
          subcategory_id?: string | null
          submission_deadline: string
          terms_and_conditions?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          budget_max?: number | null
          budget_min?: number | null
          category_id?: string | null
          client_id?: string
          created_at?: string
          currency?: string
          delivery_location?: string | null
          delivery_location_coordinates?: unknown | null
          description?: string
          evaluation_criteria?: Json
          id?: string
          invited_vendors?: string[] | null
          is_public?: boolean
          priority?: Database["public"]["Enums"]["rfq_priority"]
          project_end_date?: string | null
          project_start_date?: string | null
          requirements?: Json
          status?: Database["public"]["Enums"]["rfq_status"]
          subcategory_id?: string | null
          submission_deadline?: string
          terms_and_conditions?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rfqs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "procurement_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rfqs_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "procurement_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      security_incidents: {
        Row: {
          affected_systems: string | null
          assigned_to: string | null
          category: string
          created_at: string
          description: string
          id: string
          reported_by: string | null
          resolved_at: string | null
          severity: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          affected_systems?: string | null
          assigned_to?: string | null
          category?: string
          created_at?: string
          description: string
          id?: string
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          affected_systems?: string | null
          assigned_to?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          reported_by?: string | null
          resolved_at?: string | null
          severity?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      security_metrics: {
        Row: {
          created_at: string
          id: string
          metric_type: string
          metric_value: Json
          recorded_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_type: string
          metric_value?: Json
          recorded_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_type?: string
          metric_value?: Json
          recorded_at?: string
        }
        Relationships: []
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
      system_health_metrics: {
        Row: {
          created_at: string
          id: string
          metadata: Json | null
          metric_name: string
          metric_value: number
          recorded_at: string
          status: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_value: number
          recorded_at?: string
          status?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_value?: number
          recorded_at?: string
          status?: string | null
          unit?: string | null
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
        ]
      }
      vendor_performance_metrics: {
        Row: {
          category: string | null
          completion_rate: number | null
          created_at: string
          id: string
          last_updated: string
          quality_score: number | null
          response_time_avg_hours: number | null
          total_completed_orders: number | null
          total_earnings: number | null
          vendor_id: string
        }
        Insert: {
          category?: string | null
          completion_rate?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          quality_score?: number | null
          response_time_avg_hours?: number | null
          total_completed_orders?: number | null
          total_earnings?: number | null
          vendor_id: string
        }
        Update: {
          category?: string | null
          completion_rate?: number | null
          created_at?: string
          id?: string
          last_updated?: string
          quality_score?: number | null
          response_time_avg_hours?: number | null
          total_completed_orders?: number | null
          total_earnings?: number | null
          vendor_id?: string
        }
        Relationships: []
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
        ]
      }
      vendor_public_info: {
        Row: {
          avatar_url: string | null
          bio: string | null
          categories: string[] | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          portfolio_url: string | null
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          categories?: string[] | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          portfolio_url?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          categories?: string[] | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          portfolio_url?: string | null
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_public_info_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
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
      workflow_executions: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          executed_actions: Json
          execution_time_ms: number | null
          id: string
          status: string
          trigger_data: Json
          workflow_rule_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          executed_actions?: Json
          execution_time_ms?: number | null
          id?: string
          status?: string
          trigger_data?: Json
          workflow_rule_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          executed_actions?: Json
          execution_time_ms?: number | null
          id?: string
          status?: string
          trigger_data?: Json
          workflow_rule_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_executions_workflow_rule_id_fkey"
            columns: ["workflow_rule_id"]
            isOneToOne: false
            referencedRelation: "workflow_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_rules: {
        Row: {
          actions: Json
          created_at: string
          created_by: string | null
          delay_minutes: number | null
          description: string | null
          execution_count: number | null
          id: string
          last_executed_at: string | null
          name: string
          priority: number
          status: Database["public"]["Enums"]["workflow_status"]
          trigger_conditions: Json
          trigger_type: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at: string
        }
        Insert: {
          actions?: Json
          created_at?: string
          created_by?: string | null
          delay_minutes?: number | null
          description?: string | null
          execution_count?: number | null
          id?: string
          last_executed_at?: string | null
          name: string
          priority?: number
          status?: Database["public"]["Enums"]["workflow_status"]
          trigger_conditions?: Json
          trigger_type: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at?: string
        }
        Update: {
          actions?: Json
          created_at?: string
          created_by?: string | null
          delay_minutes?: number | null
          description?: string | null
          execution_count?: number | null
          id?: string
          last_executed_at?: string | null
          name?: string
          priority?: number
          status?: Database["public"]["Enums"]["workflow_status"]
          trigger_conditions?: Json
          trigger_type?: Database["public"]["Enums"]["workflow_trigger_type"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_consultation_rate_limit: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      check_support_ticket_rate_limit: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      execute_workflow_rules: {
        Args: {
          trigger_data_param?: Json
          trigger_type_param: Database["public"]["Enums"]["workflow_trigger_type"]
        }
        Returns: undefined
      }
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
      get_current_user_profile: {
        Args: Record<PropertyKey, never>
        Returns: {
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
        }[]
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
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
      log_document_access_attempt: {
        Args: {
          error_message?: string
          file_path: string
          success: boolean
          user_role: string
        }
        Returns: undefined
      }
      log_security_event: {
        Args: {
          event_details?: Json
          event_type: string
          target_user_id?: string
        }
        Returns: undefined
      }
      update_vendor_performance_metrics: {
        Args: { p_category?: string; p_vendor_id: string }
        Returns: undefined
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
      rfq_priority: "low" | "medium" | "high" | "urgent"
      rfq_status:
        | "draft"
        | "published"
        | "in_progress"
        | "evaluation"
        | "awarded"
        | "cancelled"
        | "completed"
      user_role: "admin" | "client" | "vendor"
      user_status: "pending" | "approved" | "blocked" | "rejected"
      workflow_action_type:
        | "send_notification"
        | "auto_assign"
        | "escalate_approval"
        | "update_status"
        | "create_task"
        | "send_email"
        | "auto_approve"
        | "auto_reject"
      workflow_status: "active" | "inactive" | "draft"
      workflow_trigger_type:
        | "request_created"
        | "offer_submitted"
        | "approval_pending"
        | "deadline_approaching"
        | "status_changed"
        | "time_elapsed"
        | "performance_threshold"
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
      rfq_priority: ["low", "medium", "high", "urgent"],
      rfq_status: [
        "draft",
        "published",
        "in_progress",
        "evaluation",
        "awarded",
        "cancelled",
        "completed",
      ],
      user_role: ["admin", "client", "vendor"],
      user_status: ["pending", "approved", "blocked", "rejected"],
      workflow_action_type: [
        "send_notification",
        "auto_assign",
        "escalate_approval",
        "update_status",
        "create_task",
        "send_email",
        "auto_approve",
        "auto_reject",
      ],
      workflow_status: ["active", "inactive", "draft"],
      workflow_trigger_type: [
        "request_created",
        "offer_submitted",
        "approval_pending",
        "deadline_approaching",
        "status_changed",
        "time_elapsed",
        "performance_threshold",
      ],
    },
  },
} as const
