import { useState } from "react";
import type { FormEvent } from "react";

import type { Link } from "../types/Links";

interface LinkFormProps {
  mode: "add" | "edit";
  initialData?: Link;
  onClose: () => void;
  onSubmit: (link: Link) => void;
}

function LinkForm({
  mode,
  initialData,
  onClose,
  onSubmit
}: LinkFormProps) {
  const [title, setTitle] = useState(
    initialData?.title ?? ""
  );

  const [url, setUrl] = useState(
    initialData?.url ?? ""
  );

  const [description, setDescription] =
    useState(
      initialData?.description ?? ""
    );

  const [tags, setTags] = useState(
    initialData?.tags.join(", ") ?? ""
  );

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newLink: Link = {
      id: initialData?.id ?? Date.now(),

      title: title.trim(),

      url: url.trim(),

      description: description.trim(),

      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
    };

    onSubmit(newLink);
  };

  return (
    <form
      className="link-form"
      onSubmit={handleSubmit}
    >
      <div className="form-header">
        <div>
          <h2>
            {mode === "add"
              ? "Add Link"
              : "Edit Link"}
          </h2>

          <p>
            {mode === "add"
              ? "Save a favourite website to your Link Vault."
              : "Update your saved link."}
          </p>
        </div>

        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      <div className="form-group">
        <label htmlFor="title">
          Title
        </label>

        <input
          id="title"
          type="text"
          placeholder="e.g. React Documentation"
          value={title}
          onChange={(event) =>
            setTitle(event.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="url">
          Link
        </label>

        <input
          id="url"
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(event) =>
            setUrl(event.target.value)
          }
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">
          Description
        </label>

        <textarea
          id="description"
          placeholder="What is this link useful for?"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          rows={4}
        />
      </div>

      <div className="form-group">
        <label htmlFor="tags">
          Tags
        </label>

        <input
          id="tags"
          type="text"
          placeholder="e.g. react, coding, learning"
          value={tags}
          onChange={(event) =>
            setTags(event.target.value)
          }
        />

        <small>
          Separate tags with commas.
        </small>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="cancel-btn"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="save-btn"
        >
          {mode === "add"
            ? "Save Link"
            : "Update Link"}
        </button>
      </div>
    </form>
  );
}

export default LinkForm;