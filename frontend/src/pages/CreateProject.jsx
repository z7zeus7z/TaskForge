import styles from "../styles/CreateProject.module.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api.js";
const CreateProject = () => {
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    projectStartDate: "",
    projectEndDate: "",
  });
  const navigate = useNavigate();
  //HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const { response, data } = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        alert(data.message || "Failed to create project");
        return;
      }
      navigate("/projects");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <div className={styles.layout}>
        <form onSubmit={handleSubmit}>
          <div className={styles.header}>
            <h2>Create Project</h2>
            <p>start working with your team</p>
          </div>
          <div className={styles.field}>
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              name="projectName"
              id="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="projectDescription">Project Description</label>
            <textarea
              name="projectDescription"
              id="projectDescription"
              value={formData.projectDescription}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.dateInput}>
            <div className={styles.field}>
              <label htmlFor="projectStartDate">Start Date :</label>
              <input
                type="date"
                name="projectStartDate"
                id="projectStartDate"
                value={formData.projectStartDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="projectEndDate">End Date :</label>
              <input
                type="date"
                name="projectEndDate"
                id="projectEndDate"
                value={formData.projectEndDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.actionButtons}>
            <button type="submit">Create Project</button>
            <button type="button" onClick={() => navigate("/projects")}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
