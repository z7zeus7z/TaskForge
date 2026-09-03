import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { apiRequest } from "../services/api";
import styles from "../styles/Login.module.css";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  //Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { response, data } = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(formData),
    });
    if (!response.ok) {
      alert(data.message || "Login failed");
      return;
    }
    login(data.token);
    navigate("/");
  };
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.logoImg}></div>
        <div className={styles.loginForm}>
          <h1>Welcome to TaskForge</h1>
          <p>Log in and start working on your projects</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                placeholder="Enter your password"
                onChange={handleChange}
              />
            </div>
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
            <button type="submit">Log in</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
