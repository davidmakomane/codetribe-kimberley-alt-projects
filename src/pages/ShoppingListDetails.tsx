
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  X,
  Pencil,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearUser } from "../features/auth/authSlice";
import { clearLists } from "../features/shoppingLists/shoppingListsSlice";
import {
  clearItems,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../features/items/itemsSlice";
import type { ShoppingList, ShoppingItem } from "../types";
import { apiUrl } from "../services/api";
import AppSidebar from "../components/AppSidebar";

const itemCategories = [
  "Groceries",
  "Dairy",
  "Bakery",
  "Meat",
  "Fruit",
  "Vegetables",
  "Personal Care",
  "Household",
  "Office",
  "Other",
];

const emptyForm = {
  name: "",
  quantity: "1",
  category: "Groceries",
  notes: "",
  image: "",
};

function ShoppingListDetails() {
  const { listId } = useParams<{ listId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const shareTokenParam = searchParams.get("token");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.id;

  const items = useAppSelector((state) => state.items.items);
  const itemsLoading = useAppSelector((state) => state.items.loading);
  const itemsError = useAppSelector((state) => state.items.error);

  const [list, setList] = useState<ShoppingList | null>(null);
  const [canEdit, setCanEdit] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState("");
  const search = searchParams.get("search") ?? "";
  const requestedSort = searchParams.get("sort") ?? "name";
  const sortBy = ["name", "category", "date", "purchased"].includes(requestedSort) ? requestedSort : "name";
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function updateQuery(key: string, value: string, defaultValue = "") {
    const next = new URLSearchParams(searchParams);
    if (value === defaultValue) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  }

  useEffect(() => {
    let cancelled = false;

    async function loadList() {
      if (!listId) {
        setListLoading(false);
        setListError("This shopping list link is invalid.");
        return;
      }

      setListLoading(true);
      setListError("");

      try {
        const response = await fetch(
          apiUrl("shoppingLists", listId),
        );

        if (!response.ok) {
          throw new Error("Shopping list not found.");
        }

        const data = (await response.json()) as ShoppingList;

        const isOwner = Boolean(userId && data.userId === userId);
        const hasShareToken = Boolean(data.shareToken && shareTokenParam === data.shareToken);
        if (!isOwner && !hasShareToken) {
          throw new Error("You don't have access to this shopping list.");
        }

        if (!cancelled) {
          setList(data);
          setCanEdit(isOwner);
          void dispatch(fetchItems(listId));
        }
      } catch (error) {
        if (!cancelled) {
          setListError(
            error instanceof Error
              ? error.message
              : "Could not load this shopping list.",
          );
        }
      } finally {
        if (!cancelled) {
          setListLoading(false);
        }
      }
    }

    void loadList();

    return () => {
      cancelled = true;
      dispatch(clearItems());
    };
  }, [listId, userId, dispatch, shareTokenParam]);

  const visibleItems = useMemo(() => {
    const filtered = items.filter((item) => item.listId === listId && item.userId === list?.userId &&
      `${item.name} ${item.category} ${item.notes}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

    return [...filtered].sort((a, b) => {
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }

      if (sortBy === "purchased") {
        return Number(a.purchased) - Number(b.purchased);
      }

      if (sortBy === "date") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      return a.name.localeCompare(b.name);
    });
  }, [items, search, sortBy, listId, list?.userId]);

  const purchasedCount = items.filter((item) => item.listId === listId && item.userId === list?.userId && item.purchased).length;
  const currentItems = items.filter((item) => item.listId === listId && item.userId === list?.userId);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!canEdit) return;

    if (!userId || !listId || !form.name.trim()) {
      setMessage("Please enter an item name.");
      return;
    }

    const quantity = Number(form.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      setMessage("Quantity must be a number greater than zero.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const existingItem = items.find((item) => item.id === editingId);

        if (!existingItem || existingItem.listId !== listId || existingItem.userId !== userId) {
          setMessage("This item could not be found. Please refresh the page.");
          return;
        }

        await dispatch(
          updateItem({
            id: editingId,
            name: form.name.trim(),
            quantity,
            category: form.category,
            notes: form.notes,
            image: form.image,
            purchased: existingItem.purchased,
          }),
        ).unwrap();

        setMessage("Item updated.");
      } else {
        await dispatch(
          createItem({
            listId,
            userId,
            name: form.name.trim(),
            quantity,
            category: form.category,
            notes: form.notes,
            image: form.image,
          }),
        ).unwrap();

        setMessage("Item added to your list.");
      }

      resetForm();
    } catch {
      setMessage("Could not save the item. Check that JSON Server is running.");
    } finally {
      setSaving(false);
    }
  }

  function startEditing(item: ShoppingItem) {
    setForm({
      name: item.name,
      quantity: String(item.quantity),
      category: item.category || "Other",
      notes: item.notes || "",
      image: item.image || "",
    });

    setEditingId(item.id);
    setShowForm(true);
    setMessage("");
  }

  async function togglePurchased(item: ShoppingItem) {
    if (!canEdit || item.listId !== listId || item.userId !== list?.userId) return;
    try {
      await dispatch(
        updateItem({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          category: item.category,
          notes: item.notes,
          image: item.image || "",
          purchased: !item.purchased,
        }),
      ).unwrap();
    } catch {
      setMessage("Could not update the purchased status.");
    }
  }

  async function handleDelete(item: ShoppingItem) {
    if (!canEdit || item.listId !== listId || item.userId !== list?.userId) return;
    if (!window.confirm(`Delete "${item.name}" from this list?`)) {
      return;
    }

    try {
      await dispatch(deleteItem(item.id)).unwrap();
      setMessage("Item deleted.");
    } catch {
      setMessage("Could not delete this item.");
    }
  }

  function handleLogout() {
    sessionStorage.removeItem("currentUser");
    dispatch(clearUser());
    dispatch(clearLists());
    dispatch(clearItems());
    navigate("/login", { replace: true });
  }

  if (listLoading) {
    return (
      <main className="basketly-detail-state">
        Loading shopping list...
      </main>
    );
  }

  if (listError || !list) {
    return (
      <main className="basketly-detail-state">
        <h1>Unable to open list</h1>
        <p>{listError || "This shopping list could not be found."}</p>
        <Link to="/home" className="basketly-primary-button">
          Back to dashboard
        </Link>
      </main>
    );
  }

  return (
    <div className="basketly-layout">
      <AppSidebar active="lists" onLogout={user ? handleLogout : undefined} />

      <main className="basketly-main">
        <Link to="/home" className="basketly-back-link">
          <ArrowLeft size={17} />
          Back to lists
        </Link>

        <section className="basketly-detail-heading">
          <div className="basketly-category-icon green">
            <ShoppingCart size={20} />
          </div>

          <div>
            <h1>{list.name}</h1>
            <p>
              {currentItems.length} {currentItems.length === 1 ? "item" : "items"}
              {" · "}
              {list.category || "Groceries"}
              {" · "}
              Updated{" "}
              {new Date(
                list.updatedAt || list.createdAt,
              ).toLocaleDateString()}
            </p>
          </div>
        </section>

        {!canEdit && <p className="basketly-status-message">You are viewing a shared, read-only shopping list.</p>}

        {list.description && (
          <p className="basketly-detail-description">{list.description}</p>
        )}

        <section className="basketly-detail-tools">
          <label className="basketly-control-search">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search items..."
              aria-label="Search items"
              value={search}
              onChange={(event) => updateQuery("search", event.target.value)}
            />
          </label>

          <label className="basketly-select-wrap">
            <span>Sort by:</span>
            <select
              value={sortBy}
              onChange={(event) => updateQuery("sort", event.target.value, "name")}
            >
              <option value="name">Name</option>
              <option value="category">Category</option>
              <option value="date">Date added</option>
              <option value="purchased">Unpurchased first</option>
            </select>
          </label>
        </section>

        <div className="basketly-progress">
          <div>
            <span>Shopping progress</span>
            <strong>
              {purchasedCount} of {currentItems.length} purchased
            </strong>
          </div>

          <div className="basketly-progress-track">
            <span
              style={{
                width: `${
                  currentItems.length
                    ? (purchasedCount / currentItems.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </div>

        <div className="basketly-items-heading">
          <h2>Items</h2>

          {canEdit && <button
            className="basketly-primary-button"
            onClick={() => {
              setForm(emptyForm);
              setEditingId(null);
              setShowForm(true);
              setMessage("");
            }}
          >
            <Plus size={17} />
            Add Item
          </button>}
        </div>

        {canEdit && showForm && (
          <section className="basketly-form-card">
            <div className="basketly-form-heading">
              <h2>{editingId ? "Edit Item" : "Add New Item"}</h2>

              <button
                type="button"
                aria-label="Close form"
                onClick={resetForm}
              >
                <X size={20} />
              </button>
            </div>

            <form className="basketly-list-form" onSubmit={handleSubmit}>
              <label htmlFor="item-name">Item Name *</label>
              <input
                id="item-name"
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="e.g. Milk"
                maxLength={100}
                required
              />

              <label htmlFor="item-quantity">Quantity *</label>
              <input
                id="item-quantity"
                type="number"
                min="0.01"
                step="any"
                value={form.quantity}
                onChange={(event) =>
                  setForm({ ...form, quantity: event.target.value })
                }
                required
              />

              <label htmlFor="item-category">Category *</label>
              <select
                id="item-category"
                value={form.category}
                onChange={(event) =>
                  setForm({ ...form, category: event.target.value })
                }
                required
              >
                {itemCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <label htmlFor="item-notes">Notes (optional)</label>
              <textarea
                id="item-notes"
                rows={3}
                value={form.notes}
                onChange={(event) =>
                  setForm({ ...form, notes: event.target.value })
                }
                placeholder="Brand, size or other details..."
                maxLength={300}
              />

              <label htmlFor="item-image">Image URL (optional)</label>
              <div className="basketly-image-input">
                <ImagePlus size={18} />
                <input
                  id="item-image"
                  type="url"
                  value={form.image}
                  onChange={(event) =>
                    setForm({ ...form, image: event.target.value })
                  }
                  placeholder="https://example.com/item.jpg"
                />
              </div>

              <div className="basketly-form-actions">
                <button
                  className="basketly-primary-button"
                  type="submit"
                  disabled={saving}
                >
                  {saving ? "Saving..." : editingId ? "Save Changes" : "Add Item"}
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

        {(message || itemsError) && (
          <p className="basketly-status-message" role="status">
            {message || itemsError}
          </p>
        )}

        {itemsLoading ? (
          <div className="basketly-empty-state">Loading items...</div>
        ) : visibleItems.length === 0 ? (
          <div className="basketly-empty-state">
            <ShoppingCart size={32} />
            <h3>{search ? "No matching items" : "Your list is empty"}</h3>
            <p>
              {search
                ? "Try another search term."
                : "Add your first item to get started."}
            </p>
          </div>
        ) : (
          <section className="basketly-item-list">
            {visibleItems.map((item) => (
              <article
                className={`basketly-item-row ${
                  item.purchased ? "purchased" : ""
                }`}
                key={item.id}
              >
                {canEdit && <label
                  className="basketly-purchased-check"
                  aria-label={`Mark ${item.name} as purchased`}
                >
                  <input
                    type="checkbox"
                    checked={item.purchased}
                    onChange={() => void togglePurchased(item)}
                  />
                  <span>
                    <Check size={13} />
                  </span>
                </label>}

                {item.image ? (
                  <img
                    className="basketly-item-image"
                    src={item.image}
                    alt={item.name}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="basketly-item-image basketly-item-placeholder">
                    <ShoppingCart size={20} />
                  </div>
                )}

                <div className="basketly-item-info">
                  <h3>{item.name}</h3>
                  <p>Quantity: {item.quantity}</p>
                  {item.notes && (
                    <p className="basketly-item-notes">{item.notes}</p>
                  )}
                </div>

                <span
                  className={`basketly-item-category category-${item.category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                >
                  {item.category}
                </span>

                {canEdit && <div className="basketly-item-actions">
                  <button
                    type="button"
                    aria-label={`Edit ${item.name}`}
                    title="Edit item"
                    onClick={() => startEditing(item)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    aria-label={`Delete ${item.name}`}
                    title="Delete item"
                    onClick={() => void handleDelete(item)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>}
              </article>
            ))}
          </section>
        )}

        <footer className="basketly-footer">
          ShopList · Simple shopping, better organised.
        </footer>
      </main>
    </div>
  );
}

export default ShoppingListDetails;
