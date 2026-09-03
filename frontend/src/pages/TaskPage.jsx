import styles from "../styles/TaskPage.module.css";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../context/useAuth.js";
import { ListTodo, Circle, Clock3, CheckCircle2, Search } from "lucide-react";

const TaskPage = () => {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { response, data } = await apiRequest("/projects");

        if (!response.ok) {
          setError(data.message || "Failed to load tasks");
          return;
        }

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching projects", error);
        setError("Something went wrong while loading your tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const myTasks = useMemo(() => {
    const allTasks = projects.flatMap((project) =>
      (project.projectTasks || []).map((task) => ({
        ...task,
        projectName: project.projectName,
        projectId: project._id,
      })),
    );

    return allTasks.filter((task) => task.assignedTo?._id === user?.userId);
  }, [projects, user]);

  const todoTasks = myTasks.filter((task) => task.status === "todo");

  const inProgressTasks = myTasks.filter(
    (task) => task.status === "in-progress",
  );

  const completedTasks = myTasks.filter((task) => task.status === "completed");

  const availableProjects = [
    ...new Map(
      myTasks.map((task) => [
        task.projectId,
        {
          id: task.projectId,
          name: task.projectName,
        },
      ]),
    ).values(),
  ];

  const filteredTasks = myTasks
    .filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || task.priority === priorityFilter;

      const matchesProject =
        projectFilter === "all" || task.projectId === projectFilter;

      return (
        matchesSearch && matchesStatus && matchesPriority && matchesProject
      );
    })
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  const formatStatus = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    if (status === "todo") {
      return "To Do";
    }

    return "Completed";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>Loading your tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>My Tasks</h1>
          <p>View and track the tasks assigned to you.</p>
        </div>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ListTodo size={21} />
          </div>

          <div>
            <p>Total Tasks</p>
            <strong>{myTasks.length}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Circle size={21} />
          </div>

          <div>
            <p>To Do</p>
            <strong>{todoTasks.length}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock3 size={21} />
          </div>

          <div>
            <p>In Progress</p>
            <strong>{inProgressTasks.length}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle2 size={21} />
          </div>

          <div>
            <p>Completed</p>
            <strong>{completedTasks.length}</strong>
          </div>
        </div>
      </section>

      <section className={styles.tasksSection}>
        <div className={styles.filters}>
          <div className={styles.search}>
            <Search size={18} />

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
          >
            <option value="all">All Projects</option>

            {availableProjects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.taskHeader}>
          <h2>Tasks</h2>
          <span>
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {filteredTasks.length === 0 ? (
          <div className={styles.empty}>
            <ListTodo size={36} />

            <h3>No tasks found</h3>

            <p>
              {myTasks.length === 0
                ? "You don't have any tasks assigned to you yet."
                : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <div className={styles.taskList}>
            {filteredTasks.map((task) => (
              <div key={task._id} className={styles.taskCard}>
                <div className={styles.taskMain}>
                  <div className={styles.taskTitle}>
                    <h3>{task.title}</h3>

                    <span
                      className={`${styles.priority} ${styles[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  <p className={styles.description}>{task.description}</p>

                  <div className={styles.taskMeta}>
                    <span>{task.projectName}</span>

                    <span>Due {formatDate(task.dueDate)}</span>
                  </div>
                </div>

                <span className={`${styles.status} ${styles[task.status]}`}>
                  {formatStatus(task.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TaskPage;
