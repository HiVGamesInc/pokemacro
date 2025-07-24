import { useContext, useState, useEffect } from "react";
import { AutoReviveContext } from "../contexts/AutoReviveContext";
import Button from "../components/Button/Button";
import KeybindingPicker from "../components/KeybindingPicker";
import { toggleMouseTracking, getMouseCoordinates } from "../utils/actions";

const AutoRevive = () => {
  const { autoReviveConfig, setAutoReviveConfig } = useContext(AutoReviveContext);
  const [isTracking, setIsTracking] = useState(false);

  // Poll for coordinates when tracking is active
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(async () => {
      try {
        const coords = await getMouseCoordinates();
        
        // Check if we have new coordinates
        if (coords && (coords.x !== 0 || coords.y !== 0) && 
            (coords.x !== autoReviveConfig.position.x || coords.y !== autoReviveConfig.position.y)) {
          // Update coordinates in config
          setAutoReviveConfig(prev => ({
            ...prev,
            position: coords
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
  }, [isTracking, autoReviveConfig.position.x, autoReviveConfig.position.y, setAutoReviveConfig]);

  const handleStartTracking = async () => {
    try {
      // Reset coordinates before starting tracking
      setAutoReviveConfig(prev => ({
        ...prev,
        position: { x: 0, y: 0 }
      }));
      
      const result = await toggleMouseTracking();
      setIsTracking(result.tracking_enabled);
    } catch (error) {
      console.error("Error toggling mouse tracking:", error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Auto Revive Configuration</h1>
      
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Hotkey</h2>
        <KeybindingPicker
          name="autorevive-hotkey"
          currentKey={autoReviveConfig.keybind}
          onKeySelected={(selectedKey) => {
            setAutoReviveConfig(prev => ({
              ...prev,
              keybind: selectedKey.keyName || ""
            }));
          }}
        />
      </div>
      
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-2">Revive Position</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <span className="mr-2">X:</span>
            <input
              type="number"
              className="bg-gray-800 text-white px-3 py-2 rounded"
              value={autoReviveConfig.position.x}
              onChange={(e) => 
                setAutoReviveConfig(prev => ({
                  ...prev,
                  position: { ...prev.position, x: parseInt(e.target.value) || 0 }
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <span className="mr-2">Y:</span>
            <input
              type="number"
              className="bg-gray-800 text-white px-3 py-2 rounded"
              value={autoReviveConfig.position.y}
              onChange={(e) => 
                setAutoReviveConfig(prev => ({
                  ...prev,
                  position: { ...prev.position, y: parseInt(e.target.value) || 0 }
                }))
              }
            />
          </div>
          <Button
            className={`${isTracking ? "bg-red-600" : "bg-blue-600"} p-2 rounded-lg`}
            onClick={handleStartTracking}
          >
            {isTracking ? "Cancel" : "Track Position"}
          </Button>
        </div>
        
        {isTracking && (
          <div className="mt-4 p-4 bg-blue-900 rounded-lg">
            <p className="text-white font-bold">
              Click anywhere on screen to set the revive position
            </p>
          </div>
        )}
        
        {(autoReviveConfig.position.x !== 0 || autoReviveConfig.position.y !== 0) && (
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-white">
              Current position: X: {autoReviveConfig.position.x}, Y: {autoReviveConfig.position.y}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoRevive;