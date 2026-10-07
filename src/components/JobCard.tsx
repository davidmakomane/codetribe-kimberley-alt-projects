import { Link } from "react-router-dom";

export interface Job {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interviewed" | "Rejected";
  dateApplied: string;
  duties: string;
  location: string;
  salary: string;
  address: string;
  contact: string;
  requirements: string;
}

interface JobCardProps {
  job: Job;
  onDelete: (id: string) => void;
}

function JobCard({ job, onDelete }: JobCardProps) {
  const getStatusClass = () => {
    if (job.status === "Applied") {
      return "status status-applied";
    }

    if (job.status === "Interviewed") {
      return "status status-interviewed";
    }

    return "status status-rejected";
  };

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h3>{job.role}</h3>
          <p className="company">{job.company}</p>
        </div>

        <span className={getStatusClass()}>{job.status}</span>
      </div>

      <div className="job-info">
        <span>📍 {job.location}</span>
        <span>📅 {job.dateApplied}</span>
      </div>

      <p>{job.duties}</p>

      <div className="job-card-actions">
        <Link to={`/jobs/${job.id}`} className="btn btn-primary">
          View Details
        </Link>

        <button
          className="btn btn-danger"
          onClick={() => onDelete(job.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default JobCard;