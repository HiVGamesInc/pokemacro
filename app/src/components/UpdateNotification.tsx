import React from "react";
import { useUpdate } from "../contexts/UpdateContext";

const UpdateNotification: React.FC = () => {
  const { updateInfo, isChecking, setShowUpdateDialog } = useUpdate();

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-blue-400 text-sm">
        <svg
          className="animate-spin w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span>Checking for updates...</span>
      </div>
    );
  }

  if (updateInfo?.update_available && !updateInfo.error) {
    return (
      <button
        onClick={() => setShowUpdateDialog(true)}
        className="flex items-center gap-2 text-green-400 hover:text-green-300 text-sm transition-colors"
      >
        <div className="relative">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
        </div>
        <span>Update available (v{updateInfo.latest_version})</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-gray-400 text-sm">
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>v{updateInfo?.current_version || "3.0.0"}</span>
    </div>
  );
};

export default UpdateNotification;
