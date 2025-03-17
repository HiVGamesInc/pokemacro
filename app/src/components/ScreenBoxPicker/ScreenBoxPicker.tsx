import { useState } from "react";
import Button from "../Button/Button";


export type ScreenBoxValue = {
    x_start: number | undefined,
    x_end: number | undefined,
    y_start: number | undefined,
    y_end: number | undefined
}

type SelectProps = {
  title?: string;
  className?: string;
  wrapperClassName?: string;
  value: ScreenBoxValue;
  onChange: (value: ScreenBoxValue) => void;
};


const ScreenBoxPicker = ({
  title,
  wrapperClassName,
  onChange,
  value,
}: SelectProps) => {
    const [selection, setSelection] = useState<any>(value);

    const startSelection = async () => {
        await fetch("/start-selection", { method: "POST" });
        // Poll the server for the selection result
        const interval = setInterval(async () => {
            const response = await fetch("/get-selection");
            const data = await response.json();
            if (data.selection) {
            onChange(data.selection);
            setSelection(data.selection);
            clearInterval(interval);
            }
        }, 1000); // Poll every second
    };

    
    return (
        <label
            className={`flex flex-col mt-4 ${wrapperClassName && wrapperClassName}`}
        >
            {title && <span className="min-w-12 text-xs mb-2">{title}</span>}
            <div className="relative">
                <div className="flex items-center gap-2">
                    <Button onClick={startSelection}>Select Area</Button>
                    {selection && (
                        <p>
                            X({selection.x_start} → {selection.x_end}), Y({selection.y_start} → {selection.y_end})
                        </p>
                    )}
                </div>
            </div>
        </label>
    );
};

export default ScreenBoxPicker;
