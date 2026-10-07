import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <div>
      <Navbar />

      <main className="not-found">
        <div>
          <h1>404</h1>

          <h2>Page Not Found</h2>

          <p>
            Sorry, the page you are looking for does not exist.
          </p>

          <Link to="/home" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}

export default NotFound;