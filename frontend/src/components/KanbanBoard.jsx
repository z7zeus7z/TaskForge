import styles from "../styles/KanbanBoard.module.css";
import KanbanColumn from "./KanbanColumn";
import { useState } from "react";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../context/useAuth.js";

const KanbanBoard = ({ tasks = [], onTaskStatusChange }) => {
  const { user } = useAuth();

  const [draggedTask, setDraggedTask] = useState(null);
  const [error, setError] = useState("");

  const todoTasks = tasks.filter((task) => task.status === "todo");

  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");

  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleDragStart = (task) => {
    const isAssignedToUser = task.assignedTo?._id === user?.userId;

    if (!isAssignedToUser) {
      return;
    }

    setDraggedTask(task);
    setError("");
  };

  const handleDrop = async (newStatus) => {
    if (!draggedTask) {
      return;
    }

    if (draggedTask.status === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      const { response, data } = await apiRequest(
        `/tasks/${draggedTask._id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            status: newStatus,
          }),
        },
      );

      if (!response.ok) {
        setError(data.message || "Failed to update task status");
        setDraggedTask(null);
        return;
      }

      onTaskStatusChange(draggedTask._id, data.task.status);
      setDraggedTask(null);
    } catch (error) {
      console.error("Error updating task status", error);
      setError("Something went wrong while updating the task");
      setDraggedTask(null);
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}

      <div className={styles.board}>
        <KanbanColumn
          title="To Do"
          status="todo"
          tasks={todoTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          userId={user?.userId}
        />

        <KanbanColumn
          title="In Progress"
          status="in-progress"
          tasks={inProgressTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          userId={user?.userId}
        />

        <KanbanColumn
          title="Completed"
          status="completed"
          tasks={completedTasks}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          userId={user?.userId}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
