import React from "react";

interface TweetFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  maxChars: number;
  username?: string;
}

const getAvatarColor = (username: string) => {
  const colors = [
    "bg-blue-400",
    "bg-pink-400",
    "bg-green-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-red-400",
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
  return colors[hash % colors.length];
};

const TweetForm: React.FC<TweetFormProps> = ({
  value,
  onChange,
  onSubmit,
  submitting,
  maxChars,
  username = "demo_user",
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 bg-white p-4 rounded-xl shadow flex flex-col gap-2 border border-gray-100"
    >
      <div className="flex items-start gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow ${getAvatarColor(
            username
          )}`}
          aria-label={`Avatar for @${username}`}
        >
          {username[0].toUpperCase()}
        </div>
        <textarea
          className="border rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 flex-1 min-h-[60px]"
          rows={3}
          maxLength={maxChars}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="What's happening?"
        />
      </div>
      <div className="flex justify-between items-center text-sm mt-1">
        <span
          className={value.length > maxChars ? "text-red-500" : "text-gray-500"}
        >
          {value.length}/{maxChars}
        </span>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50 shadow hover:bg-blue-600 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={!value.trim() || value.length > maxChars || submitting}
        >
          Tweet
        </button>
      </div>
    </form>
  );
};

export default TweetForm;
