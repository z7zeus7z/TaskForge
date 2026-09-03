import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AppLayout from "./components/AppLayout";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import TaskPage from "./pages/TaskPage";
import EditProject from "./pages/EditProject";
import TeamPage from "./pages/TeamPage";
import ProfilePage from "./pages/ProfilePage";
import { Routes, Route } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <Home />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <Projects />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/createProject"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <CreateProject />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <ProjectDetails />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/myTasks"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <TaskPage />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/projects/:projectId/edit"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <EditProject />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <TeamPage />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoutes>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoutes>
          }
        />
      </Routes>
    </>
  );
}

export default App;
