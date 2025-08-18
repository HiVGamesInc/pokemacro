import { useContext, useState, useEffect, useCallback } from "react";
import { AutoReviveContext } from "../contexts/AutoReviveContext";
import Button from "../components/Button/Button";
import KeybindingPicker from "../components/KeybindingPicker";
import {
  toggleMouseTracking,
  getMouseCoordinates,
  clearMouseCoordinates,
  getMouseTrackingCapabilities,
} from "../utils/actions";
import PageWrapper from "../components/PageWrapper";
import { SparklesIcon, CursorArrowRaysIcon } from "@heroicons/react/24/outline";
import Input from "../components/Input/Input";

const AutoRevive = () => {
  const { autoReviveConfig, setAutoReviveConfig } =
    useContext(AutoReviveContext);
  const [isTracking, setIsTracking] = useState(false);
  const [localPosition, setLocalPosition] = useState({ x: 0, y: 0 });

  // Load tracking capabilities on component mount (for future use)
  useEffect(() => {
    const loadCapabilities = async () => {
      try {
        const capabilities = await getMouseTrackingCapabilities();
        console.log("Mouse tracking capabilities:", capabilities);
      } catch (error) {
        console.error("Error loading tracking capabilities:", error);
      }
    };
    loadCapabilities();
  }, []);

  // Sync local position with context when context changes
  useEffect(() => {
    setLocalPosition(autoReviveConfig.position);
  }, [autoReviveConfig.position]);

  // Debounce function for updating coordinates
  const updateCoordinates = useCallback(
    (newPosition: { x: number; y: number }) => {
      const timeoutId = setTimeout(() => {
        setAutoReviveConfig((prev) => ({
          ...prev,
          position: newPosition,
        }));
      }, 500); // 500ms debounce

      return () => clearTimeout(timeoutId);
    },
    [setAutoReviveConfig]
  );

  const handleXChange = (value: string) => {
    const x = parseInt(value) || 0;
    const newPosition = { ...localPosition, x };
    setLocalPosition(newPosition);
    updateCoordinates(newPosition);
  };

  const handleYChange = (value: string) => {
    const y = parseInt(value) || 0;
    const newPosition = { ...localPosition, y };
    setLocalPosition(newPosition);
    updateCoordinates(newPosition);
  };

  // Poll for coordinates when tracking is active
  useEffect(() => {
    if (!isTracking) return;

    let lastDetectedCoords = { x: 0, y: 0 };

    const interval = setInterval(async () => {
      try {
        const coords = await getMouseCoordinates();

        // Only log if we have meaningful coordinates
        if (coords && (coords.x !== 0 || coords.y !== 0)) {
          console.log("Polling mouse coordinates:", coords);
        }

        // Check if we have NEW valid coordinates (different from last detected)
        if (
          coords &&
          (coords.x !== 0 || coords.y !== 0) &&
          (coords.x !== lastDetectedCoords.x ||
            coords.y !== lastDetectedCoords.y)
        ) {
          console.log("New coordinates detected:", coords);
          lastDetectedCoords = coords;

          // Update coordinates both locally and in config
          setLocalPosition(coords);
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
        // Stop tracking on error
        setIsTracking(false);
      }
    }, 500); // Increased interval to reduce aggressive polling

    return () => clearInterval(interval);
  }, [isTracking, setAutoReviveConfig]); // Removed localPosition from dependencies!

  const handleStartTracking = async () => {
    try {
      console.log("Starting mouse tracking...");

      // First, ensure any previous tracking is stopped
      if (isTracking) {
        await toggleMouseTracking();
        setIsTracking(false);
        await new Promise((resolve) => setTimeout(resolve, 100)); // Small delay
      }

      // Clear old coordinates from backend
      await clearMouseCoordinates();

      // Reset coordinates before starting tracking
      setLocalPosition({ x: 0, y: 0 });
      setAutoReviveConfig((prev) => ({
        ...prev,
        position: { x: 0, y: 0 },
      }));

      // Start new tracking
      const result = await toggleMouseTracking();
      console.log("Mouse tracking toggle result:", result);
      setIsTracking(result.tracking_enabled);
    } catch (error) {
      console.error("Error toggling mouse tracking:", error);
      setIsTracking(false);
    }
  };

  return (
    <PageWrapper
      title="Auto Revive"
      subtitle="Configure automatic Pokemon revival settings"
    >
      <div className="grid grid-cols-5 gap-6">
        {/* Left Column: Position & Trigger Key */}
        <div className="col-span-2 space-y-6">
          {/* Position Configuration */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
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
                    value={localPosition.x.toString()}
                    onChange={(e) => handleXChange(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Y Coordinate
                  </label>
                  <Input
                    type="number"
                    value={localPosition.y.toString()}
                    onChange={(e) => handleYChange(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-gray-100"
                  />
                </div>
              </div>

              {isTracking && (
                <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 space-y-3">
                  <p className="text-blue-100 font-medium text-center">
                    📍 Position tracking is active!
                  </p>

                  <div className="bg-blue-800 rounded-lg p-3 space-y-2">
                    <div className="text-blue-100 text-sm">
                      <p className="font-medium mb-2">How to set position:</p>
                      <div className="space-y-1 ml-4">
                        <p>
                          • <strong>Click with mouse:</strong> Click anywhere on
                          the screen
                        </p>
                        <p>
                          • <strong>Use Enter key:</strong> Position mouse
                          cursor and press Enter
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-blue-300 text-xs text-center">
                    Both methods work - use whichever is more convenient for you
                  </p>
                </div>
              )}

              {(localPosition.x !== 0 || localPosition.y !== 0) && (
                <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                  <p className="text-gray-100">
                    <span className="font-medium">Current position:</span> X:{" "}
                    {localPosition.x}, Y: {localPosition.y}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Trigger Key Configuration */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
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

        {/* Right Column: Timeline */}
        <div className="col-span-3">
          {/* Auto Revive Process Timeline */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3 p-6 border-b border-gray-700">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-100">
                  Auto Revive Process
                </h3>
                <p className="text-sm text-gray-400">
                  Step-by-step timeline with customizable delays
                </p>
              </div>
            </div>

            <div className="p-6">
              {/* Process Timeline */}
              <div className="space-y-4">
                {/* Step 1: Move to Position */}
                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      1
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-100">
                      Move to Revive Position
                    </h4>
                    <p className="text-xs text-gray-400">
                      Mouse moves to the configured revive location
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CursorArrowRaysIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-400">
                      → Position ({localPosition.x}, {localPosition.y})
                    </span>
                  </div>
                </div>

                {/* Delay 1 */}
                <div className="flex items-center gap-4 ml-8">
                  <div className="w-0.5 h-8 bg-yellow-400"></div>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-yellow-400 font-medium">
                      Wait
                    </span>
                    <Input
                      type="number"
                      value={autoReviveConfig.delays.afterMove.toString()}
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          Math.min(2000, parseInt(e.target.value) || 100)
                        );
                        setAutoReviveConfig((prev) => ({
                          ...prev,
                          delays: { ...prev.delays, afterMove: value },
                        }));
                      }}
                      className="w-20 bg-gray-700 border-gray-600 text-gray-100 text-sm"
                      wrapperClassName="mt-0"
                    />
                    <span className="text-sm text-gray-400">ms</span>
                    <span className="text-xs text-gray-500">
                      after moving to position
                    </span>
                  </div>
                </div>

                {/* Step 2: Remove Pokemon */}
                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      2
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-100">
                      Remove Pokemon
                    </h4>
                    <p className="text-xs text-gray-400">
                      Click to remove/faint the pokemon from party
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <Button
                        variant={
                          autoReviveConfig.clickConfig.removeClick === "left"
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setAutoReviveConfig((prev) => ({
                            ...prev,
                            clickConfig: {
                              ...prev.clickConfig,
                              removeClick: "left",
                            },
                          }));
                        }}
                        className="px-2 py-1 text-xs"
                      >
                        Left Click
                      </Button>
                      <Button
                        variant={
                          autoReviveConfig.clickConfig.removeClick === "right"
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setAutoReviveConfig((prev) => ({
                            ...prev,
                            clickConfig: {
                              ...prev.clickConfig,
                              removeClick: "right",
                            },
                          }));
                        }}
                        className="px-2 py-1 text-xs"
                      >
                        Right Click
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-red-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586l1.293-1.293a1 1 0 111.414 1.414L10.414 12l1.293 1.293a1 1 0 01-1.414 1.414L9 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 12 6.293 10.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-gray-400">Mouse Click</span>
                    </div>
                  </div>
                </div>

                {/* Delay 2 */}
                <div className="flex items-center gap-4 ml-8">
                  <div className="w-0.5 h-8 bg-yellow-400"></div>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-yellow-400 font-medium">
                      Wait
                    </span>
                    <Input
                      type="number"
                      value={autoReviveConfig.delays.afterRemovePokemon.toString()}
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          Math.min(2000, parseInt(e.target.value) || 200)
                        );
                        setAutoReviveConfig((prev) => ({
                          ...prev,
                          delays: { ...prev.delays, afterRemovePokemon: value },
                        }));
                      }}
                      className="w-20 bg-gray-700 border-gray-600 text-gray-100 text-sm"
                      wrapperClassName="mt-0"
                    />
                    <span className="text-sm text-gray-400">ms</span>
                    <span className="text-xs text-gray-500">
                      after removing pokemon
                    </span>
                  </div>
                </div>

                {/* Step 3: Use Revive */}
                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      3
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-100">
                      Use Revive
                    </h4>
                    <p className="text-xs text-gray-400">
                      Press the revive key to use revive item
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-400">
                      Key Press: {autoReviveConfig.keybind || "Not set"}
                    </span>
                  </div>
                </div>

                {/* Delay 3 */}
                <div className="flex items-center gap-4 ml-8">
                  <div className="w-0.5 h-8 bg-yellow-400"></div>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-yellow-400 font-medium">
                      Wait
                    </span>
                    <Input
                      type="number"
                      value={autoReviveConfig.delays.afterUseRevive.toString()}
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          Math.min(2000, parseInt(e.target.value) || 300)
                        );
                        setAutoReviveConfig((prev) => ({
                          ...prev,
                          delays: { ...prev.delays, afterUseRevive: value },
                        }));
                      }}
                      className="w-20 bg-gray-700 border-gray-600 text-gray-100 text-sm"
                      wrapperClassName="mt-0"
                    />
                    <span className="text-sm text-gray-400">ms</span>
                    <span className="text-xs text-gray-500">
                      after using revive
                    </span>
                  </div>
                </div>

                {/* Step 4: Release Pokemon */}
                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      4
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-100">
                      Release Pokemon
                    </h4>
                    <p className="text-xs text-gray-400">
                      Click to send the revived pokemon back to battle
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <Button
                        variant={
                          autoReviveConfig.clickConfig.releaseClick === "left"
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setAutoReviveConfig((prev) => ({
                            ...prev,
                            clickConfig: {
                              ...prev.clickConfig,
                              releaseClick: "left",
                            },
                          }));
                        }}
                        className="px-2 py-1 text-xs"
                      >
                        Left Click
                      </Button>
                      <Button
                        variant={
                          autoReviveConfig.clickConfig.releaseClick === "right"
                            ? "primary"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => {
                          setAutoReviveConfig((prev) => ({
                            ...prev,
                            clickConfig: {
                              ...prev.clickConfig,
                              releaseClick: "right",
                            },
                          }));
                        }}
                        className="px-2 py-1 text-xs"
                      >
                        Right Click
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-purple-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs text-gray-400">Mouse Click</span>
                    </div>
                  </div>
                </div>

                {/* Delay 4 */}
                <div className="flex items-center gap-4 ml-8">
                  <div className="w-0.5 h-8 bg-yellow-400"></div>
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-sm text-yellow-400 font-medium">
                      Wait
                    </span>
                    <Input
                      type="number"
                      value={autoReviveConfig.delays.afterReleasePokemon.toString()}
                      onChange={(e) => {
                        const value = Math.max(
                          0,
                          Math.min(2000, parseInt(e.target.value) || 150)
                        );
                        setAutoReviveConfig((prev) => ({
                          ...prev,
                          delays: {
                            ...prev.delays,
                            afterReleasePokemon: value,
                          },
                        }));
                      }}
                      className="w-20 bg-gray-700 border-gray-600 text-gray-100 text-sm"
                      wrapperClassName="mt-0"
                    />
                    <span className="text-sm text-gray-400">ms</span>
                    <span className="text-xs text-gray-500">
                      after releasing pokemon
                    </span>
                  </div>
                </div>

                {/* Step 5: Return to Original Position */}
                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      5
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-100">
                      Return to Original Position
                    </h4>
                    <p className="text-xs text-gray-400">
                      Mouse moves back to where it was before
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    <span className="text-xs text-gray-400">
                      Process Complete
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mt-8 p-4 bg-gray-700 border border-gray-600 rounded-lg">
                <h4 className="text-sm font-medium text-gray-200 mb-3">
                  ⚡ Quick Presets
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={() => {
                      setAutoReviveConfig((prev) => ({
                        ...prev,
                        delays: {
                          afterMove: 50,
                          afterRemovePokemon: 100,
                          afterUseRevive: 150,
                          afterReleasePokemon: 75,
                        },
                      }));
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    🚀 Fast (375ms total)
                  </Button>
                  <Button
                    onClick={() => {
                      setAutoReviveConfig((prev) => ({
                        ...prev,
                        delays: {
                          afterMove: 100,
                          afterRemovePokemon: 200,
                          afterUseRevive: 300,
                          afterReleasePokemon: 150,
                        },
                      }));
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    ⚖️ Balanced (750ms total)
                  </Button>
                  <Button
                    onClick={() => {
                      setAutoReviveConfig((prev) => ({
                        ...prev,
                        delays: {
                          afterMove: 200,
                          afterRemovePokemon: 400,
                          afterUseRevive: 500,
                          afterReleasePokemon: 300,
                        },
                      }));
                    }}
                    variant="outline"
                    className="text-sm"
                  >
                    🐌 Safe (1400ms total)
                  </Button>
                </div>
              </div>

              {/* Total Time Info */}
              <div className="mt-4 p-3 bg-blue-900 border border-blue-700 rounded-lg">
                <p className="text-blue-100 text-sm">
                  <span className="font-medium">Total Process Time:</span>{" "}
                  {autoReviveConfig.delays.afterMove +
                    autoReviveConfig.delays.afterRemovePokemon +
                    autoReviveConfig.delays.afterUseRevive +
                    autoReviveConfig.delays.afterReleasePokemon}
                  ms
                </p>
                <p className="text-blue-200 text-xs mt-1">
                  This is the minimum time between activation and completion
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AutoRevive;
