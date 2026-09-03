import styles from "../styles/KanbanColumn.module.css";
import TaskCard from "./TaskCard";

const KanbanColumn = ({
  title,
  status,
  tasks = [],
  onDragStart,
  onDrop,
  userId,
}) => {
  return (
    <div
      className={styles.column}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => onDrop(status)}
    >
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
              onDragStart={onDragStart}
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
