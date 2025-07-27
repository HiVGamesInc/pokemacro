import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface UpdateInfo {
  update_available: boolean;
  current_version: string;
  latest_version?: string;
  release_notes?: string;
  download_url?: string;
  release_date?: string;
  release_name?: string;
  error?: boolean;
  message?: string;
}

export interface UpdateContextType {
  updateInfo: UpdateInfo | null;
  isChecking: boolean;
  isDownloading: boolean;
  isInstalling: boolean;
  downloadProgress: number;
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  installUpdate: () => Promise<void>;
  dismissUpdate: () => void;
  showUpdateDialog: boolean;
  setShowUpdateDialog: (show: boolean) => void;
}

const UpdateContext = createContext<UpdateContextType | undefined>(undefined);

export const useUpdate = () => {
  const context = useContext(UpdateContext);
  if (context === undefined) {
    throw new Error("useUpdate must be used within an UpdateProvider");
  }
  return context;
};

interface UpdateProviderProps {
  children: ReactNode;
}

export const UpdateProvider: React.FC<UpdateProviderProps> = ({ children }) => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const checkForUpdates = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/update/check");
      const data = await response.json();
      setUpdateInfo(data);

      // Don't automatically show dialog - let user click notification instead
      // This makes it less intrusive
      if (data.update_available && !data.error) {
        // Dialog will be shown when user clicks the notification
        console.log(`Update available: ${data.latest_version}`);
      }
    } catch (error) {
      console.error("Failed to check for updates:", error);
      setUpdateInfo({
        error: true,
        message: "Failed to check for updates",
        update_available: false,
        current_version: "4.0.0",
      });
    } finally {
      setIsChecking(false);
    }
  };
  const downloadUpdate = async () => {
    if (!updateInfo?.update_available) return;

    setIsDownloading(true);
    setDownloadProgress(0);

    try {
      // Start the download
      const response = await fetch("/update/download", {
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      // Poll for progress
      const progressInterval = setInterval(async () => {
        try {
          const progressResponse = await fetch("/update/progress");
          const progressData = await progressResponse.json();
          setDownloadProgress(progressData.progress);

          if (progressData.progress >= 100) {
            clearInterval(progressInterval);
          }
        } catch (error) {
          console.error("Failed to get progress:", error);
        }
      }, 500);

      // Update the updateInfo to reflect that download is complete
      setUpdateInfo((prev) => ({
        ...prev!,
        ready_to_install: true,
      }));
    } catch (error) {
      console.error("Failed to download update:", error);
      setUpdateInfo((prev) => ({
        ...prev!,
        error: true,
        message: `Failed to download update: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }));
    } finally {
      setIsDownloading(false);
    }
  };

  const installUpdate = async () => {
    setIsInstalling(true);

    try {
      const response = await fetch("/update/install", {
        method: "POST",
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message);
      }

      // Show confirmation and then let the backend handle app closure
      setUpdateInfo((prev) => ({
        ...prev!,
        message:
          "Installing update... The application will restart automatically.",
      }));

      // Give the user a moment to see the message, then the backend will close the app
      setTimeout(() => {
        // The backend has already started the update process and will close the app
      }, 2000);
    } catch (error) {
      console.error("Failed to install update:", error);
      setUpdateInfo((prev) => ({
        ...prev!,
        error: true,
        message: `Failed to install update: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      }));
      setIsInstalling(false);
    }
  };

  const dismissUpdate = () => {
    setShowUpdateDialog(false);
    setUpdateInfo(null);
    setDownloadProgress(0);
  };

  // Check for updates on component mount and then periodically
  useEffect(() => {
    checkForUpdates();

    // Check for updates every hour
    const interval = setInterval(checkForUpdates, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const value: UpdateContextType = {
    updateInfo,
    isChecking,
    isDownloading,
    isInstalling,
    downloadProgress,
    checkForUpdates,
    downloadUpdate,
    installUpdate,
    dismissUpdate,
    showUpdateDialog,
    setShowUpdateDialog,
  };

  return (
    <UpdateContext.Provider value={value}>{children}</UpdateContext.Provider>
  );
};
