export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          user_id: string
          amount: number
          category: string
          description: string
          date: string
          type: 'income' | 'expense'
          source: 'bank' | 'wallet' | null
          destination: 'bank' | 'wallet' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          category: string
          description?: string
          date: string
          type: 'income' | 'expense'
          source?: 'bank' | 'wallet' | null
          destination?: 'bank' | 'wallet' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          category?: string
          description?: string
          date?: string
          type?: 'income' | 'expense'
          source?: 'bank' | 'wallet' | null
          destination?: 'bank' | 'wallet' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      account_balances: {
        Row: {
          id: string
          user_id: string
          bank: number
          wallet: number
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          bank?: number
          wallet?: number
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          bank?: number
          wallet?: number
          updated_at?: string
        }
        Relationships: []
      }
      expense_limits: {
        Row: {
          id: string
          user_id: string
          category: string
          limit_amount: number
          month: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          limit_amount: number
          month: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          category?: string
          limit_amount?: number
          month?: string
          created_at?: string
          updated_at?: string
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