import React from "react";
import { useUpdate } from "../contexts/UpdateContext";

const UpdateTestPage: React.FC = () => {
  const {
    updateInfo,
    isChecking,
    isDownloading,
    isInstalling,
    downloadProgress,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    setShowUpdateDialog,
  } = useUpdate();

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Auto-Updater Test</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Status</h2>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Version:</span>
              <span className="text-white ml-2">
                {updateInfo?.current_version || "Loading..."}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Latest Version:</span>
              <span className="text-green-400 ml-2">
                {updateInfo?.latest_version || "Unknown"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Update Available:</span>
              <span
                className={`ml-2 ${
                  updateInfo?.update_available
                    ? "text-green-400"
                    : "text-gray-400"
                }`}
              >
                {updateInfo?.update_available ? "Yes" : "No"}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Status:</span>
              <span className="text-white ml-2">
                {isChecking
                  ? "Checking..."
                  : isDownloading
                  ? "Downloading..."
                  : isInstalling
                  ? "Installing..."
                  : "Idle"}
              </span>
            </div>
          </div>

          {isDownloading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Download Progress</span>
                <span className="text-gray-300">{downloadProgress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={checkForUpdates}
              disabled={isChecking || isDownloading || isInstalling}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChecking ? "Checking..." : "Check for Updates"}
            </button>

            <button
              onClick={() => setShowUpdateDialog(true)}
              disabled={!updateInfo}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Show Update Dialog
            </button>

            {updateInfo?.update_available && (
              <button
                onClick={downloadUpdate}
                disabled={
                  isDownloading ||
                  isInstalling ||
                  (updateInfo as any).ready_to_install
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? "Downloading..." : "Download Update"}
              </button>
            )}

            {(updateInfo as any)?.ready_to_install && (
              <button
                onClick={installUpdate}
                disabled={isInstalling}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInstalling ? "Installing..." : "Install & Restart"}
              </button>
            )}
          </div>
        </div>

        {updateInfo?.error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">Error</h3>
            <p className="text-red-300">{updateInfo.message}</p>
          </div>
        )}

        {updateInfo?.release_notes && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Release Notes</h2>
            <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {updateInfo.release_notes}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateTestPage;
