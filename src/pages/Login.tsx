import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event: FormEvent) => {
    event.preventDefault();

    if (!username || !password) {
      alert("Please enter your username and password.");
      return;
    }

    localStorage.setItem("loggedIn", "true");

    navigate("/home");
  };

  return (
    <div>
      <Navbar />

      <main className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>

          <p>Login to manage your job applications.</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Username</label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>

            <button className="btn btn-primary" type="submit">
              Login
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">Register</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;