import styles from "../styles/Sidebar.module.css";
import {
  House,
  Briefcase,
  CodeXml,
  Users,
  UserRoundArrowLeft,
  LogOut,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
const Sidebar = ({ isOpen, closeSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <>
      {" "}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={closeSidebar}
      />{" "}
      <div
        className={`${styles.sidebarContainer} ${isOpen ? styles.sidebarOpen : ""}`}
      >
        {" "}
        <div className={styles.sidebarHeader}>
          {" "}
          <div className={styles.logo}>TaskForge</div>{" "}
          <button
            className={styles.closeButton}
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            {" "}
            <X size={22} />{" "}
          </button>{" "}
        </div>{" "}
        <div className={styles.sidebarLinks}>
          {" "}
          <div className={styles.workSpace}>
            {" "}
            <div className={styles.home}>
              {" "}
              <Link to="/" onClick={closeSidebar}>
                {" "}
                <House size={20} /> <p>Home</p>{" "}
              </Link>{" "}
            </div>{" "}
            <div className={styles.projects}>
              {" "}
              <Link to="/projects" onClick={closeSidebar}>
                {" "}
                <Briefcase size={20} /> <p>Projects</p>{" "}
              </Link>{" "}
            </div>{" "}
            <div className={styles.tasks}>
              {" "}
              <Link to="/myTasks" onClick={closeSidebar}>
                {" "}
                <CodeXml size={20} /> <p>My Tasks</p>{" "}
              </Link>{" "}
            </div>{" "}
            <div className={styles.teams}>
              {" "}
              <Link to="/teams" onClick={closeSidebar}>
                {" "}
                <Users size={20} /> <p>Teams</p>{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
          <div className={styles.management}>
            {" "}
            <div className={styles.profile}>
              {" "}
              <Link to="/profile" onClick={closeSidebar}>
                {" "}
                <UserRoundArrowLeft size={20} /> <p>My Profile</p>{" "}
              </Link>{" "}
            </div>{" "}
            <button onClick={handleLogout} className={styles.logOut}>
              {" "}
              <LogOut size={20} /> <p>Log out</p>{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
};
export default Sidebar;
