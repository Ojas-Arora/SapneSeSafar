export interface Article {
  id: string;
  title: string;
  description: string | null;
  link: string;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface FeedTopic {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  created_at: string;
}
