import { NavLink, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const loggedIn = localStorage.getItem("loggedIn") === "true";

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="logo">
        JobTrack
      </NavLink>

      <div className="nav-links">
        {!loggedIn && (
          <>
            <NavLink to="/">Features</NavLink>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" className="nav-button">
              Get Started
            </NavLink>
          </>
        )}

        {loggedIn && (
          <>
            <NavLink to="/home">Dashboard</NavLink>

            <button className="btn btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;