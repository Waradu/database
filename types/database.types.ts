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
      data: {
        Row: {
          content: Json
          id: number
          row_id: number | null
        }
        Insert: {
          content?: Json
          id?: number
          row_id?: number | null
        }
        Update: {
          content?: Json
          id?: number
          row_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_data_row_id_fkey"
            columns: ["row_id"]
            isOneToOne: false
            referencedRelation: "rows"
            referencedColumns: ["id"]
          },
        ]
      }
      row_tag: {
        Row: {
          id: number
          row_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          row_id: number
          tag_id: number
        }
        Update: {
          id?: number
          row_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_row_tag_row_id_fkey"
            columns: ["row_id"]
            isOneToOne: false
            referencedRelation: "rows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_row_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      rows: {
        Row: {
          id: number
          name: string
          pos: number
          publish_date: string
          table_id: number
        }
        Insert: {
          id?: number
          name: string
          pos: number
          publish_date: string
          table_id: number
        }
        Update: {
          id?: number
          name?: string
          pos?: number
          publish_date?: string
          table_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_rows_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      table_tag: {
        Row: {
          id: number
          table_id: number
          tag_id: number
        }
        Insert: {
          id?: number
          table_id: number
          tag_id: number
        }
        Update: {
          id?: number
          table_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_table_tag_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_table_tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          icon: string
          id: number
          locked: boolean
          name: string
        }
        Insert: {
          icon: string
          id?: number
          locked?: boolean
          name: string
        }
        Update: {
          icon?: string
          id?: number
          locked?: boolean
          name?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          color: string
          id: number
          name: string
        }
        Insert: {
          color: string
          id?: number
          name: string
        }
        Update: {
          color?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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