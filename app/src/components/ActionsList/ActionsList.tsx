import { Draggable, Droppable } from "react-beautiful-dnd";
import Card from "../Card/Card";

const ActionsList = () => {
  return (
    <div className="w-48 min-h-16">
      <Droppable droppableId="droppable-0" isDropDisabled>
        {(provided, snapshot) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            <Draggable draggableId="action-1" index={0}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <Card as="div" active={false} className="my-4 w-full">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-md font-medium">Delay</div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </Draggable>
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default ActionsList;
