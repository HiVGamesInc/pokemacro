import { FC, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensor,
  MouseSensor,
  KeyboardSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import SortableItem from "./SortableItem";
import { Combo } from "../../types/types";
import colors from "tailwindcss/colors";

type ComboListType = {
  combo: Combo;
  onRemove: (index: number) => void;
  onReorder?: (newOrder: any[]) => void;
};

const ComboList: FC<ComboListType> = ({ combo, onRemove, onReorder }) => {
  // We assume each move has a unique id. If not, generate one using index.
  const initialItems =
    combo.moveList?.map((item, index) => ({
      ...item,
      id: item.delay ? `delay-${index}` : `skill-${index}`,
    })) || [];

  const [items, setItems] = useState(initialItems);

  // If the combo prop changes, update our local state
  useEffect(() => {
    setItems(
      (combo.moveList || []).map((item, index) => ({
        ...item,
        id: item.delay ? `delay-${index}` : `skill-${index}`,
      }))
    );
  }, [combo.moveList]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id && over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      setItems(newItems);

      // If a reorder callback was provided, call it with the new list
      onReorder && onReorder(newItems);
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(mouseSensor, keyboardSensor);

  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="min-h-32 flex flex-col gap-2 justify-center p-4 border border-dashed border-slate-500 mb-4 rounded-lg duration-100 text-center">
          {items.length ? (
            items.map((item, index) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                onRemove={() => onRemove(index)}
                {...(item.delay && {
                  style: { backgroundColor: colors.slate[900] },
                })}
              />
            ))
          ) : (
            <div className="text-sm text-slate-300">No moves added yet</div>
          )}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ComboList;
