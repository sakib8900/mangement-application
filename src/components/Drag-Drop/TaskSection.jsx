import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";

export default function TaskSection() {
    const {user} = useContext(AuthContext)
    console.log(user)
  // Initial task list
  const initialTasks = [
    { id: "1", title: "📌 Complete Assignment" },
    { id: "2", title: "🚀 Learn Drag & Drop" },
    { id: "3", title: "✅ Push Code to GitHub" },
  ];

  const [characters, updateCharacters] = useState(initialTasks);

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(characters);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateCharacters(items);
  }

  return (
    <section className="p-6 bg-gray-100 rounded-md shadow-md w-96">
      <h2 className="text-xl font-bold mb-4">📝 Task Manager</h2>

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId="tasksList">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="bg-white p-4 rounded-md shadow-md"
            >
              {characters.map(({ id, title }, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="bg-blue-200 p-3 my-2 rounded cursor-pointer shadow"
                    >
                      {title}
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder} {/* Placeholder while dragging */}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}
