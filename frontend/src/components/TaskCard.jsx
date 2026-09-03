import styles from "../styles/TaskCard.module.css";
import { CalendarDays, UserRound } from "lucide-react";

const TaskCard = ({ task, onDragStart, isDraggable }) => {
  const formattedDate = new Date(task.dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const assignedUser = task.assignedTo
    ? `${task.assignedTo.fname} ${task.assignedTo.lname}`
    : "Unassigned";

  return (
    <div
      className={styles.card}
      draggable={isDraggable}
      onDragStart={() => {
        if (isDraggable) {
          onDragStart(task);
        }
      }}
    >
      <div className={styles.header}>
        <h4>{task.title}</h4>

        <span className={`${styles.priority} ${styles[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      <p className={styles.description}>{task.description}</p>

      <div className={styles.info}>
        <div className={styles.infoItem}>
          <UserRound size={15} />
          <span>{assignedUser}</span>
        </div>

        <div className={styles.infoItem}>
          <CalendarDays size={15} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
