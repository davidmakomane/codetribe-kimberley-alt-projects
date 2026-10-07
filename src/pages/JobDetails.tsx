import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import EditJobForm from "../components/EditJobForm";
import type { Job } from "../components/JobCard";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/jobs/${id}`
        );

        if (!response.ok) {
          throw new Error("Job not found");
        }

        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error(error);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    getJob();
  }, [id]);

  const handleUpdate = async (updatedJob: Job) => {
    try {
      const response = await fetch(
        `http://localhost:3001/jobs/${updatedJob.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedJob),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update job");
      }

      const data = await response.json();

      setJob(data);
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert("Could not update the job.");
    }
  };

  const handleDelete = async () => {
    if (!job) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:3001/jobs/${job.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
      alert("Could not delete the job.");
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="details-container">
          <p>Loading job...</p>
        </main>
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navbar />

        <main className="not-found">
          <h1>Job Not Found</h1>
          <p>
            The job application you are looking for does not
            exist.
          </p>

          <Link to="/home" className="btn btn-primary">
            Back to Dashboard
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="details-container">
        <Link to="/home" className="back-link">
          ← Back to Dashboard
        </Link>

        <div className="details-card">
          <div className="details-header">
            <div>
              <h1>{job.role}</h1>
              <h2>{job.company}</h2>
              <p>{job.location}</p>
            </div>

            <span
              className={`status ${
                job.status === "Applied"
                  ? "status-applied"
                  : job.status === "Interviewed"
                  ? "status-interviewed"
                  : "status-rejected"
              }`}
            >
              {job.status}
            </span>
          </div>

          <div className="details-section">
            <h3>Job Information</h3>

            <p>
              <strong>Date Applied:</strong>{" "}
              {job.dateApplied}
            </p>

            <p>
              <strong>Salary:</strong>{" "}
              {job.salary || "Not specified"}
            </p>

            <p>
              <strong>Address:</strong> {job.address}
            </p>

            <p>
              <strong>Contact:</strong> {job.contact}
            </p>
          </div>

          <div className="details-section">
            <h3>Job Description & Duties</h3>
            <p>{job.duties}</p>
          </div>

          <div className="details-section">
            <h3>Requirements</h3>
            <p>{job.requirements}</p>
          </div>

          <div className="details-actions">
            <button
              className="btn btn-warning"
              onClick={() => setEditing(true)}
            >
              Edit Job
            </button>

            <button
              className="btn btn-danger"
              onClick={handleDelete}
            >
              Delete Job
            </button>
          </div>
        </div>
      </main>

      {editing && (
        <EditJobForm
          job={job}
          onUpdate={handleUpdate}
          onCancel={() => setEditing(false)}
        />
      )}
    </>
  );
}

export default JobDetails;