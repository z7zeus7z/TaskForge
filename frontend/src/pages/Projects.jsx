import styles from "../styles/Project.module.css";
import { Plus } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";
import { apiRequest } from "../services/api.js";
import { useNavigate } from "react-router-dom";
const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { response, data } = await apiRequest("/projects");
        if (!response.ok) {
          setError(data.message || "Failed to load  projects");
          return;
        }
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects", error);
        setError("Something went wrong while loading projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.header}>
          <h2>Projects</h2>
          <p>Explore and create projects.</p>
          <button onClick={() => navigate("/createProject")}>
            <Plus size={20} />
            Create project
          </button>
        </div>
        <div className={styles.projectsContainer}>
          {loading && <p>Loading projects...</p>}
          {!loading && error && <p>{error}</p>}
          {!loading && !error && projects.length === 0 && (
            <p>You don't have any projects yet.</p>
          )}
          {!loading &&
            !error &&
            projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
        </div>
      </div>
    </>
  );
};

export default Projects;
