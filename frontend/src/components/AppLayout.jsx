import { useState } from "react";
import styles from "../styles/AppLayout.module.css";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = () => {
    setSidebarOpen(true);
  };
  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  return (
    <div className={styles.layout}>
      {" "}
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />{" "}
      <button
        className={styles.menuButton}
        onClick={openSidebar}
        aria-label="Open sidebar"
      >
        {" "}
        <Menu size={24} />{" "}
      </button>{" "}
      <main className={styles.main}>{children}</main>{" "}
    </div>
  );
};
export default AppLayout;
