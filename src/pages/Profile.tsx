import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser, updateUser } from "../features/auth/authSlice";
import { clearLists } from "../features/shoppingLists/shoppingListsSlice";
import { clearItems } from "../features/items/itemsSlice";
import { updateUserPassword, updateUserProfile } from "../services/authService";
import AppSidebar from "../components/AppSidebar";

function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [name, setName] = useState(user?.name ?? "");
  const [surname, setSurname] = useState(user?.surname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [cellNumber, setCellNumber] = useState(user?.cellNumber ?? "");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      const saved = await updateUserProfile({
        id: user.id,
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim().toLowerCase(),
        cellNumber: cellNumber.trim(),
      });
      const safeUser = { id: saved.id, name: saved.name, surname: saved.surname, email: saved.email, cellNumber: saved.cellNumber };
      sessionStorage.setItem("currentUser", JSON.stringify(safeUser));
      dispatch(updateUser(safeUser));
      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not save your profile.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    setPasswordMessage("");
    if (newPassword.length < 8) { setPasswordMessage("New password must contain at least 8 characters."); return; }
    if (newPassword !== confirmPassword) { setPasswordMessage("New passwords do not match."); return; }
    setSaving(true);
    try {
      await updateUserPassword(user.id, currentPassword, newPassword);
      setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      setPasswordMessage("Password updated successfully.");
    } catch (error) {
      setPasswordMessage(error instanceof Error ? error.message : "Could not update your password.");
    } finally { setSaving(false); }
  }

  function handleLogout() {
    sessionStorage.removeItem("currentUser");
    dispatch(clearUser());
    dispatch(clearLists());
    dispatch(clearItems());
    navigate("/login", { replace: true });
  }

  if (!user) return <main className="container"><h1>My Profile</h1><p>Please log in to view your profile.</p><Link to="/login">Go to login</Link></main>;

  return (
    <div className="basketly-layout">
      <AppSidebar active="profile" onLogout={handleLogout} />
      <main className="basketly-main">
        <Link to="/home" className="basketly-back-link">← Back to lists</Link>
        <section className="basketly-form-card">
          <div className="basketly-form-heading"><h1>My Profile</h1></div>
          <p>Manage your personal information and account details.</p>
          <form className="basketly-list-form" onSubmit={handleSubmit}>
            <label htmlFor="profile-name">First name</label><input id="profile-name" value={name} onChange={(event) => setName(event.target.value)} required maxLength={80} />
            <label htmlFor="profile-surname">Surname</label><input id="profile-surname" value={surname} onChange={(event) => setSurname(event.target.value)} required maxLength={80} />
            <label htmlFor="profile-email">Email address</label><input id="profile-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            <label htmlFor="profile-phone">Cell number</label><input id="profile-phone" type="tel" value={cellNumber} onChange={(event) => setCellNumber(event.target.value)} />
            <div className="basketly-form-actions"><button className="basketly-primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button><Link className="basketly-cancel-button" to="/home">Cancel</Link></div>
          </form>
          {message && <p role="status" className="basketly-status-message">{message}</p>}
        </section>
        <section className="basketly-form-card">
          <div className="basketly-form-heading"><h2>Update login password</h2></div>
          <form className="basketly-list-form" onSubmit={handlePasswordSubmit}>
            <label htmlFor="current-password">Current password</label><input id="current-password" type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required autoComplete="current-password" />
            <label htmlFor="new-password">New password</label><input id="new-password" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
            <label htmlFor="confirm-password">Confirm new password</label><input id="confirm-password" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
            <div className="basketly-form-actions"><button className="basketly-primary-button" type="submit" disabled={saving}>{saving ? "Saving..." : "Update password"}</button></div>
          </form>
          {passwordMessage && <p role="status" className="basketly-status-message">{passwordMessage}</p>}
        </section>
      </main>
    </div>
  );
}

export default Profile;
