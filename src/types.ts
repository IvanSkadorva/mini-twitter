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

export enum FeedView {
  Latest = "latest",
  ForYou = "foryou",
}

export const DEMO_USERS = [
  { username: "alice" },
  { username: "bob" },
  { username: "charlie" },
];

export const MAX_TWEET_CHARS = 280;

export enum ErrorMessages {
  PostFailed = "Failed to post tweet. Please try again later.",
  LikeFailed = "Failed to like tweet. Please try again later.",
  ReplyFailed = "Failed to reply to tweet. Please try again later.",
  DeleteFailed = "Failed to delete tweet. Please try again later.",
}

export const DELETE_CONFIRMATION =
  "Are you sure you want to delete this tweet and its replies?";

export const APP_TITLE = "Mini Twitter Feed";
export const USER_LABEL = "User:";
