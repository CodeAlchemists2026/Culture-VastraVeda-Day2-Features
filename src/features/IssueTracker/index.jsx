import { useMemo, useState } from "react"
import "./styles.css"

const starterIssues = [
  {
    id: 101,
    title: "Festival attribution needs verification",
    category: "Festival Context",
    garment: "Phanek",
    region: "Manipur",
    description: "The listing references Ningol Chakouba, but local review notes say the ceremonial use may be overstated.",
    evidence: "Cross-check with community oral history and museum notes before keeping the current festival tag.",
    reporter: "Cultural Research Circle",
    submittedAt: "10 Apr 2026",
    status: "in review",
    priority: "high",
    resolutionNote: ""
  },
  {
    id: 102,
    title: "Weave terminology mismatch",
    category: "Terminology",
    garment: "Mekhela Chador",
    region: "Assam",
    description: "The textile note mixes generic silk language with a region-specific weave term that should be separated.",
    evidence: "Contributor comment cites Sualkuchi weaving references and requests clearer labeling.",
    reporter: "Archive Volunteer",
    submittedAt: "08 Apr 2026",
    status: "resolved",
    priority: "medium",
    resolutionNote: "Terminology updated and note split into silk type plus weave technique."
  }
]

const blankForm = {
  title: "",
  category: "Terminology",
  garment: "",
  region: "",
  description: "",
  evidence: "",
  reporter: ""
}

const statusOptions = ["open", "in review", "resolved"]
const priorityOptions = ["low", "medium", "high"]

