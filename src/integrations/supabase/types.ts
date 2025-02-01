export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_chat_messages: {
        Row: {
          agency_id: string | null
          components: Json | null
          created_at: string | null
          id: string
          is_bot: boolean | null
          message: string
          metadata: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          agency_id?: string | null
          components?: Json | null
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          message: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          agency_id?: string | null
          components?: Json | null
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          message?: string
          metadata?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_chat_messages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      agencies: {
        Row: {
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          name: string
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agencies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      amenities: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      asset_galleries: {
        Row: {
          asset_id: string
          asset_type: string
          created_at: string | null
          gallery_id: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          asset_id: string
          asset_type: string
          created_at?: string | null
          gallery_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          asset_id?: string
          asset_type?: string
          created_at?: string | null
          gallery_id?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_galleries_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "image_galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_engines: {
        Row: {
          agency_id: string | null
          chatbot_id: string | null
          checkin_config: Json | null
          configuration: Json | null
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          is_active: boolean | null
          landing_page_id: string | null
          name: string
          pricing_type: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          chatbot_id?: string | null
          checkin_config?: Json | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name: string
          pricing_type?: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          chatbot_id?: string | null
          checkin_config?: Json | null
          configuration?: Json | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name?: string
          pricing_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_engines_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_engines_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_engines_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_engines_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_items: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          item_id: string
          item_type: string
          metadata: Json | null
          price: number
          quantity: number | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          item_id: string
          item_type: string
          metadata?: Json | null
          price: number
          quantity?: number | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          item_id?: string
          item_type?: string
          metadata?: Json | null
          price?: number
          quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_items_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_tickets: {
        Row: {
          booking_details: Json | null
          booking_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          qr_code: string | null
          ticket_number: string | null
        }
        Insert: {
          booking_details?: Json | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          qr_code?: string | null
          ticket_number?: string | null
        }
        Update: {
          booking_details?: Json | null
          booking_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          qr_code?: string | null
          ticket_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          agency_id: string | null
          booking_date: string
          booking_type: string
          check_in: string | null
          check_out: string | null
          created_at: string | null
          guest_comments: string | null
          guest_requirements: string | null
          hotel_id: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          source: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          booking_date: string
          booking_type: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          guest_comments?: string | null
          guest_requirements?: string | null
          hotel_id?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          source?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          booking_date?: string
          booking_type?: string
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          guest_comments?: string | null
          guest_requirements?: string | null
          hotel_id?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          source?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          chatbot_id: string | null
          created_at: string | null
          id: string
          lead_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          chatbot_id?: string | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          chatbot_id: string | null
          conversation_id: string | null
          created_at: string | null
          id: string
          is_bot: boolean | null
          lead_id: string | null
          message: string
          metadata: Json | null
        }
        Insert: {
          chatbot_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          lead_id?: string | null
          message: string
          metadata?: Json | null
        }
        Update: {
          chatbot_id?: string | null
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_bot?: boolean | null
          lead_id?: string | null
          message?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_memories: {
        Row: {
          chatbot_id: string
          created_at: string | null
          expires_at: string | null
          id: string
          key: string
          lead_id: string | null
          metadata: Json | null
          relevance_score: number | null
          updated_at: string | null
          value: string
        }
        Insert: {
          chatbot_id: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key: string
          lead_id?: string | null
          metadata?: Json | null
          relevance_score?: number | null
          updated_at?: string | null
          value: string
        }
        Update: {
          chatbot_id?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key?: string
          lead_id?: string | null
          metadata?: Json | null
          relevance_score?: number | null
          updated_at?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_memories_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_metrics: {
        Row: {
          chatbot_id: string
          id: string
          message_length: number
          processing_time: number
          timestamp: string | null
        }
        Insert: {
          chatbot_id: string
          id?: string
          message_length: number
          processing_time: number
          timestamp?: string | null
        }
        Update: {
          chatbot_id?: string
          id?: string
          message_length?: number
          processing_time?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_metrics_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbots: {
        Row: {
          agency_id: string | null
          configuration: Json | null
          context: string | null
          context_structure: Json | null
          created_at: string | null
          description: string | null
          external_channels: Json | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          landing_page_id: string | null
          name: string
          personality: string | null
          quick_questions: Json | null
          updated_at: string | null
          use_emojis: boolean | null
          voice_enabled: boolean | null
          welcome_message: string | null
        }
        Insert: {
          agency_id?: string | null
          configuration?: Json | null
          context?: string | null
          context_structure?: Json | null
          created_at?: string | null
          description?: string | null
          external_channels?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name: string
          personality?: string | null
          quick_questions?: Json | null
          updated_at?: string | null
          use_emojis?: boolean | null
          voice_enabled?: boolean | null
          welcome_message?: string | null
        }
        Update: {
          agency_id?: string | null
          configuration?: Json | null
          context?: string | null
          context_structure?: Json | null
          created_at?: string | null
          description?: string | null
          external_channels?: Json | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          name?: string
          personality?: string | null
          quick_questions?: Json | null
          updated_at?: string | null
          use_emojis?: boolean | null
          voice_enabled?: boolean | null
          welcome_message?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chatbots_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chatbots_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          booking_id: string | null
          checkin_data: Json | null
          completed_at: string | null
          created_at: string | null
          id: string
          notification_sent_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          booking_id?: string | null
          checkin_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notification_sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_id?: string | null
          checkin_data?: Json | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notification_sent_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      destinations: {
        Row: {
          agency_id: string | null
          attractions: string[] | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          gallery: Json | null
          id: string
          landing_page_id: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          attractions?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          landing_page_id?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          attractions?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          landing_page_id?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "destinations_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destinations_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          created_at: string | null
          description: string | null
          gallery_id: string | null
          id: string
          keywords: string[] | null
          keywords_searchable: unknown | null
          name: string | null
          position: number | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          gallery_id?: string | null
          id?: string
          keywords?: string[] | null
          keywords_searchable?: unknown | null
          name?: string | null
          position?: number | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          gallery_id?: string | null
          id?: string
          keywords?: string[] | null
          keywords_searchable?: unknown | null
          name?: string | null
          position?: number | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "image_galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_amenities: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          hotel_id: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_amenities_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          agency_id: string | null
          amenities: string[] | null
          city: string | null
          country: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          gallery: Json | null
          id: string
          landing_page_id: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          agency_id?: string | null
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          landing_page_id?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          agency_id?: string | null
          amenities?: string[] | null
          city?: string | null
          country?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          landing_page_id?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotels_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hotels_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      image_galleries: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          keywords: string[] | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          keywords?: string[] | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      integration_configs: {
        Row: {
          agency_id: string | null
          chatbot_id: string | null
          config: Json | null
          created_at: string
          id: string
          integration_type: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          chatbot_id?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          integration_type: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          chatbot_id?: string | null
          config?: Json | null
          created_at?: string
          id?: string
          integration_type?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_configs_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "integration_configs_chatbot_id_fkey"
            columns: ["chatbot_id"]
            isOneToOne: false
            referencedRelation: "chatbots"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_footer_settings: {
        Row: {
          agency_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_footer_settings_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_interactions: {
        Row: {
          created_at: string | null
          id: string
          interaction_type: string
          landing_page_id: string | null
          lead_id: string | null
          metadata: Json | null
          section: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_type: string
          landing_page_id?: string | null
          lead_id?: string | null
          metadata?: Json | null
          section?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_type?: string
          landing_page_id?: string | null
          lead_id?: string | null
          metadata?: Json | null
          section?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_interactions_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "landing_interactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_pages: {
        Row: {
          agency_id: string | null
          components: Json | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          header_config: Json | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          meta_tags: Json | null
          page_type: string | null
          section_configs: Json | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          components?: Json | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          header_config?: Json | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_tags?: Json | null
          page_type?: string | null
          section_configs?: Json | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          components?: Json | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          header_config?: Json | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          meta_tags?: Json | null
          page_type?: string | null
          section_configs?: Json | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_pages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      landing_sections: {
        Row: {
          content: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          landing_page_id: string | null
          position: number | null
          style: Json | null
          subtitle: string | null
          title: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          position?: number | null
          style?: Json | null
          subtitle?: string | null
          title?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          landing_page_id?: string | null
          position?: number | null
          style?: Json | null
          subtitle?: string | null
          title?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "landing_sections_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_progress: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          stage_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          stage_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          stage_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_progress_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_progress_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "lead_stages"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_stages: {
        Row: {
          agency_id: string | null
          color: string
          created_at: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          position: number
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          color?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          position?: number
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          color?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          position?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_stages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_tracking: {
        Row: {
          created_at: string | null
          id: string
          interactions: Json | null
          landing_page_id: string | null
          lead_id: string | null
          page_views: Json | null
          session_end: string | null
          session_start: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interactions?: Json | null
          landing_page_id?: string | null
          lead_id?: string | null
          page_views?: Json | null
          session_end?: string | null
          session_start?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interactions?: Json | null
          landing_page_id?: string | null
          lead_id?: string | null
          page_views?: Json | null
          session_end?: string | null
          session_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_tracking_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_tracking_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          active: boolean | null
          agency_id: string | null
          created_at: string | null
          email: string | null
          has_completed_onboarding: boolean | null
          id: string
          last_greeting_at: string | null
          last_interaction: string | null
          name: string | null
          phone: string | null
          role: string | null
          score: number | null
          source: string | null
          status: string | null
          total_time_spent: unknown | null
          total_visits: number | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          agency_id?: string | null
          created_at?: string | null
          email?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          last_greeting_at?: string | null
          last_interaction?: string | null
          name?: string | null
          phone?: string | null
          role?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          total_time_spent?: unknown | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          agency_id?: string | null
          created_at?: string | null
          email?: string | null
          has_completed_onboarding?: boolean | null
          id?: string
          last_greeting_at?: string | null
          last_interaction?: string | null
          name?: string | null
          phone?: string | null
          role?: string | null
          score?: number | null
          source?: string | null
          status?: string | null
          total_time_spent?: unknown | null
          total_visits?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          address: string
          city: string | null
          country: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          latitude: number | null
          longitude: number | null
          postal_code: string | null
          state: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          city?: string | null
          country?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          postal_code?: string | null
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      packages: {
        Row: {
          agency_id: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          duration: unknown | null
          gallery: Json | null
          id: string
          included_services: Json | null
          landing_page_id: string | null
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          gallery?: Json | null
          id?: string
          included_services?: Json | null
          landing_page_id?: string | null
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          duration?: unknown | null
          gallery?: Json | null
          id?: string
          included_services?: Json | null
          landing_page_id?: string | null
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "packages_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quote_form_templates: {
        Row: {
          agency_id: string | null
          created_at: string | null
          description: string | null
          form_fields: Json | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          description?: string | null
          form_fields?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          description?: string | null
          form_fields?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_form_templates_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
      room_amenities: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          room_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          room_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          room_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_amenities_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_images: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_cover: boolean | null
          is_primary: boolean | null
          position: number | null
          room_id: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_cover?: boolean | null
          is_primary?: boolean | null
          position?: number | null
          room_id?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_cover?: boolean | null
          is_primary?: boolean | null
          position?: number | null
          room_id?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_images_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      room_type_amenities: {
        Row: {
          amenity_id: string | null
          created_at: string | null
          id: string
          room_type_id: string | null
          updated_at: string | null
        }
        Insert: {
          amenity_id?: string | null
          created_at?: string | null
          id?: string
          room_type_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amenity_id?: string | null
          created_at?: string | null
          id?: string
          room_type_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_type_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "room_type_amenities_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_type_images: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_cover: boolean | null
          position: number | null
          room_type_id: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_cover?: boolean | null
          position?: number | null
          room_type_id?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_cover?: boolean | null
          position?: number | null
          room_type_id?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "room_type_images_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      room_types: {
        Row: {
          additional_person_price: number | null
          base_price: number | null
          base_price_per_room: number | null
          bathrooms: number | null
          beds: number | null
          created_at: string | null
          description: string | null
          hotel_id: string | null
          id: string
          max_occupancy: number
          min_occupancy: number | null
          name: string
          price_per_adult: number | null
          price_per_child: number | null
          price_per_person: number | null
          pricing_type: string
          updated_at: string | null
        }
        Insert: {
          additional_person_price?: number | null
          base_price?: number | null
          base_price_per_room?: number | null
          bathrooms?: number | null
          beds?: number | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          max_occupancy: number
          min_occupancy?: number | null
          name: string
          price_per_adult?: number | null
          price_per_child?: number | null
          price_per_person?: number | null
          pricing_type?: string
          updated_at?: string | null
        }
        Update: {
          additional_person_price?: number | null
          base_price?: number | null
          base_price_per_room?: number | null
          bathrooms?: number | null
          beds?: number | null
          created_at?: string | null
          description?: string | null
          hotel_id?: string | null
          id?: string
          max_occupancy?: number
          min_occupancy?: number | null
          name?: string
          price_per_adult?: number | null
          price_per_child?: number | null
          price_per_person?: number | null
          pricing_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_types_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          cover_url: string | null
          created_at: string | null
          description: string | null
          floor: string | null
          gallery: Json | null
          id: string
          max_occupancy: number | null
          min_occupancy: number | null
          name: string | null
          price: number | null
          room_number: string
          room_type_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          floor?: string | null
          gallery?: Json | null
          id?: string
          max_occupancy?: number | null
          min_occupancy?: number | null
          name?: string | null
          price?: number | null
          room_number: string
          room_type_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          floor?: string | null
          gallery?: Json | null
          id?: string
          max_occupancy?: number | null
          min_occupancy?: number | null
          name?: string | null
          price?: number | null
          room_number?: string
          room_type_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rooms_room_type_id_fkey"
            columns: ["room_type_id"]
            isOneToOne: false
            referencedRelation: "room_types"
            referencedColumns: ["id"]
          },
        ]
      }
      theme_parks: {
        Row: {
          agency_id: string | null
          created_at: string | null
          description: string | null
          gallery: Json | null
          id: string
          landing_page_id: string | null
          location: string | null
          name: string
          operating_hours: Json | null
          updated_at: string | null
        }
        Insert: {
          agency_id?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          landing_page_id?: string | null
          location?: string | null
          name: string
          operating_hours?: Json | null
          updated_at?: string | null
        }
        Update: {
          agency_id?: string | null
          created_at?: string | null
          description?: string | null
          gallery?: Json | null
          id?: string
          landing_page_id?: string | null
          location?: string | null
          name?: string
          operating_hours?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "theme_parks_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "theme_parks_landing_page_id_fkey"
            columns: ["landing_page_id"]
            isOneToOne: false
            referencedRelation: "landing_pages"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          price: number
          theme_park_id: string | null
          updated_at: string | null
          validity_period: unknown | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          price: number
          theme_park_id?: string | null
          updated_at?: string | null
          validity_period?: unknown | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          price?: number
          theme_park_id?: string | null
          updated_at?: string | null
          validity_period?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_types_theme_park_id_fkey"
            columns: ["theme_park_id"]
            isOneToOne: false
            referencedRelation: "theme_parks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_amenities_to_room_type: {
        Args: {
          p_room_type_id: string
          p_amenity_ids: string[]
        }
        Returns: undefined
      }
      add_images_to_room_type: {
        Args: {
          p_room_type_id: string
          p_images: Json
        }
        Returns: undefined
      }
      calculate_lead_score: {
        Args: {
          p_lead_id: string
        }
        Returns: number
      }
      calculate_total_time_spent: {
        Args: {
          p_lead_id: string
        }
        Returns: unknown
      }
      cancel_booking: {
        Args: {
          p_booking_id: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_room_availability: {
        Args: {
          p_room_type_id: string
          p_check_in: string
          p_check_out: string
        }
        Returns: {
          available_rooms: number
          total_rooms: number
        }[]
      }
      check_ticket_availability: {
        Args: {
          p_ticket_type_id: string
          p_date: string
          p_quantity: number
        }
        Returns: boolean
      }
      cleanup_expired_memories: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_old_metrics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_booking:
        | {
            Args: {
              p_lead_id: string
              p_agency_id: string
              p_booking_type: string
              p_booking_date: string
              p_items: Json
              p_check_in?: string
              p_check_out?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_lead_id: string
              p_agency_id: string
              p_booking_type: string
              p_items: Json
              p_check_in?: string
              p_check_out?: string
            }
            Returns: string
          }
        | {
            Args: {
              p_user_id: string
              p_hotel_id: string
              p_room_type_id: string
              p_check_in: string
              p_check_out: string
              p_guests_count: number
              p_special_requests?: string
            }
            Returns: string
          }
      create_or_update_lead: {
        Args: {
          p_phone: string
          p_email: string
          p_name: string
          p_agency_id: string
          p_source: string
        }
        Returns: string
      }
      get_booking_details: {
        Args: {
          p_booking_id: string
        }
        Returns: {
          booking_id: string
          user_id: string
          hotel_id: string
          hotel_name: string
          room_type_name: string
          check_in: string
          check_out: string
          guests_count: number
          special_requests: string
          status: string
          created_at: string
          updated_at: string
        }[]
      }
      get_chatbot_stats: {
        Args: {
          p_chatbot_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          total_conversations: number
          total_messages: number
          avg_messages_per_conversation: number
          avg_response_time: unknown
        }[]
      }
      get_hotel_rooms_complete_info: {
        Args: {
          p_hotel_id: string
          p_check_in: string
          p_check_out: string
        }
        Returns: {
          hotel_name: string
          room_type_id: string
          room_type_name: string
          room_type_description: string
          max_occupancy: number
          base_price: number
          amenities: string[]
          available_rooms: number
          total_rooms: number
          gallery: Json
          cover_url: string
        }[]
      }
      get_landing_page_stats: {
        Args: {
          p_landing_page_id: string
          p_start_date: string
          p_end_date: string
        }
        Returns: {
          total_visits: number
          unique_visitors: number
          avg_time_spent: unknown
          bounce_rate: number
          conversion_rate: number
        }[]
      }
      get_room_availability: {
        Args: {
          p_room_type_id: string
          p_check_in: string
          p_check_out: string
        }
        Returns: {
          available_rooms: number
          total_rooms: number
        }[]
      }
      get_room_details: {
        Args: {
          p_room_id: string
        }
        Returns: {
          room_id: string
          room_number: string
          room_name: string
          room_description: string
          room_status: string
          room_type_id: string
          room_type_name: string
          base_price: number
          price_per_adult: number
          price_per_child: number
          max_occupancy: number
          min_occupancy: number
          images: Json
          amenities: Json
        }[]
      }
      get_room_type_amenities: {
        Args: {
          p_room_type_id: string
        }
        Returns: {
          id: string
          name: string
          icon: string
          description: string
          category: string
        }[]
      }
      get_room_types_info: {
        Args: {
          p_hotel_id: string
        }
        Returns: {
          hotel_name: string
          room_type_id: string
          room_type_name: string
          room_type_description: string
          max_occupancy: number
          base_price: number
          amenities: string[]
          gallery: Json
          cover_url: string
        }[]
      }
      get_user_bookings: {
        Args: {
          p_user_id: string
        }
        Returns: {
          booking_id: string
          hotel_name: string
          room_type_name: string
          check_in: string
          check_out: string
          guests_count: number
          status: string
          created_at: string
        }[]
      }
      migrate_room_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      search_image_galleries: {
        Args: {
          search_keywords: string
        }
        Returns: {
          id: number
          url: string
          name: string
          description: string
        }[]
      }
      search_memories: {
        Args: {
          search_query: string
          input_chatbot_id: string
          min_relevance?: number
          limit_param?: number
        }
        Returns: {
          id: string
          chatbot_id: string
          lead_id: string
          key: string
          value: string
          created_at: string
          relevance_score: number
          metadata: Json
        }[]
      }
    }
    Enums: {
      booking_source:
        | "web"
        | "whatsapp"
        | "telegram"
        | "booking"
        | "trivago"
        | "airbnb"
      user_role: "admin" | "agency" | "hotel"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
