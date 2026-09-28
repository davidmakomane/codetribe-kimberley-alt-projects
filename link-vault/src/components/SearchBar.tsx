interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

function SearchBar({
  searchTerm,
  onSearchChange
}: SearchBarProps) {
  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search your saved links..."
        aria-label="Search saved links"
        value={searchTerm}
        onChange={(event) =>
          onSearchChange(event.target.value)
        }
      />
    </div>
  );
}

export default SearchBar;