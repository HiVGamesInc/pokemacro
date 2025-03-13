import React, { useEffect, useState, useContext } from "react";
import { getImages, deleteImage, renameImage, saveConfig } from "../utils/actions";
import { TrashIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { AutoCatchContext, defaultAutoCatchConfig } from "../contexts/AutoCatchContext";

export interface SelectedImage {
  filename: string;
  label: string;
}

interface ImagesGridProps {
  refresh?: number;
  onSelectionChange?: (selected: SelectedImage[]) => void;
  initialSelected?: SelectedImage[];
}

const ImagesGrid: React.FC<ImagesGridProps> = ({
  refresh = 0,
  onSelectionChange,
  initialSelected = [],
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [deletingImage, setDeletingImage] = useState<string | null>(null); // Track image being deleted

  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [imageLabels, setImageLabels] = useState<{ [key: string]: string }>({});
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([]);

  const { autoCatchConfig, setAutoCatchConfig } = useContext(AutoCatchContext);

  useEffect(() => {
    setSelectedImages(initialSelected.map((s) => s.filename));
    const initLabels: { [key: string]: string } = {};
    initialSelected.forEach((s) => {
      initLabels[s.filename] = s.label;
    });
    setImageLabels(initLabels);
  }, [initialSelected]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const data = await getImages();
      setImages(data.images);
      setImageLoaded(new Array(data.images.length).fill(false)); 
      setImageLabels((prev) => {
        const newLabels = { ...prev };
        data.images.forEach((filename: string) => {
          if (!newLabels[filename]) {
            newLabels[filename] = filename; 
          }
        });
        return newLabels;
      });
    } catch (err) {
      setError("Error fetching images");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages();
  }, [refresh]);

  const updateSelectionCallback = (
    currentSelected: string[],
    labelsMap: { [key: string]: string } = imageLabels
  ) => {
    const selectedArray: SelectedImage[] = currentSelected.map((filename) => ({
      filename,
      label: labelsMap[filename] || filename,
    }));
    if (onSelectionChange) {
      onSelectionChange(selectedArray);
    }
    const newConfig = {
      ...defaultAutoCatchConfig, 
      ...autoCatchConfig,
      selectedImages: selectedArray,
      hotkey: autoCatchConfig?.hotkey ? autoCatchConfig.hotkey : defaultAutoCatchConfig.hotkey,
    };
    setAutoCatchConfig(newConfig);
    saveConfig(newConfig, "autocatch.json")
      .then((response) => {
        console.log("Config saved:", response);
      })
      .catch((error) => {
        console.error("Error saving config:", error);
      });
  };

  const handleDelete = async (filename: string) => {
    setDeletingImage(filename); 

    setTimeout(async () => {
      try {
        await deleteImage(filename);
        setImages((prev) => prev.filter((f) => f !== filename));
        setSelectedImages((prev) => prev.filter((f) => f !== filename));
        setImageLabels((prev) => {
          const updated = { ...prev };
          delete updated[filename];
          return updated;
        });
        updateSelectionCallback(selectedImages.filter((f) => f !== filename));
      } catch (err) {
        console.error("Error deleting image", err);
      }
      setDeletingImage(null);
    }, 300); 
  };

  const toggleSelection = (filename: string) => {
    setSelectedImages((prev) => {
      let newSelected: string[] = [];
      if (prev.includes(filename)) {
        newSelected = prev.filter((f) => f !== filename);
      } else {
        newSelected = [...prev, filename];
      }
      updateSelectionCallback(newSelected);
      return newSelected;
    });
  };

  const handleLabelChange = (filename: string, newLabel: string) => {
    setImageLabels((prev) => ({ ...prev, [filename]: newLabel }));
  };

  const handleLabelBlur = async (filename: string) => {
    const newLabel = imageLabels[filename];
    let newFilename = newLabel.toLowerCase().endsWith(".png") ? newLabel : newLabel + ".png";
    if (newFilename === filename) return;
    try {
      const result = await renameImage(filename, newFilename);
      console.log(result.message);
      setImages((prev) => prev.map((f) => (f === filename ? newFilename : f)));
      setImageLabels((prev) => {
        const updated = { ...prev };
        delete updated[filename];
        updated[newFilename] = newLabel;
        return updated;
      });
      setSelectedImages((prev) => prev.map((f) => (f === filename ? newFilename : f)));
      updateSelectionCallback(
        selectedImages.map((f) => (f === filename ? newFilename : f)),
        { ...imageLabels, [newFilename]: newLabel }
      );
    } catch (err) {
      console.error("Error renaming image:", err);
    }
  };

  const handleImageLoad = (index: number) => {
    const newImageLoaded = [...imageLoaded];
    newImageLoaded[index] = true;
    setImageLoaded(newImageLoaded);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-48">
        <ArrowPathIcon className="animate-spin w-12 h-12 text-gray-500" />
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {images.map((filename, index) => {
        const isSelected = selectedImages.includes(filename);
        const isDeleting = deletingImage === filename;

        return (
          <div
            key={filename}
            className={`relative w-full h-48 overflow-hidden rounded-lg shadow-lg border-4 transition-all duration-500 ease-in-out ${
              isSelected ? "border-green-500" : "border-transparent"
            } ${isDeleting ? "opacity-0 scale-95" : ""}`}
          >
            <img
              src={`/images/${filename}`}
              alt={filename}
              className="w-full h-full object-cover transition-all duration-500 ease-in-out"
              onLoad={() => handleImageLoad(index)}
              onClick={() => toggleSelection(filename)}
            />
            <button
              onClick={() => handleDelete(filename)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg focus:outline-none"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={imageLabels[filename]}
              onChange={(e) => handleLabelChange(filename, e.target.value)}
              onBlur={() => handleLabelBlur(filename)}
              className="absolute bottom-2 left-2 bg-black bg-opacity-75 px-2 py-1 text-xs rounded outline-none"
            />
          </div>
        );
      })}
    </div>
  );
};

export default ImagesGrid;