export default function IssueTracker() {
  const [activeView, setActiveView] = useState("overview")
  const [issues, setIssues] = useState(starterIssues)
  const [formData, setFormData] = useState(blankForm)
  const [errors, setErrors] = useState({})
  const [selectedIssueId, setSelectedIssueId] = useState(starterIssues[0].id)
  const [resolutionDraft, setResolutionDraft] = useState("")

  const selectedIssue = useMemo(
    () => issues.find((issue) => issue.id === selectedIssueId) ?? issues[0] ?? null,
    [issues, selectedIssueId]
  )

  const counts = useMemo(() => ({
    total: issues.length,
    open: issues.filter((issue) => issue.status === "open").length,
    inReview: issues.filter((issue) => issue.status === "in review").length,
    resolved: issues.filter((issue) => issue.status === "resolved").length
  }), [issues])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    if (errors[name]) {
      setErrors((current) => ({ ...current, [name]: "" }))
    }
  }

  const validateForm = () => {
    const nextErrors = {}
    if (!formData.title.trim()) nextErrors.title = "Issue title is required."
    if (!formData.garment.trim()) nextErrors.garment = "Garment or entry name is required."
    if (!formData.region.trim()) nextErrors.region = "Region is required."
    if (!formData.description.trim()) nextErrors.description = "Describe the cultural accuracy concern."
    if (!formData.reporter.trim()) nextErrors.reporter = "Reporter name is required."

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validateForm()) return

    const newIssue = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }),
      status: "open",
      priority: "medium",
      resolutionNote: ""
    }

    setIssues((current) => [newIssue, ...current])
    setFormData(blankForm)
    setErrors({})
    setSelectedIssueId(newIssue.id)
    setResolutionDraft("")
    setActiveView("issues")
  }

  const updateIssue = (issueId, updates) => {
    setIssues((current) =>
      current.map((issue) => issue.id === issueId ? { ...issue, ...updates } : issue)
    )
  }

  const handleSelectIssue = (issue) => {
    setSelectedIssueId(issue.id)
    setResolutionDraft(issue.resolutionNote ?? "")
  }

  const handleStatusChange = (issue, nextStatus) => {
    const resolutionNote =
      nextStatus === "resolved"
        ? (resolutionDraft.trim() || issue.resolutionNote || "Moderator marked this issue as resolved.")
        : issue.resolutionNote

    updateIssue(issue.id, { status: nextStatus, resolutionNote })
    if (selectedIssueId === issue.id) {
      setResolutionDraft(resolutionNote)
    }
  }

  const saveResolution = () => {
    if (!selectedIssue) return
    updateIssue(selectedIssue.id, { resolutionNote: resolutionDraft.trim() })
  }

  return (
    <div className="it-shell">
      <section className="it-hero">
        <div>
          <p className="it-eyebrow">Feature 9</p>
          <h2>Cultural Accuracy Issue Tracker</h2>
          <p className="it-subtitle">
            Collect accuracy concerns from contributors, route them to moderators, and keep resolution status visible.
          </p>
        </div>
        <button className="it-primary-button" type="button" onClick={() => setActiveView("report")}>
          Report Issue
        </button>
      </section>

      <section className="it-summary-grid">
        <article className="it-stat-card">
          <span>Total Issues</span>
          <strong>{counts.total}</strong>
        </article>
        <article className="it-stat-card">
          <span>Open</span>
          <strong>{counts.open}</strong>
        </article>
        <article className="it-stat-card">
          <span>In Review</span>
          <strong>{counts.inReview}</strong>
        </article>
        <article className="it-stat-card">
          <span>Resolved</span>
          <strong>{counts.resolved}</strong>
        </article>
      </section>

      <nav className="it-tabs" aria-label="Issue tracker views">
        <button className={activeView === "overview" ? "active" : ""} type="button" onClick={() => setActiveView("overview")}>
          Overview
        </button>
        <button className={activeView === "report" ? "active" : ""} type="button" onClick={() => setActiveView("report")}>
          Issue Form
        </button>
        <button className={activeView === "issues" ? "active" : ""} type="button" onClick={() => setActiveView("issues")}>
          Public Status
        </button>
        <button className={activeView === "moderator" ? "active" : ""} type="button" onClick={() => setActiveView("moderator")}>
          Moderator Dashboard
        </button>
      </nav>

      {activeView === "overview" && (
        <section className="it-panel">
          <div className="it-overview-grid">
            <article className="it-card">
              <h3>Raise issues fast</h3>
              <p>Every garment entry can surface a visible report action with structured fields for category, region, evidence, and context.</p>
            </article>
            <article className="it-card">
              <h3>Track moderation progress</h3>
              <p>Issues move from open to in review to resolved so contributors can see whether cultural concerns are being handled.</p>
            </article>
            <article className="it-card">
              <h3>Document decisions</h3>
              <p>Moderators can add a resolution note to explain what changed, what was verified, or why the report was closed.</p>
            </article>
          </div>
          <div className="it-timeline-card">
            <h3>Status lifecycle</h3>
            <div className="it-lifecycle">
              {statusOptions.map((status) => (
                <div key={status} className="it-lifecycle-step">
                  <span className={`it-status-badge status-${status.replace(/\s+/g, "-")}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {activeView === "report" && (
        <section className="it-panel">
          <div className="it-panel-header">
            <div>
              <p className="it-eyebrow">Issue Form</p>
              <h3>Report a cultural accuracy concern</h3>
            </div>
            <p className="it-muted">Reports are stored immediately with an initial <strong>open</strong> status.</p>
          </div>

          <form className="it-form" onSubmit={handleSubmit}>
            <label>
              Issue title
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Example: Incorrect festival mapping for bridal attire" />
              {errors.title && <span className="it-error">{errors.title}</span>}
            </label>

            <div className="it-form-row">
              <label>
                Category
                <select name="category" value={formData.category} onChange={handleInputChange}>
                  <option>Terminology</option>
                  <option>Regional Attribution</option>
                  <option>Festival Context</option>
                  <option>Fabric Use</option>
                  <option>Visual Representation</option>
                </select>
              </label>

              <label>
                Priority
                <select value="medium" disabled aria-label="Default priority">
                  <option>Medium by default</option>
                </select>
              </label>
            </div>

            <div className="it-form-row">
              <label>
                Garment or entry
                <input name="garment" value={formData.garment} onChange={handleInputChange} placeholder="Example: Pochampally Saree" />
                {errors.garment && <span className="it-error">{errors.garment}</span>}
              </label>

              <label>
                Region
                <input name="region" value={formData.region} onChange={handleInputChange} placeholder="Example: Telangana" />
                {errors.region && <span className="it-error">{errors.region}</span>}
              </label>
            </div>

            <label>
              Description
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows="4" placeholder="Explain what looks inaccurate and what cultural context may be missing." />
              {errors.description && <span className="it-error">{errors.description}</span>}
            </label>

            <label>
              Evidence or references
              <textarea name="evidence" value={formData.evidence} onChange={handleInputChange} rows="3" placeholder="Optional: mention archives, oral history, museum notes, or community feedback." />
            </label>

            <label>
              Reporter name
              <input name="reporter" value={formData.reporter} onChange={handleInputChange} placeholder="Example: Meera Nair" />
              {errors.reporter && <span className="it-error">{errors.reporter}</span>}
            </label>

            <div className="it-form-actions">
              <button className="it-secondary-button" type="button" onClick={() => setFormData(blankForm)}>
                Reset
              </button>
              <button className="it-primary-button" type="submit">
                Submit Issue
              </button>
            </div>
          </form>
        </section>
      )}

      {activeView === "issues" && (
        <section className="it-panel">
          <div className="it-panel-header">
            <div>
              <p className="it-eyebrow">Public Status</p>
              <h3>Visible issue updates</h3>
            </div>
            <p className="it-muted">Contributors can see whether a report is open, under review, or resolved.</p>
          </div>

          <div className="it-issue-list">
            {issues.map((issue) => (
              <article key={issue.id} className="it-issue-card">
                <div className="it-issue-head">
                  <div>
                    <h4>{issue.title}</h4>
                    <p>{issue.garment} • {issue.region} • Reported by {issue.reporter}</p>
                  </div>
                  <span className={`it-status-badge status-${issue.status.replace(/\s+/g, "-")}`}>{issue.status}</span>
                </div>
                <p className="it-issue-body">{issue.description}</p>
                <div className="it-tag-row">
                  <span className="it-tag">{issue.category}</span>
                  <span className={`it-tag priority-${issue.priority}`}>{issue.priority} priority</span>
                  <span className="it-tag">{issue.submittedAt}</span>
                </div>
                {issue.resolutionNote && (
                  <div className="it-resolution-note">
                    <strong>Resolution:</strong> {issue.resolutionNote}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {activeView === "moderator" && (
        <section className="it-panel">
          <div className="it-panel-header">
            <div>
              <p className="it-eyebrow">Moderator Dashboard</p>
              <h3>Review and resolve submitted issues</h3>
            </div>
            <p className="it-muted">Update workflow status and capture the resolution outcome for the public log.</p>
          </div>

          <div className="it-moderator-layout">
            <aside className="it-moderator-list">
              {issues.map((issue) => (
                <button
                  key={issue.id}
                  type="button"
                  className={`it-moderator-item ${selectedIssue?.id === issue.id ? "active" : ""}`}
                  onClick={() => handleSelectIssue(issue)}
                >
                  <span>{issue.title}</span>
                  <small>{issue.region}</small>
                  <small className={`it-status-inline status-${issue.status.replace(/\s+/g, "-")}`}>{issue.status}</small>
                </button>
              ))}
            </aside>

            <div className="it-moderator-detail">
              {selectedIssue && (
                <>
                  <div className="it-detail-header">
                    <div>
                      <h4>{selectedIssue.title}</h4>
                      <p>{selectedIssue.garment} • {selectedIssue.region} • {selectedIssue.category}</p>
                    </div>
                    <div className="it-action-row">
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          type="button"
                          className={selectedIssue.status === status ? "active" : ""}
                          onClick={() => handleStatusChange(selectedIssue, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="it-detail-grid">
                    <article className="it-detail-card">
                      <span>Issue Details</span>
                      <p>{selectedIssue.description}</p>
                    </article>
                    <article className="it-detail-card">
                      <span>Evidence</span>
                      <p>{selectedIssue.evidence || "No supporting evidence added yet."}</p>
                    </article>
                  </div>

                  <div className="it-detail-grid">
                    <article className="it-detail-card">
                      <span>Reporter</span>
                      <p>{selectedIssue.reporter}</p>
                    </article>
                    <article className="it-detail-card">
                      <span>Priority</span>
                      <div className="it-priority-buttons">
                        {priorityOptions.map((priority) => (
                          <button
                            key={priority}
                            type="button"
                            className={selectedIssue.priority === priority ? "active" : ""}
                            onClick={() => updateIssue(selectedIssue.id, { priority })}
                          >
                            {priority}
                          </button>
                        ))}
                      </div>
                    </article>
                  </div>

                  <label className="it-resolution-field">
                    Resolution note
                    <textarea
                      rows="4"
                      value={resolutionDraft}
                      onChange={(event) => setResolutionDraft(event.target.value)}
                      placeholder="Describe what was verified or changed to close the issue."
                    />
                  </label>

                  <div className="it-form-actions">
                    <button className="it-secondary-button" type="button" onClick={saveResolution}>
                      Save Note
                    </button>
                    <button className="it-primary-button" type="button" onClick={() => handleStatusChange(selectedIssue, "resolved")}>
                      Mark Resolved
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
