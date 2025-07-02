import React from "react";

interface ErrorBannerProps {
  message: string;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mb-4 flex items-center justify-between"
      role="alert"
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-red-700 font-bold text-lg leading-none focus:outline-none"
        aria-label="Dismiss error"
      >
        &times;
      </button>
    </div>
  );
};

export default ErrorBanner;
