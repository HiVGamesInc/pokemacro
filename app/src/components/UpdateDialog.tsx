import React from "react";
import { useUpdate } from "../contexts/UpdateContext";

const UpdateDialog: React.FC = () => {
  const {
    updateInfo,
    isDownloading,
    isInstalling,
    downloadProgress,
    downloadUpdate,
    installUpdate,
    dismissUpdate,
    showUpdateDialog,
  } = useUpdate();

  if (!showUpdateDialog || !updateInfo) return null;

  const formatReleaseDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString();
  };

  const renderContent = () => {
    if (updateInfo.error) {
      return (
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            Update Check Failed
          </h3>
          <p className="text-gray-300 mb-6">{updateInfo.message}</p>
          <button
            onClick={dismissUpdate}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      );
    }

    if (!updateInfo.update_available) {
      return (
        <div className="text-center">
          <div className="text-green-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
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
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            You're Up to Date!
          </h3>
          <p className="text-gray-300 mb-6">
            You are running the latest version ({updateInfo.current_version})
          </p>
          <button
            onClick={dismissUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      );
    }

    return (
      <div>
        <div className="text-center mb-6">
          <div className="text-blue-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto mb-4"
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
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Update Available!
          </h3>
          <p className="text-gray-300">
            A new version of Pokemacro is available
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Current Version:</span>
              <span className="text-white ml-2">
                {updateInfo.current_version}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Latest Version:</span>
              <span className="text-green-400 ml-2">
                {updateInfo.latest_version}
              </span>
            </div>
            {updateInfo.release_date && (
              <div className="col-span-2">
                <span className="text-gray-400">Release Date:</span>
                <span className="text-white ml-2">
                  {formatReleaseDate(updateInfo.release_date)}
                </span>
              </div>
            )}
          </div>
        </div>

        {updateInfo.release_notes && (
          <div className="mb-6">
            <h4 className="text-white font-medium mb-2">What's New:</h4>
            <div className="bg-gray-700 rounded-lg p-3 max-h-32 overflow-y-auto">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                {updateInfo.release_notes}
              </pre>
            </div>
          </div>
        )}

        {isDownloading && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Downloading...</span>
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

        <div className="flex gap-3 justify-end">
          <button
            onClick={dismissUpdate}
            disabled={isDownloading || isInstalling}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Later
          </button>

          {!(updateInfo as any).ready_to_install ? (
            <button
              onClick={downloadUpdate}
              disabled={isDownloading || isInstalling}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDownloading ? (
                <>
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
                  Downloading...
                </>
              ) : (
                "Download Update"
              )}
            </button>
          ) : (
            <button
              onClick={installUpdate}
              disabled={isInstalling}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isInstalling ? (
                <>
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
                  Installing...
                </>
              ) : (
                "Install & Restart"
              )}
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default UpdateDialog;
