import { Home, ListChecks, LogOut, ShoppingCart, UserRound } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

type AppSidebarProps = {
  active: "home" | "lists" | "profile";
  onLogout?: () => void;
};

function AppSidebar({ active, onLogout }: AppSidebarProps) {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/home" && location.hash === "#my-lists") {
      requestAnimationFrame(() => {
        document.getElementById("my-lists")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.pathname, location.hash]);

  return (
    <aside className="basketly-sidebar">
      <Link to="/home" className="basketly-logo">
        <span className="basketly-logo-icon"><ShoppingCart size={21} /></span>
        <span>ShopList</span>
      </Link>
      <nav className="basketly-nav" aria-label="Main navigation">
        <Link to="/home" className={`basketly-nav-link ${active === "home" ? "active" : ""}`}><Home size={18} /><span>Home</span></Link>
        <Link to="/home#my-lists" onClick={() => requestAnimationFrame(() => document.getElementById("my-lists")?.scrollIntoView({ behavior: "smooth", block: "start" }))} className={`basketly-nav-link ${active === "lists" ? "active" : ""}`}><ListChecks size={18} /><span>My Lists</span></Link>
        <Link to="/profile" className={`basketly-nav-link ${active === "profile" ? "active" : ""}`}><UserRound size={18} /><span>Profile</span></Link>
      </nav>
      {onLogout && <button className="basketly-logout" onClick={onLogout}><LogOut size={17} /><span>Logout</span></button>}
    </aside>
  );
}

export default AppSidebar;
