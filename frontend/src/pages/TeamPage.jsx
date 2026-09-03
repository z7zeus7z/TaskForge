import styles from "../styles/TeamPage.module.css";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Search, FolderKanban, ListTodo } from "lucide-react";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../context/useAuth.js";

const TeamPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { response, data } = await apiRequest("/projects");

        if (!response.ok) {
          setError(data.message || "Failed to load teams");
          return;
        }

        setProjects(data.projects || []);
      } catch (error) {
        console.error("Error fetching teams", error);
        setError("Something went wrong while loading your teams");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const myTeams = useMemo(() => {
    return projects.filter((project) => {
      const isOwner = project.projectOwner?._id === user?.userId;

      const isMember = project.projectMembers?.some(
        (member) => member._id === user?.userId,
      );

      return isOwner || isMember;
    });
  }, [projects, user]);

  const filteredTeams = useMemo(() => {
    return myTeams.filter((project) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        project.projectName.toLowerCase().includes(searchValue) ||
        project.projectDescription.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "all" || project.projectStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [myTeams, search, statusFilter]);

  const formatStatus = (status) => {
    if (status === "in-progress") {
      return "In Progress";
    }

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>Loading your teams...</p>
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
          <h1>Teams</h1>
          <p>View the teams and projects you're working with.</p>
        </div>

        <div className={styles.teamCount}>
          <Users size={20} />
          <span>
            {myTeams.length} {myTeams.length === 1 ? "Team" : "Teams"}
          </span>
        </div>
      </header>

      <section className={styles.controls}>
        <div className={styles.search}>
          <Search size={18} />

          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="hold">On Hold</option>
          <option value="inactive">Inactive</option>
        </select>
      </section>

      {filteredTeams.length === 0 ? (
        <div className={styles.empty}>
          <Users size={40} />

          <h3>No teams found</h3>

          <p>
            {myTeams.length === 0
              ? "You are not part of any teams yet."
              : "Try changing your search or filter."}
          </p>
        </div>
      ) : (
        <section className={styles.teamGrid}>
          {filteredTeams.map((project) => {
            const members = project.projectMembers || [];
            const tasks = project.projectTasks || [];

            const ownerName = project.projectOwner
              ? `${project.projectOwner.fname} ${project.projectOwner.lname}`
              : "Unknown";

            return (
              <article
                key={project._id}
                className={styles.teamCard}
                onClick={() => navigate(`/projects/${project._id}`)}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.teamIcon}>
                    <FolderKanban size={21} />
                  </div>

                  <span
                    className={`${styles.status} ${
                      styles[project.projectStatus]
                    }`}
                  >
                    {formatStatus(project.projectStatus)}
                  </span>
                </div>

                <div className={styles.teamInfo}>
                  <h2>{project.projectName}</h2>

                  <p>{project.projectDescription}</p>
                </div>

                <div className={styles.owner}>
                  <span>Owner</span>

                  <strong>{ownerName}</strong>
                </div>

                <div className={styles.members}>
                  <div className={styles.membersHeader}>
                    <span>Members</span>
                    <strong>{members.length}</strong>
                  </div>

                  <div className={styles.memberList}>
                    {members.length === 0 ? (
                      <span className={styles.noMembers}>No members yet</span>
                    ) : (
                      <>
                        {members.slice(0, 4).map((member) => (
                          <div
                            key={member._id}
                            className={styles.member}
                            title={`${member.fname} ${member.lname}`}
                          >
                            {member.fname?.charAt(0)}
                            {member.lname?.charAt(0)}
                          </div>
                        ))}

                        {members.length > 4 && (
                          <div className={styles.moreMembers}>
                            +{members.length - 4}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <div>
                    <ListTodo size={16} />
                    <span>
                      {tasks.length} {tasks.length === 1 ? "Task" : "Tasks"}
                    </span>
                  </div>

                  <span className={styles.viewTeam}>View Team →</span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default TeamPage;
