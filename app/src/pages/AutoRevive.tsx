import { useContext, useState, useEffect } from "react";
import { AutoReviveContext } from "../contexts/AutoReviveContext";
import Button from "../components/Button/Button";
import KeybindingPicker from "../components/KeybindingPicker";
import { toggleMouseTracking, getMouseCoordinates } from "../utils/actions";
import PageWrapper from "../components/PageWrapper";
import { SparklesIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import Input from "../components/Input/Input";

const AutoRevive = () => {
  const { autoReviveConfig, setAutoReviveConfig } =
    useContext(AutoReviveContext);
  const [isTracking, setIsTracking] = useState(false);

  // Poll for coordinates when tracking is active
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      try {
        const coords = await getMouseCoordinates();

        // Check if we have new coordinates
        if (
          coords &&
          (coords.x !== 0 || coords.y !== 0) &&
          (coords.x !== autoReviveConfig.position.x ||
            coords.y !== autoReviveConfig.position.y)
        ) {
          // Update coordinates in config
          setAutoReviveConfig((prev) => ({
            ...prev,
            position: coords,
          }));

          // Stop tracking immediately once we get coordinates
          setIsTracking(false);
          await toggleMouseTracking(); // Disable tracking on backend
        }
      } catch (error) {
        console.error("Error getting mouse coordinates:", error);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [
    isTracking,
    autoReviveConfig.position.x,
    autoReviveConfig.position.y,
    setAutoReviveConfig,
  ]);

  const handleStartTracking = async () => {
    try {
      // Reset coordinates before starting tracking
      setAutoReviveConfig((prev) => ({
        ...prev,
        position: { x: 0, y: 0 },
      }));

      const result = await toggleMouseTracking();
      setIsTracking(result.tracking_enabled);
    } catch (error) {
      console.error("Error toggling mouse tracking:", error);
    }
  };

  return (
    <PageWrapper
      title="Auto Revive"
      subtitle="Configure automatic Pokemon revival settings"
    >
      <div className="flex gap-6">
        {/* Position Configuration */}
        <div className="flex-[2] bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <CursorArrowRaysIcon className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-100">
                Revive Position
              </h3>
              <p className="text-sm text-gray-400">
                Set where to click for revival
              </p>
            </div>
            <Button
              onClick={handleStartTracking}
              variant={isTracking ? "danger" : "primary"}
              disabled={isTracking}
            >
              {isTracking ? "Tracking..." : "Track Position"}
            </Button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  X Coordinate
                </label>
                <Input
                  type="number"
                  value={autoReviveConfig.position.x.toString()}
                  onChange={(e) =>
                    setAutoReviveConfig((prev) => ({
                      ...prev,
                      position: {
                        ...prev.position,
                        x: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Y Coordinate
                </label>
                <Input
                  type="number"
                  value={autoReviveConfig.position.y.toString()}
                  onChange={(e) =>
                    setAutoReviveConfig((prev) => ({
                      ...prev,
                      position: {
                        ...prev.position,
                        y: parseInt(e.target.value) || 0,
                      },
                    }))
                  }
                  className="bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
            </div>

            {isTracking && (
              <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
                <p className="text-blue-100 font-medium">
                  📍 Click anywhere on screen to set the revive position
                </p>
              </div>
            )}

            {(autoReviveConfig.position.x !== 0 ||
              autoReviveConfig.position.y !== 0) && (
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <p className="text-gray-100">
                  <span className="font-medium">Current position:</span> X:{" "}
                  {autoReviveConfig.position.x}, Y:{" "}
                  {autoReviveConfig.position.y}
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Hotkey Configuration */}
        <div className="flex-[1] bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <SparklesIcon className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-semibold text-gray-100">
              Auto Revive Hotkey
            </h3>
          </div>
          <div className="max-w-xs">
            <KeybindingPicker
              name="autorevive-hotkey"
              currentKey={autoReviveConfig.keybind}
              onKeySelected={(selectedKey) => {
                setAutoReviveConfig((prev) => ({
                  ...prev,
                  keybind: selectedKey.keyName || "",
                }));
              }}
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Press this key to trigger automatic revival
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AutoRevive;
