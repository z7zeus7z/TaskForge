import styles from "../styles/Register.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { apiRequest } from "../services/api.js";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formdata, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    password: "",
  });
  //HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formdata,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { response, data } = await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(formdata),
    });
    if (!response.ok) {
      alert(data.message || "Registration failed");
      return;
    }
    console.log(data);
    login(data.token);
    navigate("/login");
  };
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.registerForm}>
          <h1>Create your TaskForge account</h1>
          <p>Join your team and start managing projects.</p>
          <form onSubmit={handleSubmit}>
            <div className={styles.nameFields}>
              <div className={styles.field}>
                <label htmlFor="fname">First Name</label>
                <input
                  type="text"
                  name="fname"
                  id="fname"
                  value={formdata.fname}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="lname">Last Name</label>
                <input
                  type="text"
                  name="lname"
                  id="lname"
                  value={formdata.lname}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={formdata.email}
                onChange={handleChange}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={formdata.password}
                onChange={handleChange}
              />
            </div>
            <p>
              Have an account? <Link to="/login">Login</Link>
            </p>
            <button type="submit">Register</button>
          </form>
        </div>
        <div className={styles.logoImg}></div>
      </div>
    </>
  );
};

export default Register;
