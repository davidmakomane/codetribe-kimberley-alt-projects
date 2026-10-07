import { FormEvent, useState } from "react";
import type { Job } from "./JobCard";

interface JobFormProps {
  onAdd: (job: Job) => void;
  onClose: () => void;
}

function JobForm({ onAdd, onClose }: JobFormProps) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState<Job["status"]>("Applied");
  const [dateApplied, setDateApplied] = useState("");
  const [duties, setDuties] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (
      !company ||
      !role ||
      !dateApplied ||
      !duties ||
      !location ||
      !address ||
      !contact ||
      !requirements
    ) {
      alert("Please complete all required fields.");
      return;
    }

    const newJob: Job = {
      id: Date.now().toString(),
      company,
      role,
      status,
      dateApplied,
      duties,
      location,
      salary,
      address,
      contact,
      requirements,
    };

    onAdd(newJob);
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Add Job</h2>

          <button
            className="close-button"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Company Name *</label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. ABC Technologies"
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Junior Developer"
            />
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as Job["status"])
              }
            >
              <option value="Applied">Applied</option>
              <option value="Interviewed">Interviewed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date Applied *</label>
            <input
              type="date"
              value={dateApplied}
              onChange={(e) => setDateApplied(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Location *</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kimberley"
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Company address"
            />
          </div>

          <div className="form-group">
            <label>Contact *</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone number"
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. R10 000/month"
            />
          </div>

          <div className="form-group">
            <label>Job Duties *</label>
            <textarea
              rows={4}
              value={duties}
              onChange={(e) => setDuties(e.target.value)}
              placeholder="Enter the main job duties..."
            />
          </div>

          <div className="form-group">
            <label>Requirements *</label>
            <textarea
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              placeholder="Enter job requirements..."
            />
          </div>

          <button className="btn btn-primary" type="submit">
            Add Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default JobForm;