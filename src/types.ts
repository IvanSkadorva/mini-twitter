export interface Reply {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface Tweet {
  id: string;
  username: string;
  content: string;
  timestamp: string;
  likes: number;
  replies: Reply[];
}
