import { useRef } from 'react';
import {
  FiAward, FiBarChart2, FiCalendar, FiCheckCircle,
  FiDownload, FiPrinter, FiUser, FiXCircle,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import nuVisionLogo from '../../assets/nu-vision-logo.svg';

function grade(marks: number) {
  if (marks >= 90) return { letter: 'A+', label: 'Outstanding',    cls: 'bg-success' };
  if (marks >= 80) return { letter: 'A',  label: 'Excellent',      cls: 'bg-success' };
  if (marks >= 70) return { letter: 'B',  label: 'Good',           cls: 'bg-primary' };
  if (marks >= 60) return { letter: 'C',  label: 'Satisfactory',   cls: 'bg-warning text-dark' };
  if (marks >= 50) return { letter: 'D',  label: 'Pass',           cls: 'bg-secondary' };
  return               { letter: 'F',  label: 'Fail',           cls: 'bg-danger' };
}

function overallRemark(avg: number) {
  if (avg >= 90) return 'Exceptional performance. Continue to excel!';
  if (avg >= 80) return 'Excellent work. Well done!';
  if (avg >= 70) return 'Good performance. Keep up the effort!';
  if (avg >= 60) return 'Satisfactory. There is room for improvement.';
  return 'Needs significant improvement. Please see the class teacher.';
}

export function ParentReportPage() {
  const { user }  = useAuth();
  const { students, results, attendance } = useApp();
  const printRef  = useRef<HTMLDivElement>(null);

  const child      = students.find((s) => s.id === user?.studentId);
  const myResults  = results.filter((r) => r.studentId === user?.studentId);
  const myAttend   = attendance.filter((a) => a.studentId === user?.studentId);

  const presentDays  = myAttend.filter((a) => a.status === 'Present').length;
  const absentDays   = myAttend.filter((a) => a.status === 'Absent').length;
  const totalMarks   = myResults.reduce((s, r) => s + r.marks, 0);
  const avgMarks     = myResults.length ? totalMarks / myResults.length : 0;
  const avgGpa       = myResults.length
    ? (myResults.reduce((s, r) => s + r.gpa, 0) / myResults.length).toFixed(2)
    : '—';
  const overallGrade = myResults.length ? grade(avgMarks) : null;

  function handlePrint() {
    window.print();
  }

  if (!child) {
    return (
      <div className="alert alert-warning mt-4">
        No student record linked to your account. Please contact the school office.
      </div>
    );
  }

  return (
    <div>
      {/* Page heading — hidden in print */}
      <div className="page-heading no-print">
        <div>
          <h1>Report Card</h1>
          <p>{child.firstName} {child.lastName} — {child.className}</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={handlePrint}>
            <FiPrinter className="me-2" /> Print
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <FiDownload className="me-2" /> Download PDF
          </button>
        </div>
      </div>

      {/* ── Report card (printable area) ── */}
      <div className="report-card" ref={printRef} id="report-card-print">

        {/* School header */}
        <div className="report-header">
          <img src={nuVisionLogo} alt="Nu Vision High School" className="report-school-logo" />
          <div className="report-school-info">
            <h2 className="report-school-name">Nu Vision High School</h2>
            <p className="report-school-sub">Excellence in Education • Est. 2010</p>
            <p className="report-school-addr">123 Academy Drive, Springfield • office@nuvision.edu • +1 555 0100</p>
          </div>
          <div className="report-card-label">REPORT CARD</div>
        </div>

        <div className="report-divider" />

        {/* Term info */}
        <div className="report-term-bar">
          <div><span className="report-term-key">Academic Year:</span> <strong>2025 – 2026</strong></div>
          <div><span className="report-term-key">Term:</span> <strong>Second Term</strong></div>
          <div><span className="report-term-key">Date Issued:</span> <strong>2026-06-26</strong></div>
          <div><span className="report-term-key">Class:</span> <strong>{child.className}</strong></div>
        </div>

        <div className="report-divider" />

        {/* Student profile + stats row */}
        <div className="report-profile-row">
          <img src={child.profilePhoto} alt={child.firstName} className="report-student-photo" />
          <div className="report-student-details">
            <h3 className="report-student-name">{child.firstName} {child.lastName}</h3>
            <table className="report-info-table">
              <tbody>
                <tr>
                  <td><FiUser size={12} className="me-1" />Student ID</td>
                  <td><strong>{child.id}</strong></td>
                  <td>Gender</td>
                  <td><strong>{child.gender}</strong></td>
                </tr>
                <tr>
                  <td><FiCalendar size={12} className="me-1" />Date of Birth</td>
                  <td><strong>{child.dateOfBirth}</strong></td>
                  <td>Parent / Guardian</td>
                  <td><strong>{child.parentName}</strong></td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td><strong>{child.email}</strong></td>
                  <td>Phone</td>
                  <td><strong>{child.parentPhone}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary badge */}
          <div className="report-summary-badge">
            <div className="report-badge-avg">{avgMarks.toFixed(1)}%</div>
            <div className="report-badge-grade">{overallGrade?.letter ?? '—'}</div>
            <div className="report-badge-label">Overall Average</div>
            <div className="report-badge-gpa">GPA {avgGpa}</div>
          </div>
        </div>

        {/* Results table */}
        <h5 className="report-section-title"><FiBarChart2 className="me-2" />Academic Performance</h5>
        <table className="report-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th className="text-center">Marks / 100</th>
              <th className="text-center">GPA</th>
              <th className="text-center">Grade</th>
              <th>Remarks</th>
              <th className="text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {myResults.map((r, i) => {
              const g = grade(r.marks);
              return (
                <tr key={r.id}>
                  <td className="text-muted">{i + 1}</td>
                  <td className="fw-semibold">{r.subject}</td>
                  <td className="text-center">
                    <div className="report-marks-cell">
                      <div
                        className="report-marks-bar"
                        style={{ width: `${r.marks}%`, background: r.marks >= 80 ? '#16a34a' : r.marks >= 60 ? '#d97706' : '#dc2626' }}
                      />
                      <span className="report-marks-num">{r.marks}</span>
                    </div>
                  </td>
                  <td className="text-center">{r.gpa.toFixed(1)}</td>
                  <td className="text-center">
                    <span className={`badge ${g.cls}`}>{g.letter}</span>
                  </td>
                  <td className="text-muted small">{g.label}</td>
                  <td className="text-center">
                    {r.marks >= 50
                      ? <span className="text-success"><FiCheckCircle size={15} /></span>
                      : <span className="text-danger"><FiXCircle size={15} /></span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="report-table-total">
              <td colSpan={2}><strong>TOTAL / AVERAGE</strong></td>
              <td className="text-center"><strong>{totalMarks} / {myResults.length * 100} &nbsp;|&nbsp; {avgMarks.toFixed(1)}%</strong></td>
              <td className="text-center"><strong>{avgGpa}</strong></td>
              <td className="text-center"><span className={`badge ${overallGrade?.cls ?? ''}`}>{overallGrade?.letter ?? '—'}</span></td>
              <td colSpan={2} className="text-muted small">{overallGrade?.label}</td>
            </tr>
          </tfoot>
        </table>

        {/* Attendance + conduct row */}
        <div className="report-bottom-row">
          {/* Attendance */}
          <div className="report-attend-box">
            <h5 className="report-section-title mb-2"><FiCheckCircle className="me-2" />Attendance</h5>
            <table className="report-info-table w-100">
              <tbody>
                <tr>
                  <td>Days Present</td>
                  <td><strong className="text-success">{presentDays}</strong></td>
                  <td>Days Absent</td>
                  <td><strong className="text-danger">{absentDays}</strong></td>
                </tr>
                <tr>
                  <td>Total School Days</td>
                  <td><strong>{presentDays + absentDays}</strong></td>
                  <td>Attendance Rate</td>
                  <td>
                    <strong>
                      {presentDays + absentDays > 0
                        ? `${Math.round((presentDays / (presentDays + absentDays)) * 100)}%`
                        : '—'}
                    </strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Overall remark */}
          <div className="report-remark-box">
            <h5 className="report-section-title mb-2"><FiAward className="me-2" />Class Teacher's Remarks</h5>
            <p className="report-remark-text">"{overallRemark(avgMarks)}"</p>
            <div className="report-sign-row">
              <div className="report-sign-item">
                <div className="report-sign-line" />
                <div className="small text-muted">Class Teacher</div>
              </div>
              <div className="report-sign-item">
                <div className="report-sign-line" />
                <div className="small text-muted">Head of Academics</div>
              </div>
              <div className="report-sign-item">
                <div className="report-sign-line" />
                <div className="small text-muted">Principal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <p>This is an official academic report issued by Nu Vision High School. For queries contact the school office.</p>
          <p>© 2026 Nu Vision High School Management System — Confidential</p>
        </div>
      </div>

      {/* Grade key legend — visible on screen only */}
      <div className="card border-0 shadow-sm mt-4 no-print">
        <div className="card-header bg-white border-bottom py-3">
          <h6 className="mb-0 fw-bold">Grading Scale</h6>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3">
            {[
              { range: '90–100', letter: 'A+', label: 'Outstanding',  cls: 'bg-success' },
              { range: '80–89',  letter: 'A',  label: 'Excellent',    cls: 'bg-success' },
              { range: '70–79',  letter: 'B',  label: 'Good',         cls: 'bg-primary' },
              { range: '60–69',  letter: 'C',  label: 'Satisfactory', cls: 'bg-warning text-dark' },
              { range: '50–59',  letter: 'D',  label: 'Pass',         cls: 'bg-secondary' },
              { range: '0–49',   letter: 'F',  label: 'Fail',         cls: 'bg-danger' },
            ].map((g) => (
              <div key={g.letter} className="d-flex align-items-center gap-2">
                <span className={`badge ${g.cls}`} style={{ minWidth: 32 }}>{g.letter}</span>
                <span className="small text-muted">{g.range} — {g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
