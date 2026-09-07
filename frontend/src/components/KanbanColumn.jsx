import styles from "../styles/KanbanColumn.module.css";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/react";
const KanbanColumn = ({
  title,
  status,
  tasks = [],

  userId,
}) => {
  const { ref } = useDroppable({
    id: status,
  });
  return (
    <div className={styles.column} ref={ref}>
      <div className={styles.columnHeader}>
        <h3>{title}</h3>
        <span>{tasks.length}</span>
      </div>

      <div className={styles.tasks}>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isDraggable={task.assignedTo?._id === userId}
            />
          ))
        ) : (
          <p className={styles.emptyMessage}>No tasks yet</p>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
