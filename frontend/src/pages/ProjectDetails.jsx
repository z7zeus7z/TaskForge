import styles from "../styles/ProjectDetails.module.css";
import AddTaskModal from "../components/AddTaskModal.jsx";
import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { apiRequest } from "../services/api.js";
import { useAuth } from "../context/useAuth.js";
import KanbanBoard from "../components/KanbanBoard.jsx";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { response, data } = await apiRequest("/users");

        if (!response.ok) {
          setError(data.message || "Failed to load users");
          return;
        }

        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching Users", error);
        setError("Something went wrong while loading users");
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { response, data } = await apiRequest(`/projects/${projectId}`);

        if (!response.ok) {
          setError(data.message || "Failed to load project");
          return;
        }

        setProject(data.project);
      } catch (error) {
        console.error("Error fetching project", error);
        setError("Something went wrong while loading the project");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const handleAddMemberToggle = () => {
    setIsAddMemberOpen((prev) => !prev);
  };

  const handleAddTaskToggle = () => {
    setIsAddTaskOpen((prev) => !prev);
  };

  const handleUserSelect = (e) => {
    setSelectedUser(e.target.value);
  };
  const handleTaskAdded = (newTask) => {
    setProject((prev) => ({
      ...prev,
      projectTasks: [...prev.projectTasks, newTask],
    }));
  };
  const handleAddMember = async () => {
    if (!selectedUser) {
      return;
    }
    try {
      const { response, data } = await apiRequest(
        `/projects/${projectId}/members`,
        {
          method: "POST",
          body: JSON.stringify({
            userId: selectedUser,
          }),
        },
      );
      if (!response.ok) {
        alert(data.message || "Failed to add member");
        return;
      }
      setProject(data.updatedProject);
      setSelectedUser("");
    } catch (error) {
      console.error("Error adding member", error);
      setError("Something went wrong while adding the member");
    }
  };
  const handleTaskStatusChange = (taskId, newStatus) => {
    setProject((prev) => ({
      ...prev,
      projectTasks: prev.projectTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task,
      ),
    }));
  };
  if (loading) {
    return (
      <div className={styles.layout}>
        <p>Loading project...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.layout}>
        <p>{error}</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className={styles.layout}>
        <p>Project not found.</p>
      </div>
    );
  }
  const isOwner = project.projectOwner._id === user?.userId;
  const completedTasks = project.projectTasks.filter(
    (task) => task.status === "completed",
  );

  const totalTasks = project.projectTasks.length;

  const completionPercentage =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks.length / totalTasks) * 100);

  const availableUsers = users.filter(
    (user) => !project.projectMembers.some((member) => member._id === user._id),
  );

  return (
    <div className={styles.layout}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.projectName}>{project.projectName}</h2>

          <p className={styles.projectDescription}>
            {project.projectDescription}
          </p>
        </div>

        <p className={styles.projectStatus}>{project.projectStatus}</p>

        <div className={styles.projectDate}>
          <p>
            Start Date:{" "}
            {new Date(project.projectStartDate).toLocaleDateString()}
          </p>

          <p>
            End Date: {new Date(project.projectEndDate).toLocaleDateString()}
          </p>
        </div>

        <div className={styles.menu}></div>
      </div>

      <div className={styles.projectOverview}>
        <div>
          <p>Members</p>
          <strong>{project.projectMembers.length}</strong>
        </div>

        <div>
          <p>Tasks</p>
          <strong>{totalTasks}</strong>
        </div>

        <div>
          <p>Completed Tasks</p>
          <strong>{completedTasks.length}</strong>
        </div>

        <div>
          <p>Progress</p>
          <strong>{completionPercentage}%</strong>
        </div>
      </div>

      <div className={styles.membersSection}>
        <div className={styles.membersHeader}>
          <h3>Project Members</h3>

          {isOwner && (
            <button type="button" onClick={handleAddMemberToggle}>
              Add Member
            </button>
          )}
        </div>

        {isAddMemberOpen && (
          <div className={styles.addMember}>
            <select value={selectedUser} onChange={handleUserSelect}>
              <option value="">Select a user</option>

              {availableUsers.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.fname} {user.lname} - {user.email}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleAddMember}
              disabled={!selectedUser}
            >
              Add
            </button>
          </div>
        )}

        <div className={styles.owner}>
          <p>Owner</p>

          <p>
            {project.projectOwner.fname} {project.projectOwner.lname}
          </p>

          <p>{project.projectOwner.email}</p>
        </div>

        <div className={styles.members}>
          {project.projectMembers.map((member) => (
            <div key={member._id}>
              <p>
                {member.fname} {member.lname}
              </p>

              <p>{member.email}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.tasksSection}>
        <div className={styles.tasksHeader}>
          <h3>Tasks</h3>

          <button type="button" onClick={handleAddTaskToggle}>
            Add Task
          </button>
        </div>
        <AddTaskModal
          isOpen={isAddTaskOpen}
          onClose={() => setIsAddTaskOpen(false)}
          projectId={projectId}
          members={project.projectMembers}
          onTaskAdded={handleTaskAdded}
        />
        <KanbanBoard
          tasks={project.projectTasks}
          onTaskStatusChange={handleTaskStatusChange}
        />
      </div>
    </div>
  );
};

export default ProjectDetails;
