interface HeaderProps {
  onAddClick: () => void;
}

function Header({
  onAddClick
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-content">
        <div>
          <h1>Link Vault</h1>

          <p>
            Keep your favourite links in one place.
          </p>
        </div>

        <button
          className="add-link-btn"
          onClick={onAddClick}
        >
          + Add Link
        </button>
      </div>
    </header>
  );
}

export default Header;