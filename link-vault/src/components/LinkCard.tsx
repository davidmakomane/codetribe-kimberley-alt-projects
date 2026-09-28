import type { Link } from "../types/Links";

interface LinkCardProps {
  link: Link;
  onEdit: (link: Link) => void;
  onDelete: (id: number) => void;
}

function LinkCard({
  link,
  onEdit,
  onDelete
}: LinkCardProps) {
  return (
    <article className="link-card">
      <div className="link-card-main">
        <h3>{link.title}</h3>

        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="link-url"
        >
          {link.url}
        </a>

        <p className="link-description">
          {link.description}
        </p>

        <div className="tags">
          {link.tags.map((tag) => (
            <span
              key={tag}
              className="tag"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="link-actions">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="action-button"
        >
          Open
        </a>

        <button
          onClick={() => onEdit(link)}
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(link.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default LinkCard;