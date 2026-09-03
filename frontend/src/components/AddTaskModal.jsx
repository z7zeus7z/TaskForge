import styles from "../styles/AddTasksModal.module.css";
import { useState } from "react";
import { apiRequest } from "../services/api.js";

const AddTaskModal = ({ isOpen, onClose, projectId, members, onTaskAdded }) => {
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.target);

    formData.append("project", projectId);

    const taskData = {
      title: formData.get("title"),
      description: formData.get("description"),
      status: formData.get("status"),
      priority: formData.get("priority"),
      assignedTo: formData.get("assignedTo") || undefined,
      project: formData.get("project"),
      dueDate: formData.get("dueDate"),
    };

    try {
      const { response, data } = await apiRequest("/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        setError(data.message || "Failed to create task");
        return;
      }

      onTaskAdded(data.task);
      e.target.reset();
      onClose();
    } catch (error) {
      console.error("Error creating task", error);
      setError("Something went wrong while creating the task");
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Add Task</h3>

          <button type="button" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <p>{error}</p>}

          <label>
            Task Title
            <input
              type="text"
              name="title"
              placeholder="Enter task title"
              required
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              placeholder="Enter task description"
              required
            />
          </label>

          <label>
            Status
            <select name="status" defaultValue="todo">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>

          <label>
            Priority
            <select name="priority" defaultValue="medium">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label>
            Assign To
            <select name="assignedTo" defaultValue="">
              <option value="">Unassigned</option>

              {members.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.fname} {member.lname}
                </option>
              ))}
            </select>
          </label>

          <label>
            Due Date
            <input type="date" name="dueDate" required />
          </label>

          <div className={styles.actions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit">Add Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
