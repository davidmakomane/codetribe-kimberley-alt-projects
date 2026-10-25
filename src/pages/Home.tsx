import { useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, CalendarDays, ListChecks, Plus, ShoppingCart } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser } from "../features/auth/authSlice";
import { clearItems } from "../features/items/itemsSlice";
import { clearLists, fetchLists } from "../features/shoppingLists/shoppingListsSlice";
import AppSidebar from "../components/AppSidebar";

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const lists = useAppSelector((state) => state.shoppingLists.lists);
  const loading = useAppSelector((state) => state.shoppingLists.loading);
  const error = useAppSelector((state) => state.shoppingLists.error);

  useEffect(() => {
    if (user?.id) void dispatch(fetchLists(user.id));
    else dispatch(clearLists());
  }, [dispatch, user?.id]);

  const recentLists = useMemo(
    () => [...lists].sort((a, b) => new Date(b.updatedAt || b.createdAt).getTime() - new Date(a.updatedAt || a.createdAt).getTime()).slice(0, 3),
    [lists],
  );

  function handleLogout() {
    sessionStorage.removeItem("currentUser");
    dispatch(clearUser());
    dispatch(clearLists());
    dispatch(clearItems());
    navigate("/login", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="basketly-layout">
      <AppSidebar active="home" onLogout={handleLogout} />
      <main className="basketly-main">
        <header className="basketly-toolbar"><span className="basketly-page-label">Dashboard</span><div className="basketly-user"><div className="basketly-avatar">{user.name.charAt(0).toUpperCase()}</div><span>{user.name}</span></div></header>

        <section className="basketly-welcome">
          <div><h1>Welcome back, {user.name}</h1><p>Your shopping at a glance.</p></div>
          <Link className="basketly-primary-button" to="/lists?create=1"><Plus size={17} />Create a list</Link>
        </section>

        <section className="basketly-summary-grid" aria-label="Shopping overview">
          <article className="basketly-summary-card"><span className="basketly-summary-icon"><ListChecks size={20} /></span><p>Total lists</p><strong>{lists.length}</strong><Link to="/lists">View all lists <ArrowRight size={14} /></Link></article>
          <article className="basketly-summary-card"><span className="basketly-summary-icon"><ShoppingCart size={20} /></span><p>Categories used</p><strong>{new Set(lists.map((list) => list.category || "Groceries")).size}</strong><Link to="/lists">Browse categories <ArrowRight size={14} /></Link></article>
        </section>

        <section className="basketly-recent-section">
          <div className="basketly-recent-heading"><div><h2>Recently updated</h2><p>Pick up where you left off.</p></div><Link to="/lists">See all lists <ArrowRight size={15} /></Link></div>
          {loading ? <div className="basketly-empty-state">Loading your lists...</div> : error ? <p role="alert" className="basketly-status-message">{error}</p> : recentLists.length === 0 ? (
            <div className="basketly-empty-state"><ShoppingCart size={30} /><h3>No lists yet</h3><p>Create your first list to start organising your shopping.</p><Link className="basketly-primary-button" to="/lists?create=1"><Plus size={16} />Create a list</Link></div>
          ) : (
            <div className="basketly-recent-list">{recentLists.map((list) => <Link className="basketly-recent-row" key={list.id} to={`/lists/${encodeURIComponent(list.id)}`}><span className="basketly-recent-icon"><ShoppingCart size={18} /></span><span className="basketly-recent-info"><strong>{list.name}</strong><small>{list.category || "Groceries"}</small></span><span className="basketly-recent-date"><CalendarDays size={14} />{new Date(list.updatedAt || list.createdAt).toLocaleDateString()}</span><ArrowRight size={17} /></Link>)}</div>
          )}
        </section>

        <footer className="basketly-footer">ShopList · Simple shopping, better organised.</footer>
      </main>
    </div>
  );
}

export default Home;
