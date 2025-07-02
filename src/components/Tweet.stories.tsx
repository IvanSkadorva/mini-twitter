import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TweetComponent from "./Tweet";
import { Tweet } from "../types";

const meta: Meta<typeof TweetComponent> = {
  title: "Components/Tweet",
  component: TweetComponent,
};
export default meta;

type Story = StoryObj<typeof TweetComponent>;

const exampleTweet: Tweet = {
  id: "1",
  username: "user123",
  content: "Hello, world! #coding",
  timestamp: new Date().toISOString(),
  likes: 3,
  replies: [
    {
      id: "2",
      username: "user456",
      content: "Welcome to Twitter! #hello",
      timestamp: new Date().toISOString(),
      likes: 1,
    },
  ],
};

export const Default: Story = {
  render: () => {
    const [replyContent, setReplyContent] = useState("");
    return (
      <TweetComponent
        tweet={exampleTweet}
        liked={false}
        onLike={() => {}}
        onReply={() => {}}
        onDelete={() => {}}
        replying={false}
        replyContent={replyContent}
        onReplyContentChange={setReplyContent}
        onReplySubmit={(e) => e.preventDefault()}
        parseHashtags={(content) => content}
        maxChars={280}
        replySubmitting={false}
      />
    );
  },
};

export const WithReplyForm: Story = {
  render: () => {
    const [replyContent, setReplyContent] = useState("");
    return (
      <TweetComponent
        tweet={exampleTweet}
        liked={false}
        onLike={() => {}}
        onReply={() => {}}
        onDelete={() => {}}
        replying={true}
        replyContent={replyContent}
        onReplyContentChange={setReplyContent}
        onReplySubmit={(e) => e.preventDefault()}
        parseHashtags={(content) => content}
        maxChars={280}
        replySubmitting={false}
      />
    );
  },
};
