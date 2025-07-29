import React, { useState, useContext } from "react";
import Button from "../components/Button/Button";
import { handleCropImage } from "../utils/actions";
import ImagesGrid from "../components/ImagesGrid";
import { AutoCatchContext } from "../contexts/AutoCatchContext";
import KeybindingPicker from "../components/KeybindingPicker";
import PageWrapper from "../components/PageWrapper";
import { CameraIcon, PhotoIcon } from "@heroicons/react/24/outline";

const AutoCatch = () => {
  const [loading, setLoading] = useState(false);
  const [refreshGrid, setRefreshGrid] = useState(0);
  const { autoCatchConfig, setAutoCatchConfig } = useContext(AutoCatchContext);

  const startNewCrop = async () => {
    setLoading(true);
    try {
      const result = await handleCropImage();
      if (result.image) {
        setRefreshGrid((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Failed to crop image:", error);
    }
    setLoading(false);
  };

  return (
    <PageWrapper
      title="Auto Catch"
      subtitle="Configure automatic Pokemon catching with image recognition"
    >
      <div className="flex gap-6">
        {/* Images Grid */}
        <div className="flex-[2] bg-gray-800 rounded-lg border border-gray-700">
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <PhotoIcon className="w-5 h-5 text-green-400" />
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-100">
                Recognition Images
              </h3>
              <p className="text-sm text-gray-400">
                Select which Pokemon images to automatically catch
              </p>
            </div>
            <Button
              onClick={startNewCrop}
              variant="primary"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CameraIcon className="w-4 h-4" />
              {loading ? "Cropping..." : "New Crop"}
            </Button>
          </div>
          <div className="p-6">
            <ImagesGrid
              refresh={refreshGrid}
              initialSelected={autoCatchConfig.selectedImages}
            />
          </div>
        </div>
        {/* Hotkey Configuration */}
        <div className="flex-[1] bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <h3 className="text-base font-semibold text-gray-100">
              Auto Catch Hotkey
            </h3>
          </div>
          <div className="max-w-xs">
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
          <p className="text-sm text-gray-400 mt-2">
            Press this key to trigger auto catch when Pokemon appear
          </p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AutoCatch;
