import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import { FiFileText, FiPlus } from 'react-icons/fi';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function marksToGpa(marks: number): number {
  return Math.min(4.0, parseFloat((marks / 100 * 4.0).toFixed(1)));
}

function gradeLabel(marks: number) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

export function ResultsPage() {
  const { user } = useAuth();
  const { results, students, classes, addResult, updateResult, addToast } = useApp();

  const [marks,      setMarks]      = useState('');
  const [modalSubject, setModalSubject] = useState('');

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const isParent  = user?.role === 'parent';
  const canRecord = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'academic';

  const teacherSubject = user?.subject ?? '';
  const effectiveModalSubject = isTeacher ? teacherSubject : modalSubject;

  const [filterClass,   setFilterClass]   = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [showModal,  setShowModal]  = useState(false);
  const [studentId,  setStudentId]  = useState('');
  const [modalClass, setModalClass] = useState('all');

  const allSubjects = [...new Set(classes.flatMap((c) => c.subjects))].sort();

  const filteredResults = results.filter((r) => {
    if (isStudent && user?.id && r.studentId !== user.id) return false;
    if (isParent && user?.studentId && r.studentId !== user.studentId) return false;
    const classOk   = filterClass === 'all'   || r.className === filterClass;
    const subjectOk = isTeacher
      ? r.subject === teacherSubject
      : (filterSubject === 'all' || r.subject === filterSubject);
    return classOk && subjectOk;
  });

  // Students shown in the modal — optionally filtered by class
  const modalStudents = students.filter((s) =>
    modalClass === 'all' ? true : s.className === modalClass
  );

  function openModal() {
    setStudentId('');
    setModalClass(user?.className ?? 'all');
    setModalSubject(isTeacher ? teacherSubject : '');
    setMarks('');
    setShowModal(true);
  }

  function closeModal() { setShowModal(false); }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const marksNum = parseInt(marks, 10);
    const subjectVal = isTeacher ? teacherSubject : modalSubject;
    if (!studentId || !subjectVal || subjectVal === 'all' || isNaN(marksNum)) return;

    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const existing = results.find((r) => r.studentId === studentId && r.subject === subjectVal);
    const record = {
      id: existing?.id ?? `RES-${Date.now()}`,
      studentId,
      studentName: `${student.firstName} ${student.lastName}`,
      className:   student.className,
      subject:     subjectVal,
      marks:       marksNum,
      gpa:         marksToGpa(marksNum),
    };

    if (existing) {
      updateResult(record);
      addToast({ title: 'Marks updated', message: `${subjectVal} marks for ${student.firstName} updated.`, variant: 'success' });
    } else {
      addResult(record);
      addToast({ title: 'Marks recorded', message: `${subjectVal} marks for ${student.firstName} saved.`, variant: 'success' });
    }
    closeModal();
  }

  const marksNum   = parseInt(marks, 10);
  const previewGpa = !isNaN(marksNum) && marks !== '' ? marksToGpa(marksNum) : null;

  return (
    <div>
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <h1>Results Management</h1>
          <p>
            {isTeacher
              ? <>Subject: <strong>{teacherSubject}</strong>{user?.className ? <> &nbsp;·&nbsp; Class: <strong>{user.className}</strong></> : null}</>
              : isStudent || isParent
              ? 'View your academic results and performance.'
              : 'Add marks, update grades, calculate GPA, and generate report cards.'}
          </p>
        </div>
        <div className="d-flex gap-2">
          {canRecord && (
            <button className="btn btn-primary" onClick={openModal}>
              <FiPlus className="me-2" /> Record Marks
            </button>
          )}
          <button className="btn btn-outline-primary">
            <FiFileText className="me-2" /> Report Card
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Class</label>
            <select className="form-select" value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="all">All Classes</option>
              {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label fw-semibold">Subject</label>
            {isTeacher ? (
              <input className="form-control bg-light" value={teacherSubject} readOnly />
            ) : (
              <select className="form-select" value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                <option value="all">All Subjects</option>
                {allSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            )}
          </div>
          <div className="col-md-4">
            <div className="text-muted small">
              Showing <strong>{filteredResults.length}</strong> record{filteredResults.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Table + Chart */}
      <div className="row g-4">
        <div className="col-xl-7">
          <DataTable
            rows={filteredResults}
            columns={[
              {
                key: 'student', title: 'Student',
                render: (item) => (
                  <>
                    <div className="fw-semibold">{item.studentName}</div>
                    <div className="text-muted small">{item.studentId}</div>
                  </>
                ),
              },
              { key: 'class',   title: 'Class',   render: (item) => item.className },
              { key: 'subject', title: 'Subject', render: (item) => item.subject },
              {
                key: 'marks', title: 'Marks',
                render: (item) => (
                  <span className={item.marks >= 80 ? 'text-success fw-bold' : item.marks >= 60 ? 'text-warning fw-bold' : 'text-danger fw-bold'}>
                    {item.marks}
                  </span>
                ),
              },
              {
                key: 'grade', title: 'Grade',
                render: (item) => (
                  <span className={`badge ${item.marks >= 80 ? 'bg-success' : item.marks >= 60 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                    {gradeLabel(item.marks)}
                  </span>
                ),
              },
              { key: 'gpa', title: 'GPA', render: (item) => item.gpa.toFixed(1) },
            ]}
          />
        </div>

        <div className="col-xl-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold">
              Performance Analysis
              {isTeacher && <span className="text-muted fw-normal ms-2 small">— {teacherSubject}</span>}
            </div>
            <div className="card-body" style={{ minHeight: 280 }}>
              {filteredResults.length === 0 ? (
                <p className="text-muted text-center py-5 mb-0">No results to display for the current filters.</p>
              ) : (
              <Bar
                data={{
                  labels: filteredResults.map((r) => r.studentName),
                  datasets: [{
                    label: 'Marks',
                    data: filteredResults.map((r) => r.marks),
                    backgroundColor: filteredResults.map((r) =>
                      r.marks >= 80 ? '#16a34a' : r.marks >= 60 ? '#d97706' : '#dc2626'
                    ),
                    borderRadius: 4,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { display: false } },
                  scales: { y: { min: 0, max: 100 } },
                }}
              />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Record Marks Modal */}
      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title fw-bold">Record Student Marks</h5>
                  <button type="button" className="btn-close" onClick={closeModal} />
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">

                    {/* Subject row — locked for teachers */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Subject</label>
                      {isTeacher ? (
                        <input className="form-control bg-light" value={teacherSubject} readOnly />
                      ) : (
                        <select
                          className="form-select"
                          value={modalSubject}
                          onChange={(e) => setModalSubject(e.target.value)}
                          required
                        >
                          <option value="">— Select subject —</option>
                          {allSubjects.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      )}
                    </div>

                    {/* Class filter to narrow down students */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Filter by Class</label>
                      <select
                        className="form-select"
                        value={modalClass}
                        onChange={(e) => { setModalClass(e.target.value); setStudentId(''); }}
                      >
                        <option value="all">All Classes</option>
                        {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>

                    {/* Student picker */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Student</label>
                      <select
                        className="form-select"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        required
                      >
                        <option value="">— Select student —</option>
                        {modalStudents.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.firstName} {s.lastName} — {s.className}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Marks input */}
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Marks <span className="text-muted fw-normal">(0 – 100)</span>
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min={0}
                        max={100}
                        value={marks}
                        onChange={(e) => setMarks(e.target.value)}
                        placeholder="Enter marks out of 100"
                        required
                      />
                    </div>

                    {previewGpa !== null && (
                      <div className="alert alert-info py-2 mb-0 small">
                        Grade: <strong>{gradeLabel(marksNum)}</strong>
                        &nbsp;·&nbsp;GPA: <strong>{previewGpa.toFixed(1)}</strong> / 4.0
                      </div>
                    )}
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isTeacher ? false : !effectiveModalSubject}
                    >
                      Save Marks
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </div>
  );
}
