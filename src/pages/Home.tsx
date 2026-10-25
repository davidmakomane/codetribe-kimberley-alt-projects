
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  ShoppingCart,
  MoreVertical,
  CalendarDays,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchLists,
  createList,
  updateList,
  deleteList as deleteShoppingList,
  clearLists,
} from "../features/shoppingLists/shoppingListsSlice";
import { clearUser } from "../features/auth/authSlice";
import { clearItems } from "../features/items/itemsSlice";
import type { ShoppingList } from "../types";
import AppSidebar from "../components/AppSidebar";

const categories = [
  "All",
  "Groceries",
  "Tools",
  "Personal Care",
  "Office",
  "Household",
  "Other",
];

function Home() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector((state) => state.auth.user);
  const lists = useAppSelector((state) => state.shoppingLists.lists);
  const loading = useAppSelector((state) => state.shoppingLists.loading);
  const serverError = useAppSelector((state) => state.shoppingLists.error);

  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const requestedSort = searchParams.get("sort") ?? "name";
  const sortBy = ["name", "newest", "oldest", "category"].includes(requestedSort) ? requestedSort : "name";
  const requestedCategory = searchParams.get("category") ?? "All";
  const category = categories.includes(requestedCategory) ? requestedCategory : "All";
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [listCategory, setListCategory] = useState("Groceries");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  function updateQuery(key: string, value: string, defaultValue = "") {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchLists(currentUser.id));
    } else {
      dispatch(clearLists());
    }
  }, [currentUser?.id, dispatch]);

  const visibleLists = useMemo(() => {
    const filtered = lists.filter((list) => {
      const matchesSearch = `${list.name} ${list.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const listCategory = list.category || "Groceries";
      const matchesCategory =
        category === "All" || listCategory === category;

      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortBy === "category") {
        return (a.category || "Groceries").localeCompare(
          b.category || "Groceries",
        );
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [lists, search, sortBy, category]);

  function resetForm() {
    setListName("");
    setDescription("");
    setListCategory("Groceries");
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!currentUser) {
      setMessage("Please log in before creating a shopping list.");
      return;
    }

    if (!listName.trim()) {
      setMessage("Please enter a list name.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const ownedList = lists.find((list) => list.id === editingId);
        if (!ownedList || ownedList.userId !== currentUser.id) throw new Error("You cannot edit this list.");
        await dispatch(
          updateList({
            id: editingId,
            name: listName.trim(),
            description: description.trim(),
            category: listCategory,
          }),
        ).unwrap();

        setMessage("List updated successfully.");
      } else {
        await dispatch(
          createList({
            userId: currentUser.id,
            name: listName.trim(),
            description: description.trim(),
            category: listCategory,
          }),
        ).unwrap();

        setMessage("Shopping list created successfully.");
      }

      resetForm();
    } catch {
      setMessage(
        "Could not save your list. Check that JSON Server is running.",
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(list: ShoppingList) {
    setListName(list.name);
    setDescription(list.description);
    setListCategory(list.category || "Other");
    setEditingId(list.id);
    setShowForm(true);
    setMessage("");
  }

  async function handleShareList(list: ShoppingList) {
    if (!currentUser || list.userId !== currentUser.id) return;
    try {
      const shareToken = list.shareToken || crypto.randomUUID();
      if (!list.shareToken) {
        await dispatch(updateList({
          id: list.id,
          name: list.name,
          description: list.description,
          category: list.category || "Other",
          shareToken,
        })).unwrap();
      }
      const shareUrl = `${window.location.origin}/shared/${encodeURIComponent(list.id)}?token=${encodeURIComponent(shareToken)}`;
      await navigator.clipboard.writeText(shareUrl);
      setMessage("Read-only sharing link copied to your clipboard.");
    } catch {
      setMessage("Could not create or copy the sharing link.");
    }
  }

  async function handleDeleteList(id: string) {
    const ownedList = lists.find((list) => list.id === id);
    if (!currentUser || !ownedList || ownedList.userId !== currentUser.id) {
      setMessage("You cannot delete this list.");
      return;
    }
    if (
      !window.confirm(
        "Are you sure you want to delete this shopping list?",
      )
    ) {
      return;
    }

    try {
      await dispatch(deleteShoppingList(id)).unwrap();
      setMessage("Shopping list deleted.");
    } catch {
      setMessage("Could not delete the list. Please try again.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("currentUser");
    dispatch(clearUser());
    dispatch(clearLists());
    dispatch(clearItems());
    navigate("/login", { replace: true });
  }

  if (!currentUser) {
    return (
      <main className="basketly-auth-required">
        <ShoppingCart size={42} />
        <h1>Welcome to Basketly</h1>
        <p>Please log in to manage your shopping lists.</p>
        <Link className="basketly-primary-button" to="/login">
          Log in
        </Link>
      </main>
    );
  }

  return (
    <div className="basketly-layout">
      <AppSidebar active="lists" onLogout={handleLogout} />

      <main className="basketly-main">
        <header className="basketly-toolbar">
          <label className="basketly-global-search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Search shopping lists"
              placeholder="Search lists..."
              value={search}
              onChange={(event) => updateQuery("search", event.target.value)}
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => updateQuery("search", "")}
              >
                <X size={16} />
              </button>
            )}
          </label>

          <div className="basketly-user">
            <div className="basketly-avatar">
              {currentUser.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
        </header>

        <section className="basketly-welcome">
          <div>
            <h1>Hello, {currentUser.name}</h1>
            <p>Here are your shopping lists.</p>
          </div>

          <button
            className="basketly-primary-button"
            onClick={() => {
              resetForm();
              setShowForm(true);
              setMessage("");
            }}
          >
            <Plus size={17} />
            Add New List
          </button>
        </section>

        <section className="basketly-list-controls">
          <label className="basketly-select-wrap">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(event) => updateQuery("sort", event.target.value, "name")}
            >
              <option value="name">Name</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="category">Category</option>
            </select>
          </label>

          <label className="basketly-select-wrap">
            <span>Filter by:</span>
            <select
              value={category}
              onChange={(event) => updateQuery("category", event.target.value, "All")}
            >
              {categories.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </section>

        {showForm && (
          <section className="basketly-form-card">
            <div className="basketly-form-heading">
              <h2>{editingId ? "Edit Shopping List" : "Add New Shopping List"}</h2>

              <button
                type="button"
                aria-label="Close form"
                onClick={resetForm}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="basketly-list-form">
              <label htmlFor="basketly-list-name">List Name *</label>
              <input
                id="basketly-list-name"
                value={listName}
                onChange={(event) => setListName(event.target.value)}
                placeholder="e.g. Weekly Groceries"
                maxLength={60}
                required
              />

              <label htmlFor="basketly-list-description">
                Description (optional)
              </label>
              <textarea
                id="basketly-list-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Add a short description..."
                rows={3}
                maxLength={200}
              />

              <label htmlFor="basketly-list-category">Category</label>
              <select id="basketly-list-category" value={listCategory} onChange={(event) => setListCategory(event.target.value)}>
                {categories.filter((item) => item !== "All").map((item) => <option key={item} value={item}>{item}</option>)}
              </select>

              <div className="basketly-form-actions">
                <button className="basketly-primary-button" type="submit" disabled={saving}>
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Save List"}
                </button>

                <button
                  className="basketly-cancel-button"
                  type="button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {(message || serverError) && (
          <p className="basketly-status-message" role="status">
            {message || serverError}
          </p>
        )}

        <section id="my-lists" className="basketly-lists-section">
          <div className="basketly-section-title">
            <div>
              <h2>My Lists</h2>
              <p>
                {visibleLists.length}{" "}
                {visibleLists.length === 1 ? "list" : "lists"} · Organise
                your shopping
              </p>
            </div>
          </div>

          {loading ? (
            <div className="basketly-empty-state">
              Loading your lists...
            </div>
          ) : visibleLists.length === 0 ? (
            <div className="basketly-empty-state">
              <ShoppingCart size={34} />
              <h3>
                {search || category !== "All"
                  ? "No matching lists"
                  : "No shopping lists yet"}
              </h3>
              <p>
                {search || category !== "All"
                  ? "Try changing your search or filter."
                  : "Create your first list to get started."}
              </p>

              <button
                className="basketly-primary-button"
                onClick={() => {
                  updateQuery("category", "All", "All");
                  setShowForm(true);
                }}
              >
                <Plus size={17} />
                Create a List
              </button>
            </div>
          ) : (
            <div className="basketly-list-grid">
              {visibleLists.map((list, index) => {
                const listCategory = list.category || "Groceries";
                const categoryClass = [
                  "green",
                  "orange",
                  "purple",
                  "blue",
                ][index % 4];

                return (
                  <article className="basketly-list-card" key={list.id}>
                    <div className="basketly-card-top">
                      <div
                        className={`basketly-category-icon ${categoryClass}`}
                      >
                        <ShoppingCart size={18} />
                      </div>

                      <div className="basketly-card-menu">
                        <button
                          type="button"
                          aria-label={`Edit ${list.name}`}
                          title="Edit list"
                          onClick={() => startEditing(list)}
                        >
                          <MoreVertical size={19} />
                        </button>

                        <div className="basketly-card-actions">
                          <button
                            type="button"
                            onClick={() => startEditing(list)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleShareList(list)}
                          >
                            Share read-only link
                          </button>
                          <button
                            type="button"
                            onClick={() => void handleDeleteList(list.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    <h3>{list.name}</h3>

                    <div className="basketly-card-meta">
                      <span>{listCategory}</span>
                      <span>·</span>
                      <span>{list.description || "Shopping list"}</span>
                    </div>

                    <p className="basketly-updated">
                      <CalendarDays size={13} />
                      Updated{" "}
                      {new Date(
                        list.updatedAt || list.createdAt,
                      ).toLocaleDateString()}
                    </p>

                    <button
                      type="button"
                      className="basketly-open-list"
                      onClick={() =>
                        navigate(`/lists/${encodeURIComponent(list.id)}`)
                      }
                    >
                      Open list <span>→</span>
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="basketly-footer">
          ShopList · Simple shopping, better organised.
        </footer>
      </main>
    </div>
  );
}

export default Home;
