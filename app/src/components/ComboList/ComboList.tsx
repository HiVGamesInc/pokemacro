import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "../Card/Card";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Combo } from "../../types/types";
import { FC } from "react";

type ComboListType = {
  combo: Combo;
  onRemove: (index: number) => void;
};

const ComboList: FC<ComboListType> = ({ combo, onRemove }) => {
  return (
    <div className="min-h-16">
      <Droppable droppableId="droppable-0">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {combo.itemList.map((item, index) => (
              <Draggable
                key={item.skillName}
                draggableId={item.skillName}
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      as="div"
                      key={item.skillName + index}
                      active={false}
                      className="my-4"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-md font-medium">
                            {item.skillName}
                          </div>
                          <div className="flex gap-4">
                            <div className="text-sm text-slate-300">
                              <span className="font-medium">Hotkey:</span>{" "}
                              {item.hotkey.map((k) => k.keyName).join("+")}
                            </div>
                            <div className="text-sm text-slate-300">
                              <span className="font-medium">Delay:</span>{" "}
                              {item.afterAttackDelay / 1000} segundos
                            </div>
                          </div>
                        </div>
                        <button onClick={() => onRemove(index)}>
                          <TrashIcon className="size-6 text-blue-500" />
                        </button>
                      </div>
                    </Card>
                  </div>
                )}
              </Draggable>
            ))}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ComboList;
