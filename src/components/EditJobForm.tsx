import { FormEvent, useState } from "react";
import type { Job } from "./JobCard";

interface EditJobFormProps {
  job: Job;
  onUpdate: (job: Job) => void;
  onCancel: () => void;
}

function EditJobForm({
  job,
  onUpdate,
  onCancel,
}: EditJobFormProps) {
  const [company, setCompany] = useState(job.company);
  const [role, setRole] = useState(job.role);
  const [status, setStatus] = useState<Job["status"]>(job.status);
  const [dateApplied, setDateApplied] = useState(job.dateApplied);
  const [duties, setDuties] = useState(job.duties);
  const [location, setLocation] = useState(job.location);
  const [salary, setSalary] = useState(job.salary);
  const [address, setAddress] = useState(job.address);
  const [contact, setContact] = useState(job.contact);
  const [requirements, setRequirements] = useState(
    job.requirements
  );

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

    const updatedJob: Job = {
      id: job.id,
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

    onUpdate(updatedJob);
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Job</h2>

          <button
            className="close-button"
            type="button"
            onClick={onCancel}
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
            />
          </div>

          <div className="form-group">
            <label>Role *</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
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
            />
          </div>

          <div className="form-group">
            <label>Address *</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contact *</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Salary</label>
            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Job Duties *</label>
            <textarea
              rows={4}
              value={duties}
              onChange={(e) => setDuties(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Requirements *</label>
            <textarea
              rows={4}
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            />
          </div>

          <div className="details-actions">
            <button className="btn btn-primary" type="submit">
              Save Changes
            </button>

            <button
              className="btn btn-secondary"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditJobForm;