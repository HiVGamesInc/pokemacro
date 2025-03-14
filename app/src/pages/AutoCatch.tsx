import React, { useState, useContext } from "react";
import Button from "../components/Button/Button";
import { handleCropImage } from "../utils/actions";
import ImagesGrid from "../components/ImagesGrid";
import { AutoCatchContext, defaultAutoCatchConfig } from "../contexts/AutoCatchContext";
import KeybindingPicker from "../components/KeybindingPicker"; 

const AutoCatch = () => {
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [refreshGrid, setRefreshGrid] = useState(0);

  const { autoCatchConfig, setAutoCatchConfig } = useContext(AutoCatchContext);

  const startNewCrop = async () => {
    setLoading(true);
    setMessage("");
    try {
      const result = await handleCropImage();
      setMessage(result.message);
      if (result.image) {
        setCroppedImage(result.image);
        setAutoCatchConfig((prev) => {
          const current = { ...defaultAutoCatchConfig, ...prev };
          return {
            ...current,
            selectedImages: [
              ...current.selectedImages,
              { filename: result.image, label: "New Image" },
            ],
          };
        });
        setRefreshGrid((prev) => prev + 1);
      }
    } catch (error) {
      setMessage("Error starting crop");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Auto Catch Config</h1>

      <div className="mt-4">
        <h2 className="text-lg font-bold mb-2">Auto Catch Hotkey</h2>
        <KeybindingPicker
          key={autoCatchConfig.hotkey}  
          name="autocatch-hotkey"
          currentKey={autoCatchConfig.hotkey || ""}
          onKeySelected={(selectedKey) => {
            setAutoCatchConfig((prev) => {
              const current = prev || { selectedImages: [], hotkey: "" };
              return {
                ...current,
                hotkey: selectedKey.keyName || current.hotkey,
              };
            });
          }}
        />
      </div>

      <div className="mt-4">
        <Button onClick={startNewCrop}>
          {loading ? "Cropping..." : "Start New Crop"}
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">All Cropped Images</h2>
        <ImagesGrid refresh={refreshGrid} initialSelected={autoCatchConfig.selectedImages} />
      </div>
    </div>
  );
};

export default AutoCatch;
