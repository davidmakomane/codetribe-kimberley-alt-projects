
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAppDispatch } from "../app/hooks";
import { setUser } from "../features/auth/authSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const user = await loginUser(email, password);
      const safeUser = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        cellNumber: user.cellNumber,
      };
      dispatch(setUser(safeUser));

      // Temporary session for this learning project.
      sessionStorage.setItem(
        "currentUser",
        JSON.stringify(safeUser)
      );

      navigate("/home");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-container">
      <h1>Welcome back</h1>
      <p>Log in to manage your shopping lists.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {message && <p role="alert">{message}</p>}

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </main>
  );
}

export default Login;
