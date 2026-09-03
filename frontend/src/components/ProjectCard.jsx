import styles from "../styles/ProjectCard.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { apiRequest } from "../services/api";
const ProjectCard = ({ project }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(`.${styles.actionButtons}`)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.projectName}"?`,
    );

    if (!confirmed) return;

    try {
      const { response, data } = await apiRequest(`/projects/${project._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        alert(data.message || "Failed to delete project");
        return;
      }

      navigate("/projects");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting project", error);
      alert("Something went wrong while deleting the project");
    }
  };
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardHeader}>
        <div className={styles.projectName}> {project.projectName} </div>
        <div className={styles.actionButtons}>
          <button
            type="button"
            onClick={handleMenuToggle}
            aria-label="Project options"
            aria-expanded={isMenuOpen}
          >
            <Ellipsis size={20} />
          </button>
          {isMenuOpen && (
            <div className={styles.dropdown}>
              <button
                type="button"
                onClick={() => navigate(`/projects/${project._id}/edit`)}
              >
                <Pencil size={15} /> <span>Edit project</span>
              </button>

              <div className={styles.dropdownDivider} />
              <button
                type="button"
                className={styles.deleteAction}
                onClick={handleDelete}
              >
                <Trash2 size={15} /> <span>Delete project</span>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={styles.projectDescription}>
        <p> {project.projectDescription} </p>
      </div>
      <div className={styles.ProjectInfo}>
        <p>
          Owner :{project.projectOwner.fname} {project.projectOwner.lname}
        </p>{" "}
        <p>Members: {project.projectMembers.length}</p>{" "}
        <p>Tasks: {project.projectTasks.length}</p>
      </div>
      <div className={styles.footer}>
        <Link to={`/projects/${project._id}`}>View project</Link>
      </div>
    </div>
  );
};
export default ProjectCard;
