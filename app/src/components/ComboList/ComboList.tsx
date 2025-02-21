import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "../Card/Card";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Combo } from "../../types/types";
import { FC } from "react";

import colors from "tailwindcss/colors";

type ComboListType = {
  combo: Combo;
  onRemove: (index: number) => void;
};

const ComboList: FC<ComboListType> = ({ combo, onRemove }) => {
  return (
    <div>
      <Droppable droppableId="move-list">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="min-h-32 flex flex-col gap-4 justify-center p-4 border border-dashed border-slate-500 mb-4 rounded-lg duration-100 text-center"
            style={
              snapshot.isDraggingOver
                ? { backgroundColor: colors.gray[900] }
                : {}
            }
          >
            {provided.placeholder}
            {combo.moveList?.length ? (
              combo.moveList?.map((item, index) => {
                const ref = item.delay ? item.delay : item.skillName;
                const key = ref + index.toString();

                return (
                  <Draggable key={key} draggableId={key} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Card
                          as="div"
                          key={key + index}
                          active={false}
                          className="m-0"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-md font-medium">
                                {item.delay ? "Delay" : ref}
                              </div>
                              {item.hotkey && item.hotkey.length > 0 && (
                                <div className="flex gap-4">
                                  <div className="text-sm text-slate-300">
                                    <span className="font-medium">Hotkey:</span>{" "}
                                    {item.hotkey
                                      .map((k) => k.keyName)
                                      .join("+")}
                                  </div>
                                </div>
                              )}
                              {item.delay && (
                                <div className="flex gap-4">
                                  <div className="text-sm text-slate-300">
                                    {item.delay + " miliseconds"}
                                  </div>
                                </div>
                              )}
                            </div>
                            <button onClick={() => onRemove(index)}>
                              <TrashIcon className="size-5 text-red-500 hover:text-blue-100" />
                            </button>
                          </div>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                );
              })
            ) : (
              <div className="text-sm text-slate-300">No moves added yet</div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ComboList;
