export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          nickname: string | null;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          updated_at?: string;
        };
      };
      diary_entries: {
        Row: {
          id: string;
          user_id: string;
          movie_id: number;
          movie_title: string;
          poster_path: string;
          rating: number;
          review: string;
          watch_date: string;
          mood: string;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          movie_id: number;
          movie_title: string;
          poster_path: string;
          rating: number;
          review: string;
          watch_date: string;
          mood: string;
          tags: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          movie_id?: number;
          movie_title?: string;
          poster_path?: string;
          rating?: number;
          review?: string;
          watch_date?: string;
          mood?: string;
          tags?: string[];
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type DiaryEntryRow = Database['public']['Tables']['diary_entries']['Row'];
