import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load Tasks from Backend
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:5000/tasks")
      .then((response) => {
        const validTasks = response.data.filter((task) => task._id);
        setTasks(validTasks);
        setLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching tasks:", error);
        // setLoading(false);
        // Swal.fire('Error', 'Failed to load tasks. Please refresh the page.', 'error');
      });
  }, [refreshKey]);
  const handleAddTask = async (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const description = form.description.value;
    const category = form.category.value;

    const newTask = {
      title,
      description,
      category,
      timestamp: new Date(),
      email: user?.email || "anonymous@example.com",
      displayName: user?.displayName || "Anonymous User",
    };

    try {
      const response = await axios.post("http://localhost:5000/tasks", newTask);
      if (response.data.insertedId) {
        setRefreshKey((prevKey) => prevKey + 1);
        document.getElementById("task-modal").close();
        Swal.fire("Success", "Task added successfully!", "success");
        form.reset();
      }
    } catch (error) {
      // console.error("Error adding task:", error);
      // Swal.fire('Error', 'Failed to add task. Please try again.', 'error');
    }
  };

  // Handle Edit Task
  const handleEditTask = (task) => {
    setEditingTask(task);
    document.getElementById("edit-modal").showModal();
  };

  // Handle Save Edited Task
  const handleSaveEditedTask = async (event) => {
    event.preventDefault();
    const form = event.target;
    const title = form.title.value;
    const description = form.description.value;
    const category = form.category.value;

    const updatedTask = {
      ...editingTask,
      title,
      description,
      category,
    };

    try {
      const response = await axios.put(
        `http://localhost:5000/tasks/${editingTask._id}`,
        updatedTask
      );
      if (response.data.modifiedCount > 0) {
        setTasks(
          tasks.map((task) =>
            task._id === editingTask._id ? updatedTask : task
          )
        );
        setEditingTask(null);
        document.getElementById("edit-modal").close();
        Swal.fire("Success", "Task updated successfully!", "success");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      // Swal.fire('Error', 'Failed to update task. Please try again.', 'error');
    }
  };

  // Handle Delete Task
  const handleDeleteTask = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(
            `http://localhost:5000/tasks/${id}`
          );
          if (response.data.deletedCount > 0) {
            setTasks(tasks.filter((task) => task._id !== id));
            Swal.fire("Deleted!", "Your task has been deleted.", "success");
          } else {
            console.log("Task not found or already deleted.");
            Swal.fire(
              "Note",
              "This task may have already been deleted.",
              "info"
            );
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          // Swal.fire('Error', 'Failed to delete task. Please try again.', 'error');
        }
      }
    });
  };

  // Handle Drag
  const handleDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const tasksCopy = [...tasks];
    // Get all tasks
    const sourceTasks = tasksCopy.filter(
      (task) => task.category === source.droppableId
    );

    if (source.index >= sourceTasks.length) {
      console.error("Invalid source index when dragging");
      return;
    }

    const draggedTask = sourceTasks[source.index];

    // Verify dragged task exists and has an ID
    if (!draggedTask || !draggedTask._id) {
      console.error("Invalid dragged task or missing ID");
      // Swal.fire('Error', 'Something went wrong during drag operation. Please refresh the page.', 'error');
      return;
    }

    // Update the dragged task's category if it changed
    if (source.droppableId !== destination.droppableId) {
      draggedTask.category = destination.droppableId;
      try {
        await axios.patch(
          `http://localhost:5000/tasks/${draggedTask._id}/category`,
          {
            category: destination.droppableId,
          }
        );
      } catch (error) {
        console.error("Error updating task category:", error);
        // Swal.fire('Error', 'Failed to update task category. Please try again.', 'error');
        setRefreshKey((prevKey) => prevKey + 1);
        return;
      }
    }
    tasksCopy.splice(tasksCopy.indexOf(sourceTasks[source.index]), 1);

    const destinationTasks = tasksCopy.filter(
      (task) => task.category === destination.droppableId
    );

    const validDestIndex = Math.min(destination.index, destinationTasks.length);
    destinationTasks.splice(validDestIndex, 0, draggedTask);

    // Reorder all tasks
    const updatedTasks = [
      ...tasksCopy.filter((task) => task.category !== destination.droppableId),
      ...destinationTasks,
    ];

    // Update order
    const categorizedTasks = {
      "To-Do": [],
      "In Progress": [],
      Done: [],
    };

    updatedTasks.forEach((task) => {
      if (task.category in categorizedTasks) {
        categorizedTasks[task.category].push(task);
      } else {
        task.category = "To-Do";
        categorizedTasks["To-Do"].push(task);
      }
    });

    const finalOrderedTasks = [];
    let orderCounter = 1;
    Object.keys(categorizedTasks).forEach((category) => {
      categorizedTasks[category].forEach((task, index) => {
        task.order = orderCounter++;
        finalOrderedTasks.push(task);
      });
    });

    setTasks(finalOrderedTasks);
    const tasksToUpdate = finalOrderedTasks
      .filter((task) => task._id)
      .map((task) => ({
        _id: task._id,
        order: task.order,
        category: task.category,
      }));

    // Send updated order to server
    try {
      await axios.put("http://localhost:5000/tasks/reorder", {
        updatedTasks: tasksToUpdate,
      });
    } catch (error) {
      console.error("Error updating task order:", error);
      // Swal.fire('Error', 'Failed to save task order. Please refresh and try again.', 'error');
      setRefreshKey((prevKey) => prevKey + 1);
    }
  };

  // Prepare tasks for display in kanban board
  const categories = {
    "To-Do": tasks.filter((task) => task.category === "To-Do"),
    "In Progress": tasks.filter((task) => task.category === "In Progress"),
    Done: tasks.filter((task) => task.category === "Done"),
  };
  
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-center">Manage Your Projects</h2>

      {/* Add Task Button */}
      <button
        className="btn btn-primary my-4"
        onClick={() => document.getElementById("task-modal").showModal()}
      >
        + Add Task
      </button>

      {/* Add Task Modal */}
      <dialog id="task-modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Add New Task</h3>
          <form onSubmit={handleAddTask} className="space-y-4">
            <input
              type="text"
              name="title"
              placeholder="Task Title"
              maxLength="50"
              className="input input-bordered w-full"
              required
            />
            <textarea
              name="description"
              placeholder="Task Description"
              maxLength="200"
              className="textarea textarea-bordered w-full"
            ></textarea>
            <select name="category" className="select select-bordered w-full">
              <option value="To-Do">To-Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
            <div className="modal-action">
              <button type="submit" className="btn btn-success">
                Add Task
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("task-modal").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      {/* Edit Task Modal */}
      <dialog id="edit-modal" className="modal">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Edit Task</h3>
          {editingTask && (
            <form onSubmit={handleSaveEditedTask} className="space-y-4">
              <input
                type="text"
                name="title"
                defaultValue={editingTask.title}
                placeholder="Task Title"
                maxLength="50"
                className="input input-bordered w-full"
                required
              />
              <textarea
                name="description"
                defaultValue={editingTask.description}
                placeholder="Task Description"
                maxLength="200"
                className="textarea textarea-bordered w-full"
              ></textarea>
              <select
                name="category"
                defaultValue={editingTask.category}
                className="select select-bordered w-full"
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <div className="modal-action">
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => document.getElementById("edit-modal").close()}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-16 w-16"></div>
        </div>
      ) : (
        /* Kanban Board with Drag and Drop */
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(categories).map((categoryName) => (
              <div key={categoryName} className="bg-base-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-4">{categoryName}</h3>
                <Droppable droppableId={categoryName}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[200px]"
                    >
                      {categories[categoryName].map((task, index) => (
                        <Draggable
                          key={task._id || `temp-${index}`}
                          draggableId={task._id || `temp-${index}`}
                          index={index}
                          isDragDisabled={!task._id}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card bg-base-100 shadow-lg p-4 mb-2 ${
                                snapshot.isDragging ? "opacity-70" : ""
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">
                                  {task.title}
                                </h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      task._id && handleDeleteTask(task._id)
                                    }
                                    className="text-red-500 hover:text-red-700"
                                    disabled={!task._id}
                                  >
                                    <FaTrash />
                                  </button>
                                  <button
                                    onClick={() =>
                                      task._id && handleEditTask(task)
                                    }
                                    className="text-blue-500 hover:text-blue-700"
                                    disabled={!task._id}
                                  >
                                    <FaEdit />
                                  </button>
                                </div>
                              </div>
                              <p className="my-2">{task.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="text-sm text-gray-500">
                                  {task.email}
                                </p>
                                <span
                                  className={`badge ${
                                    categoryName === "To-Do"
                                      ? "badge-warning"
                                      : categoryName === "In Progress"
                                      ? "badge-info"
                                      : "badge-success"
                                  }`}
                                >
                                  {categoryName}
                                </span>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}
    </div>
  );
};

export default Projects;
