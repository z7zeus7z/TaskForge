import styles from "../styles/Sidebar.module.css";
import {
  House,
  Briefcase,
  CodeXml,
  Users,
  UserRoundArrowLeft,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  //handlers
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      <div className={styles.sidebarContainer}>
        <div className={styles.logo}>TaskForge</div>
        <div className={styles.sidebarLinks}>
          <div className={styles.workSpace}>
            <div className={styles.home}>
              <Link to="/">
                <House size={20} />
                <p>Home</p>
              </Link>
            </div>
            <div className={styles.projects}>
              <Link to="/projects">
                <Briefcase size={20} />
                <p>Projects</p>
              </Link>
            </div>
            <div className={styles.tasks}>
              <Link to="/myTasks">
                <CodeXml size={20} />
                <p>My Tasks</p>
              </Link>
            </div>
            <div className={styles.teams}>
              <Link to="/teams">
                <Users size={20} />
                <p>Teams</p>
              </Link>
            </div>
          </div>
          <div className={styles.management}>
            <div className={styles.profile}>
              <Link to="/profile">
                <UserRoundArrowLeft size={20} />
                <p>My Profile</p>
              </Link>
            </div>

            <button onClick={handleLogout} className={styles.logOut}>
              <LogOut size={20} />
              <p>Log out</p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
