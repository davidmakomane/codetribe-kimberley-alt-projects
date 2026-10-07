import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";
import type { Job } from "../components/JobCard";
import JobForm from "../components/JobForm";

function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "All";
  const sort = searchParams.get("sort") || "desc";

  // GET all jobs from JSON Server
  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await fetch("http://localhost:3001/jobs");

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data);
      } catch (error) {
        console.error(error);
        alert("Could not load jobs.");
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  // Search
  const handleSearch = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    setSearchParams(params);
  };

  // Status filter
  const handleStatus = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value === "All") {
      params.delete("status");
    } else {
      params.set("status", value);
    }

    setSearchParams(params);
  };

  // Sort
  const handleSort = (value: string) => {
    const params = new URLSearchParams(searchParams);

    params.set("sort", value);

    setSearchParams(params);
  };

  // CREATE
  const handleAddJob = async (newJob: Job) => {
    try {
      const response = await fetch("http://localhost:3001/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        throw new Error("Failed to add job");
      }

      const savedJob = await response.json();

      setJobs((currentJobs) => [...currentJobs, savedJob]);

      setShowForm(false);
    } catch (error) {
      console.error(error);
      alert("Could not add the job.");
    }
  };

  // DELETE
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/jobs/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete job");
      }

      setJobs((currentJobs) =>
        currentJobs.filter((job) => job.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Could not delete the job.");
    }
  };

  // SEARCH + FILTER + SORT
  const filteredJobs = jobs
    .filter((job) => {
      const searchText = search.toLowerCase();

      return (
        job.company.toLowerCase().includes(searchText) ||
        job.role.toLowerCase().includes(searchText)
      );
    })
    .filter((job) => {
      if (status === "All") {
        return true;
      }

      return job.status === status;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateApplied).getTime();
      const dateB = new Date(b.dateApplied).getTime();

      if (sort === "asc") {
        return dateA - dateB;
      }

      return dateB - dateA;
    });

  const totalJobs = jobs.length;

  const appliedJobs = jobs.filter(
    (job) => job.status === "Applied"
  ).length;

  const interviewedJobs = jobs.filter(
    (job) => job.status === "Interviewed"
  ).length;

  const rejectedJobs = jobs.filter(
    (job) => job.status === "Rejected"
  ).length;

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="dashboard">
          <div className="dashboard-container">
            <p>Loading jobs...</p>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="dashboard">
        <div className="dashboard-container">

          {/* Dashboard Header */}
          <div className="dashboard-header">
            <div>
              <h1>Welcome to JobTrack 👋</h1>

              <p>
                Keep track of your job applications and
                opportunities.
              </p>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              + Add Job
            </button>
          </div>

          {/* Statistics */}
          <div className="stat-grid">
            <div className="stat-card">
              <h3>Total Applications</h3>
              <strong>{totalJobs}</strong>
            </div>

            <div className="stat-card">
              <h3>Applied</h3>
              <strong>{appliedJobs}</strong>
            </div>

            <div className="stat-card">
              <h3>Interviews</h3>
              <strong>{interviewedJobs}</strong>
            </div>

            <div className="stat-card">
              <h3>Rejected</h3>
              <strong>{rejectedJobs}</strong>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="toolbar">
            <div className="toolbar-row">

              <input
                type="text"
                placeholder="Search company or role..."
                value={search}
                onChange={(e) =>
                  handleSearch(e.target.value)
                }
              />

              <select
                value={status}
                onChange={(e) =>
                  handleStatus(e.target.value)
                }
              >
                <option value="All">All Statuses</option>
                <option value="Applied">Applied</option>
                <option value="Interviewed">
                  Interviewed
                </option>
                <option value="Rejected">Rejected</option>
              </select>

              <select
                value={sort}
                onChange={(e) =>
                  handleSort(e.target.value)
                }
              >
                <option value="desc">
                  Newest First
                </option>

                <option value="asc">
                  Oldest First
                </option>
              </select>

            </div>
          </div>

          {/* Applications */}
          <section>
            <div className="section-header">
              <h2>Recent Applications</h2>
              <span>
                {filteredJobs.length} application
                {filteredJobs.length !== 1 ? "s" : ""}
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="empty-state">
                <h3>No jobs found</h3>

                <p>
                  Try changing your search or filters,
                  or add a new application.
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  + Add Job
                </button>
              </div>
            ) : (
              <div className="job-grid">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Add Job Modal */}
      {showForm && (
        <JobForm
          onAdd={handleAddJob}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

export default Home;