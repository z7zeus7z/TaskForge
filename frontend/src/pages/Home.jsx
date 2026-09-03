import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { FolderKanban, ListTodo, CheckCircle2, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { user } = useAuth();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { response, data } = await apiRequest("/projects");

        if (!response.ok) {
          setError(data.message || "Failed to load projects");
          return;
        }

        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects", error);
        setError("Something went wrong while loading your projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const allTasks = projects.flatMap((project) => project.projectTasks || []);

  const completedTasks = allTasks.filter((task) => task.status === "completed");

  const completionPercentage =
    allTasks.length === 0
      ? 0
      : Math.round((completedTasks.length / allTasks.length) * 100);

  const upcomingTasks = [...allTasks]
    .filter(
      (task) =>
        task.status !== "completed" && task.assignedTo?._id === user?.userId,
    )
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const recentProjects = projects.slice(0, 5);

  if (loading) {
    return (
      <div className={styles.home}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.home}>
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <div>
          <h1>Welcome back 👋</h1>
          <p>Here's an overview of your projects and tasks.</p>
        </div>
      </header>

      <section className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FolderKanban size={22} />
          </div>

          <div>
            <p>Total Projects</p>
            <strong>{projects.length}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <ListTodo size={22} />
          </div>

          <div>
            <p>Total Tasks</p>
            <strong>{allTasks.length}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle2 size={22} />
          </div>

          <div>
            <p>Completed Tasks</p>
            <strong>{completedTasks.length}</strong>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <TrendingUp size={22} />
          </div>

          <div>
            <p>Overall Progress</p>
            <strong>{completionPercentage}%</strong>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.projectsSection}>
          <div className={styles.sectionHeader}>
            <h2>Recent Projects</h2>
            <button type="button" onClick={() => navigate("/projects")}>
              View all
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className={styles.empty}>
              <p>You don't have any projects yet.</p>
            </div>
          ) : (
            <div className={styles.projectList}>
              {recentProjects.map((project) => {
                const projectTasks = project.projectTasks || [];

                const completedProjectTasks = projectTasks.filter(
                  (task) => task.status === "completed",
                );

                const projectProgress =
                  projectTasks.length === 0
                    ? 0
                    : Math.round(
                        (completedProjectTasks.length / projectTasks.length) *
                          100,
                      );

                return (
                  <button
                    key={project._id}
                    type="button"
                    className={styles.projectCard}
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <div className={styles.projectTop}>
                      <div>
                        <h3>{project.projectName}</h3>
                        <p>{project.projectDescription}</p>
                      </div>

                      <span className={styles.status}>
                        {project.projectStatus}
                      </span>
                    </div>

                    <div className={styles.projectBottom}>
                      <span>
                        {projectTasks.length}{" "}
                        {projectTasks.length === 1 ? "Task" : "Tasks"}
                      </span>

                      <span>{projectProgress}% complete</span>
                    </div>

                    <div className={styles.progress}>
                      <div
                        className={styles.progressBar}
                        style={{ width: `${projectProgress}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={styles.tasksSection}>
          <div className={styles.sectionHeader}>
            <h2>Upcoming Tasks</h2>
          </div>

          {upcomingTasks.length === 0 ? (
            <div className={styles.empty}>
              <p>No upcoming tasks.</p>
            </div>
          ) : (
            <div className={styles.taskList}>
              {upcomingTasks.map((task) => (
                <div key={task._id} className={styles.taskCard}>
                  <div>
                    <h3>{task.title}</h3>

                    <p>
                      Due{" "}
                      {new Date(task.dueDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <span
                    className={`${styles.priority} ${styles[task.priority]}`}
                  >
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
