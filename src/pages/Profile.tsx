
import { Link } from "react-router-dom";

function Profile() {
  return (
    <main className="container">
      <h1>My Profile</h1>
      <p>Manage your personal information and account details.</p>

      <section>
        <h2>Personal information</h2>
        <p>Name: Not set</p>
        <p>Email: Not set</p>
        <p>Cell number: Not set</p>
      </section>

      <p>
        <Link to="/">Back to shopping lists</Link>
      </p>
    </main>
  );
}

export default Profile;
