import styles from "../styles/KanbanBoard.module.css";
import KanbanColumn from "./KanbanColumn";
import { useState } from "react";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../context/useAuth.js";
import { DragDropProvider } from "@dnd-kit/react";
const KanbanBoard = ({ tasks = [], onTaskStatusChange }) => {
  const { user } = useAuth();

  const [error, setError] = useState("");

  const todoTasks = tasks.filter((task) => task.status === "todo");

  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");

  const completedTasks = tasks.filter((task) => task.status === "completed");

  const handleDragEnd = async ({ operation }) => {
    const { source, target } = operation;

    if (!source || !target) {
      return;
    }

    const taskId = source.id;
    const newStatus = target.id;

    const task = tasks.find((task) => task._id === taskId);

    if (!task || task.status === newStatus) {
      return;
    }

    try {
      const { response, data } = await apiRequest(`/tasks/${taskId}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        setError(data.message || "Failed to update task status");
        return;
      }

      onTaskStatusChange(taskId, data.task.status);
    } catch (error) {
      console.error("Error updating task status", error);
      setError("Something went wrong while updating the task");
    }
  };

  return (
    <div>
      {error && <p>{error}</p>}
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className={styles.board}>
          <KanbanColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            userId={user?.userId}
          />

          <KanbanColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressTasks}
            userId={user?.userId}
          />

          <KanbanColumn
            title="Completed"
            status="completed"
            tasks={completedTasks}
            userId={user?.userId}
          />
        </div>
      </DragDropProvider>
    </div>
  );
};

export default KanbanBoard;
