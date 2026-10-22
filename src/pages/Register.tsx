
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { hashPassword } from "../services/passwordService";

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [cellNumber, setCellNumber] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const hashedPassword = await hashPassword(password);

      await registerUser({
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase(),
        cellNumber: cellNumber.trim(),
        ...hashedPassword,
      });

      setMessage("Account created successfully! You can now log in.");
      setName("");
      setSurname("");
      setEmail("");
      setCellNumber("");
      setPassword("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-container">
      <h1>Create an account</h1>
      <p>Register to manage your shopping lists.</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />

        <label htmlFor="surname">Surname</label>
        <input
          id="surname"
          value={surname}
          onChange={(event) => setSurname(event.target.value)}
          required
        />

        <label htmlFor="email">Email address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="cellNumber">Cell number</label>
        <input
          id="cellNumber"
          type="tel"
          value={cellNumber}
          onChange={(event) => setCellNumber(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          minLength={8}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      {message && <p role="status">{message}</p>}

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}

export default Register;
