import React, { useContext, useState } from "react";
import { AuthContext } from "../../providers/AuthProvider";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Loading from "../../Loader/Loading";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Projects = () => {
  const { user } = useContext(AuthContext);
  const [editingTask, setEditingTask] = useState(null);
  const queryClient = useQueryClient();

  // Fetch tasks query
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const response = await axios.get("https://management-application-backend.vercel.app/tasks");
      const allTasks = response.data;
      // Filter tasks by user email
      return allTasks.filter((task) => task.email === user?.email);
    },
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const response = await axios.post("https://management-application-backend.vercel.app/tasks", newTask);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
      document.getElementById("task-modal").close();
      Swal.fire("Success", "Task added successfully!", "success");
    },
  });

  // Edit task mutation
  const editTaskMutation = useMutation({
    mutationFn: async (updatedTask) => {
      const response = await axios.put(
        `https://management-application-backend.vercel.app/tasks/${updatedTask._id}`,
        updatedTask
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
      document.getElementById("edit-modal").close();
      Swal.fire("Success", "Task updated successfully!", "success");
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      const response = await axios.delete(
        `https://management-application-backend.vercel.app/tasks/${taskId}`
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
      Swal.fire("Deleted!", "Your task has been deleted.", "success");
    },
  });

  // Update task order mutation
  const updateTaskOrderMutation = useMutation({
    mutationFn: async (tasksToUpdate) => {
      const response = await axios.put("https://management-application-backend.vercel.app/tasks/reorder", {
        updatedTasks: tasksToUpdate,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  const handleAddTask = (event) => {
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
      email: user?.email,
      displayName: user?.displayName || "Anonymous User",
    };

    addTaskMutation.mutate(newTask);
    form.reset();
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    document.getElementById("edit-modal").showModal();
  };

  const handleSaveEditedTask = (event) => {
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

    editTaskMutation.mutate(updatedTask);
    setEditingTask(null);
  };

  const handleDeleteTask = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(id);
      }
    });
  };

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const tasksCopy = [...tasks];
    const sourceTasks = tasksCopy.filter(
      (task) => task.category === source.droppableId
    );

    if (source.index >= sourceTasks.length) return;

    const draggedTask = sourceTasks[source.index];
    if (!draggedTask || !draggedTask._id) return;

    if (source.droppableId !== destination.droppableId) {
      draggedTask.category = destination.droppableId;
    }

    tasksCopy.splice(tasksCopy.indexOf(sourceTasks[source.index]), 1);

    const destinationTasks = tasksCopy.filter(
      (task) => task.category === destination.droppableId
    );

    const validDestIndex = Math.min(destination.index, destinationTasks.length);
    destinationTasks.splice(validDestIndex, 0, draggedTask);

    const updatedTasks = [
      ...tasksCopy.filter((task) => task.category !== destination.droppableId),
      ...destinationTasks,
    ];

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
      categorizedTasks[category].forEach((task) => {
        task.order = orderCounter++;
        finalOrderedTasks.push(task);
      });
    });

    const tasksToUpdate = finalOrderedTasks
      .filter((task) => task._id)
      .map((task) => ({
        _id: task._id,
        order: task.order,
        category: task.category,
      }));

    updateTaskOrderMutation.mutate(tasksToUpdate);
    queryClient.setQueryData(["tasks", user?.email], finalOrderedTasks);
  };

  const categories = {
    "To-Do": tasks.filter((task) => task.category === "To-Do"),
    "In Progress": tasks.filter((task) => task.category === "In Progress"),
    Done: tasks.filter((task) => task.category === "Done"),
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-blue-700 font-bold text-center">
        Manage Your Projects
      </h2>

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
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={editTaskMutation.isPending}
                >
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
      {isLoading ? (
        <Loading></Loading>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(categories).map((categoryName) => (
              <div key={categoryName} className="bg-gray-400 rounded-lg p-4">
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
                          key={task._id}
                          draggableId={task._id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`card bg-gray-300 shadow-md hover:shadow-xl shadow-blue-500 p-4 mb-2 ${
                                snapshot.isDragging ? "opacity-70" : ""
                              }`}
                            >
                              <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">
                                  {task.title}
                                </h3>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleDeleteTask(task._id)}
                                    className="text-red-500 hover:text-red-700"
                                    disabled={deleteTaskMutation.isPending}
                                  >
                                    <FaTrash />
                                  </button>
                                  <button
                                    onClick={() => handleEditTask(task)}
                                    className="text-blue-500 hover:text-blue-700"
                                  >
                                    <FaEdit />
                                  </button>
                                </div>
                              </div>
                              <p className="my-2">{task.description}</p>
                              <p>{task.timestamp.split("T")[0]}</p>
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
