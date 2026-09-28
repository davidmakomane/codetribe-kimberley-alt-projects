import { useEffect, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import LinkCard from "./components/LinkCard";
import Modal from "./components/Modal";
import LinkForm from "./components/LinkForm";

import type { Link } from "./types/Links";

function App() {
  const STORAGE_KEY = "link-vault-links";

  const [links, setLinks] = useState<Link[]>(() => {
    const savedLinks = localStorage.getItem(STORAGE_KEY);

    if (savedLinks) {
      return JSON.parse(savedLinks);
    }

    return [];
  });

  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingLink, setEditingLink] =
    useState<Link | null>(null);

  const [notification, setNotification] =
    useState("");

  /*
   * Save links to localStorage whenever
   * the links array changes.
   */
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(links)
    );
  }, [links]);

  /*
   * Show a notification and automatically
   * remove it after 3 seconds.
   */
  const showNotification = (message: string) => {
    setNotification(message);

    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  /*
   * CREATE
   */
  const handleAddLink = (newLink: Link) => {
    setLinks((currentLinks) => [
      ...currentLinks,
      newLink
    ]);

    setIsFormOpen(false);

    showNotification("Link saved successfully.");
  };

  /*
   * EDIT - open the form with the
   * selected link.
   */
  const handleEditClick = (link: Link) => {
    setEditingLink(link);
    setIsFormOpen(true);
  };

  /*
   * UPDATE
   */
  const handleUpdateLink = (updatedLink: Link) => {
    setLinks((currentLinks) =>
      currentLinks.map((link) =>
        link.id === updatedLink.id
          ? updatedLink
          : link
      )
    );

    setEditingLink(null);
    setIsFormOpen(false);

    showNotification("Link updated successfully.");
  };

  /*
   * DELETE
   */
  const handleDeleteLink = (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this link?"
    );

    if (!confirmed) {
      return;
    }

    setLinks((currentLinks) =>
      currentLinks.filter((link) => link.id !== id)
    );

    showNotification("Link deleted successfully.");
  };

  /*
   * Close the Add/Edit form.
   */
  const handleCloseForm = () => {
    setEditingLink(null);
    setIsFormOpen(false);
  };

  /*
   * SEARCH
   *
   * Search through:
   * - Title
   * - URL
   * - Description
   * - Tags
   */
  const filteredLinks = links.filter((link) => {
    const search = searchTerm.toLowerCase();

    return (
      link.title.toLowerCase().includes(search) ||
      link.url.toLowerCase().includes(search) ||
      link.description.toLowerCase().includes(search) ||
      link.tags.some((tag) =>
        tag.toLowerCase().includes(search)
      )
    );
  });

  return (
    <div className="app">
      <Header
        onAddClick={() => {
          setEditingLink(null);
          setIsFormOpen(true);
        }}
      />

      <main className="main-content">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <section className="links-section">
          <div className="section-header">
            <div>
              <h2>Saved Links</h2>

              <p>
                Your favourite links in one place.
              </p>
            </div>

            <span className="link-count">
              {links.length}{" "}
              {links.length === 1 ? "link" : "links"}
            </span>
          </div>

          <div className="links-list">
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                onEdit={handleEditClick}
                onDelete={handleDeleteLink}
              />
            ))}
          </div>

          {links.length === 0 && (
            <div className="empty-state">
              <h3>No links saved yet</h3>

              <p>
                Click "+ Add Link" to save your first link.
              </p>
            </div>
          )}

          {links.length > 0 &&
            filteredLinks.length === 0 && (
              <div className="empty-state">
                <h3>No links found</h3>

<p>
  No links match "{searchTerm}".
</p>
              </div>
            )}
        </section>
      </main>

      {notification && (
        <div className="notification">
          ✓ {notification}
        </div>
      )}

      {isFormOpen && (
        <Modal onClose={handleCloseForm}>
          <LinkForm
            mode={editingLink ? "edit" : "add"}
            initialData={
              editingLink ?? undefined
            }
            onClose={handleCloseForm}
            onSubmit={
              editingLink
                ? handleUpdateLink
                : handleAddLink
            }
          />
        </Modal>
      )}
    </div>
  );
}

export default App;