
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3001/shoppingLists";

type ShoppingList = {
  id: string;
  userId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

type CurrentUser = {
  id: string;
  name: string;
  surname: string;
  email: string;
};

function Home() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const currentUser: CurrentUser | null = (() => {
    try {
      return JSON.parse(
        sessionStorage.getItem("currentUser") || "null"
      );
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    async function loadLists() {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_URL}?userId=${encodeURIComponent(currentUser.id)}`
        );

        if (!response.ok) {
          throw new Error("Could not load your shopping lists.");
        }

        const data: ShoppingList[] = await response.json();
        setLists(data);
      } catch {
        setMessage(
          "Could not connect to the server. Make sure JSON Server is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadLists();
  }, [currentUser?.id]);

  const visibleLists = useMemo(() => {
    const filtered = lists.filter((list) =>
      `${list.name} ${list.description}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

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

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [lists, search, sortBy]);

  function resetForm() {
    setListName("");
    setDescription("");
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

    const now = new Date().toISOString();

    const listData = {
      userId: currentUser.id,
      name: listName.trim(),
      description: description.trim(),
      updatedAt: now,
    };

    if (!listData.name) {
      setMessage("Please enter a list name.");
      return;
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            editingId
              ? listData
              : { ...listData, createdAt: now }
          ),
        }
      );

      if (!response.ok) {
        throw new Error("Could not save the shopping list.");
      }

      const savedList: ShoppingList = await response.json();

      setLists((previous) =>
        editingId
          ? previous.map((list) =>
              list.id === editingId ? savedList : list
            )
          : [savedList, ...previous]
      );

      resetForm();
      setMessage(editingId ? "List updated successfully." : "List created successfully.");
    } catch {
      setMessage("Could not save your list. Check that JSON Server is running.");
    }
  }

  function startEditing(list: ShoppingList) {
    setListName(list.name);
    setDescription(list.description);
    setEditingId(list.id);
    setShowForm(true);
    setMessage("");
  }

  async function deleteList(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this shopping list?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      setLists((previous) => previous.filter((list) => list.id !== id));
      setMessage("Shopping list deleted.");
    } catch {
      setMessage("Could not delete the list. Please try again.");
    }
  }

  if (!currentUser) {
    return (
      <main className="home-page">
        <section className="empty-state">
          <h1>Welcome to Basketly</h1>
          <p>Please log in to manage your shopping lists.</p>
          <Link className="primary-button" to="/login">
            Log in
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="home-page">
      <header className="topbar">
        <Link className="brand" to="/home">
          <span className="brand-mark">B</span>
          <span>Basketly</span>
        </Link>

        <nav className="topbar-links">
          <Link to="/home">My Lists</Link>
          <Link to="/profile">My Profile</Link>
          <button
            className="text-button"
            onClick={() => {
              sessionStorage.removeItem("currentUser");
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </nav>
      </header>

      <section className="welcome-section">
        <div>
          <p className="eyebrow">YOUR SHOPPING SPACE</p>
          <h1>My shopping lists</h1>
          <p className="subtitle">
            Welcome back, {currentUser.name}. Let's get organised.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            resetForm();
            setShowForm(true);
            setMessage("");
          }}
        >
          + Create new list
        </button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total lists</span>
          <strong>{lists.length}</strong>
        </article>
        <article className="stat-card">
          <span>Matching lists</span>
          <strong>{visibleLists.length}</strong>
        </article>
      </section>

      {showForm && (
        <section className="form-card">
          <h2>{editingId ? "Edit shopping list" : "Create a shopping list"}</h2>

          <form onSubmit={handleSubmit} className="list-form">
            <label htmlFor="listName">List name</label>
            <input
              id="listName"
              value={listName}
              onChange={(event) => setListName(event.target.value)}
              placeholder="e.g. Weekly groceries"
              maxLength={60}
              required
            />

            <label htmlFor="description">Description (optional)</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="What is this list for?"
              rows={3}
              maxLength={200}
            />

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingId ? "Save changes" : "Create list"}
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      {message && (
        <p className="status-message" role="status">
          {message}
        </p>
      )}

      <section className="lists-section">
        <div className="section-heading">
          <div>
            <h2>Your lists</h2>
            <p>Manage and organise everything you need to buy.</p>
          </div>
        </div>

        <div className="list-toolbar">
          <input
            type="search"
            aria-label="Search shopping lists"
            placeholder="Search your lists..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            aria-label="Sort shopping lists"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="name">Name: A–Z</option>
          </select>
        </div>

        {loading ? (
          <p className="empty-state">Loading your lists...</p>
        ) : visibleLists.length === 0 ? (
          <div className="empty-state">
            <h3>{search ? "No matching lists" : "No shopping lists yet"}</h3>
            <p>
              {search
                ? "Try a different search term."
                : "Create your first list to get started."}
            </p>
            {!search && (
              <button
                className="primary-button"
                onClick={() => setShowForm(true)}
              >
                + Create your first list
              </button>
            )}
          </div>
        ) : (
          <div className="lists-grid">
            {visibleLists.map((list) => (
              <article className="list-card" key={list.id}>
                <div className="list-card-top">
                  <div className="list-symbol">☷</div>
                  <div className="list-actions">
                    <button
                      className="icon-button"
                      aria-label={`Edit ${list.name}`}
                      title="Edit list"
                      onClick={() => startEditing(list)}
                    >
                      Edit
                    </button>
                    <button
                      className="icon-button delete-button"
                      aria-label={`Delete ${list.name}`}
                      title="Delete list"
                      onClick={() => deleteList(list.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <h3>{list.name}</h3>
                <p className="list-description">
                  {list.description || "No description added."}
                </p>

                <p className="list-date">
                  Created{" "}
                  {new Date(list.createdAt).toLocaleDateString()}
                </p>

                <button
                  className="secondary-button open-list-button"
                  onClick={() =>
                    setMessage(
                      `Next, we'll add shopping items to "${list.name}".`
                    )
                  }
                >
                  Open list →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="home-footer">
        Basketly · Simple shopping, better organised.
      </footer>
    </main>
  );
}

export default Home;
