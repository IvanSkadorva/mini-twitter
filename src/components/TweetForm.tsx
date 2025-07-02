import React from "react";

interface TweetFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  maxChars: number;
}

const TweetForm: React.FC<TweetFormProps> = ({
  value,
  onChange,
  onSubmit,
  submitting,
  maxChars,
}) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mb-6 bg-white p-4 rounded shadow flex flex-col gap-2"
    >
      <textarea
        className="border rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        maxLength={maxChars}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="What's happening?"
      />
      <div className="flex justify-between items-center text-sm">
        <span
          className={value.length > maxChars ? "text-red-500" : "text-gray-500"}
        >
          {value.length}/{maxChars}
        </span>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          disabled={!value.trim() || value.length > maxChars || submitting}
        >
          Tweet
        </button>
      </div>
    </form>
  );
};

export default TweetForm;
