import styles from "../styles/ProfilePage.module.css";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth.js";
import { apiRequest } from "../services/api.js";
import {
  UserRound,
  Mail,
  ShieldCheck,
  FolderKanban,
  ListTodo,
  CheckCircle2,
} from "lucide-react";

const ProfilePage = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileResult, projectsResult] = await Promise.all([
          apiRequest("/profile"),
          apiRequest("/projects"),
        ]);

        if (!profileResult.response.ok) {
          setError(profileResult.data.message || "Failed to load profile");
          return;
        }

        setUser(profileResult.data.user);

        if (projectsResult.response.ok) {
          setProjects(projectsResult.data.projects || []);
        }
      } catch (error) {
        console.error("Error fetching profile", error);
        setError("Something went wrong while loading your profile");
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.userId) {
      fetchProfile();
    } else {
      setLoading(false);
      setError("You must be logged in to view your profile");
    }
  }, [authUser]);

  const myProjects = projects.filter((project) => {
    const isOwner = project.projectOwner?._id === authUser?.userId;

    const isMember = project.projectMembers?.some(
      (member) => member._id === authUser?.userId,
    );

    return isOwner || isMember;
  });

  const allTasks = myProjects.flatMap((project) => project.projectTasks || []);

  const myTasks = allTasks.filter(
    (task) => task.assignedTo?._id === authUser?.userId,
  );

  const completedTasks = myTasks.filter((task) => task.status === "completed");

  const formatRole = (role) => {
    if (!role) return "";

    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <p className={styles.message}>Loading profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className={styles.page}>
        <p className={styles.error}>{error || "Unable to load profile"}</p>
      </div>
    );
  }

  const initials =
    `${user.fname?.charAt(0) || ""}${user.lname?.charAt(0) || ""}`.toUpperCase();

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Profile</h1>
          <p>View your account information and activity.</p>
        </div>
      </header>

      <section className={styles.profileCard}>
        <div className={styles.avatar}>{initials}</div>

        <div className={styles.profileInfo}>
          <h2>
            {user.fname} {user.lname}
          </h2>

          <p className={styles.email}>
            <Mail size={16} />
            {user.email}
          </p>

          <span className={styles.role}>
            <ShieldCheck size={15} />
            {formatRole(user.role)}
          </span>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.infoSection}>
          <div className={styles.sectionHeader}>
            <h2>Account Information</h2>
            <UserRound size={20} />
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span>First Name</span>
              <strong>{user.fname}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Last Name</span>
              <strong>{user.lname}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Role</span>
              <strong>{formatRole(user.role)}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Member Since</span>
              <strong>{formatDate(user.createdAt)}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Last Updated</span>
              <strong>{formatDate(user.updatedAt)}</strong>
            </div>
          </div>
        </div>

        <div className={styles.activitySection}>
          <div className={styles.sectionHeader}>
            <h2>My Activity</h2>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <FolderKanban size={21} />
              </div>

              <div>
                <span>Projects</span>
                <strong>{myProjects.length}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <ListTodo size={21} />
              </div>

              <div>
                <span>Tasks</span>
                <strong>{myTasks.length}</strong>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <CheckCircle2 size={21} />
              </div>

              <div>
                <span>Completed</span>
                <strong>{completedTasks.length}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
