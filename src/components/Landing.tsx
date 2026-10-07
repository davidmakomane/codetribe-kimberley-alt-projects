import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Landing() {
  return (
    <div>
      <Navbar />

      <main className="hero">
        <div className="hero-content">
          <h1>
            Track every <span>job application</span> in one place.
          </h1>

          <p>
            JobTrack helps job seekers organise applications,
            interviews and opportunities without losing track of
            where they applied.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Get Started Free
            </Link>

            <Link to="/login" className="btn btn-secondary">
              See Demo
            </Link>
          </div>

          <div className="stats">
            <div className="stat">
              <h2>1,000+</h2>
              <p>Users</p>
            </div>

            <div className="stat">
              <h2>5,000+</h2>
              <p>Applications</p>
            </div>

            <div className="stat">
              <h2>4.8/5</h2>
              <p>User Rating</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;