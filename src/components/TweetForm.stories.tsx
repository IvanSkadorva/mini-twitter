import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import TweetForm from "./TweetForm";
import TweetFormSkeleton from "./TweetFormSkeleton";

const meta: Meta<typeof TweetForm> = {
  title: "Components/TweetForm",
  component: TweetForm,
};
export default meta;

type Story = StoryObj<typeof TweetForm>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <TweetForm
        value={value}
        onChange={setValue}
        onSubmit={(e) => e.preventDefault()}
        submitting={false}
        maxChars={280}
        username="alice"
      />
    );
  },
};

export const Filled: Story = {
  render: () => {
    const [value, setValue] = useState("This is a pre-filled tweet #example");
    return (
      <TweetForm
        value={value}
        onChange={setValue}
        onSubmit={(e) => e.preventDefault()}
        submitting={false}
        maxChars={280}
        username="bob"
      />
    );
  },
};

export const Loading: Story = {
  render: () => <TweetFormSkeleton />,
};
