import styles from "../styles/AppLayout.module.css";
import Sidebar from "./Sidebar";
const AppLayout = ({ children }) => {
  return (
    <>
      <div className={styles.layout}>
        <Sidebar />
        <main className={styles.main}>{children}</main>
      </div>
    </>
  );
};

export default AppLayout;
