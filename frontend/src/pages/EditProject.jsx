import styles from "../styles/EditProject.module.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { apiRequest } from "../services/api.js";

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    projectStartDate: "",
    projectEndDate: "",
    projectStatus: "active",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { response, data } = await apiRequest(`/projects/${projectId}`);

        if (!response.ok) {
          setError(data.message || "Failed to load project");
          return;
        }

        const project = data.project;

        setFormData({
          projectName: project.projectName || "",
          projectDescription: project.projectDescription || "",
          projectStartDate: project.projectStartDate
            ? project.projectStartDate.split("T")[0]
            : "",
          projectEndDate: project.projectEndDate
            ? project.projectEndDate.split("T")[0]
            : "",
          projectStatus: project.projectStatus || "active",
        });
      } catch (error) {
        console.error("Error fetching project", error);
        setError("Something went wrong while loading the project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const { response, data } = await apiRequest(`/projects/${projectId}`, {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        setError(data.message || "Failed to update project");
        return;
      }

      navigate(`/projects/${projectId}`);
    } catch (error) {
      console.error("Error updating project", error);
      setError("Something went wrong while updating the project");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>Loading project...</p>
      </div>
    );
  }

  if (error && !formData.projectName) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error}</p>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(`/projects/${projectId}`)}
        >
          <ArrowLeft size={17} />
          Back to project
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <button
        type="button"
        className={styles.backButton}
        onClick={() => navigate(`/projects/${projectId}`)}
      >
        <ArrowLeft size={17} />
        Back to project
      </button>

      <div className={styles.header}>
        <div>
          <h1>Edit Project</h1>
          <p>Update your project information and settings.</p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.field}>
          <label htmlFor="projectName">Project Name</label>

          <input
            id="projectName"
            name="projectName"
            type="text"
            value={formData.projectName}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="projectDescription">Project Description</label>

          <textarea
            id="projectDescription"
            name="projectDescription"
            value={formData.projectDescription}
            onChange={handleChange}
            rows="5"
            required
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="projectStartDate">Start Date</label>

            <input
              id="projectStartDate"
              name="projectStartDate"
              type="date"
              value={formData.projectStartDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="projectEndDate">End Date</label>

            <input
              id="projectEndDate"
              name="projectEndDate"
              type="date"
              value={formData.projectEndDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="projectStatus">Project Status</label>

          <select
            id="projectStatus"
            name="projectStatus"
            value={formData.projectStatus}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="hold">On Hold</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={() => navigate(`/projects/${projectId}`)}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" className={styles.saveButton} disabled={saving}>
            <Save size={17} />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProject;
