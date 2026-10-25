import { Home, ListChecks, LogOut, ShoppingCart, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

type AppSidebarProps = {
  active: "home" | "lists" | "profile";
  onLogout?: () => void;
};

function AppSidebar({ active, onLogout }: AppSidebarProps) {
  return (
    <aside className="basketly-sidebar">
      <Link to="/home" className="basketly-logo">
        <span className="basketly-logo-icon"><ShoppingCart size={21} /></span>
        <span>ShopList</span>
      </Link>
      <nav className="basketly-nav" aria-label="Main navigation">
        <Link to="/home" className={`basketly-nav-link ${active === "home" ? "active" : ""}`}><Home size={18} /><span>Home</span></Link>
        <Link to="/home#my-lists" className={`basketly-nav-link ${active === "lists" ? "active" : ""}`}><ListChecks size={18} /><span>My Lists</span></Link>
        <Link to="/profile" className={`basketly-nav-link ${active === "profile" ? "active" : ""}`}><UserRound size={18} /><span>Profile</span></Link>
      </nav>
      {onLogout && <button className="basketly-logout" onClick={onLogout}><LogOut size={17} /><span>Logout</span></button>}
    </aside>
  );
}

export default AppSidebar;
