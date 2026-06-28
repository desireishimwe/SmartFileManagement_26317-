import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiCheckCircle, FiDownload, FiXCircle } from 'react-icons/fi';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { AttendanceStatus } from '../../types';

export function AttendancePage() {
  const { user } = useAuth();
  const { attendance, students, classes, saveAttendance, addToast } = useApp();

  if (user?.role === 'student') return <Navigate to="/student/dashboard" replace />;

  const isTeacher = user?.role === 'teacher';
  const canMark   = user?.role === 'teacher' || user?.role === 'admin' || user?.role === 'academic';

  const defaultClass = isTeacher
    ? (user?.className ?? classes[0]?.name ?? '')
    : (classes[0]?.name ?? '');

  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10));
  const [className, setClassName] = useState(defaultClass);
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});

  const classStudents = students.filter((s) => s.className === className);

  // Pre-fill status from existing records whenever date or class changes
  useEffect(() => {
    const init: Record<string, AttendanceStatus> = {};
    students
      .filter((s) => s.className === className)
      .forEach((s) => {
        const existing = attendance.find((a) => a.studentId === s.id && a.date === date);
        init[s.id] = existing?.status ?? 'Present';
      });
    setStatusMap(init);
  }, [className, date, students, attendance]);

  function toggle(studentId: string, status: AttendanceStatus) {
    setStatusMap((prev) => ({ ...prev, [studentId]: status }));
  }

  function handleSubmit() {
    if (classStudents.length === 0) return;
    const records = classStudents.map((s) => ({
      id: `ATT-${s.id}-${date}`,
      date,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      className,
      status: statusMap[s.id] ?? 'Present',
    }));
    saveAttendance(records);
    addToast({
      title: 'Attendance submitted',
      message: `${className} attendance for ${date} has been saved.`,
      variant: 'success',
    });
  }

  const presentCount = Object.values(statusMap).filter((v) => v === 'Present').length;
  const absentCount  = Object.values(statusMap).filter((v) => v === 'Absent').length;

  const filteredLog = attendance.filter((a) => a.className === className);

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Attendance Management</h1>
          <p>Mark daily attendance, review present and absent status, and export reports.</p>
        </div>
        <button className="btn btn-outline-primary">
          <FiDownload className="me-2" /> Attendance Report
        </button>
      </div>

      {/* ── Mark Attendance panel (teachers / admin / academic only) ── */}
      {canMark && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h6 className="mb-0 fw-bold">Mark Attendance</h6>
          </div>
          <div className="card-body">

            {/* Filters row */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Date</label>
                <input
                  className="form-control"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold">Class</label>
                {isTeacher ? (
                  <input className="form-control bg-light" value={className} readOnly />
                ) : (
                  <select
                    className="form-select"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                  >
                    {classes.map((c) => (
                      <option key={c.id}>{c.name}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Student list */}
            {classStudents.length === 0 ? (
              <p className="text-muted">No students found for this class.</p>
            ) : (
              <>
                <div className="table-responsive mb-3">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th style={{ width: 40 }}>#</th>
                        <th>Student</th>
                        <th>ID</th>
                        <th className="text-center">Present</th>
                        <th className="text-center">Absent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStudents.map((s, i) => {
                        const status = statusMap[s.id] ?? 'Present';
                        return (
                          <tr key={s.id}>
                            <td className="text-muted">{i + 1}</td>
                            <td className="fw-semibold">{s.firstName} {s.lastName}</td>
                            <td className="text-muted small">{s.id}</td>
                            <td className="text-center">
                              <button
                                type="button"
                                className={`btn btn-sm ${status === 'Present' ? 'btn-success' : 'btn-outline-success'}`}
                                onClick={() => toggle(s.id, 'Present')}
                              >
                                <FiCheckCircle className="me-1" />Present
                              </button>
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className={`btn btn-sm ${status === 'Absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                                onClick={() => toggle(s.id, 'Absent')}
                              >
                                <FiXCircle className="me-1" />Absent
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted small">
                    <span className="text-success fw-semibold">{presentCount} present</span>
                    &nbsp;·&nbsp;
                    <span className="text-danger fw-semibold">{absentCount} absent</span>
                    &nbsp;·&nbsp;{classStudents.length} total
                  </span>
                  <button className="btn btn-primary" onClick={handleSubmit}>
                    <FiCheckCircle className="me-2" />Submit Attendance
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── Attendance log ── */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
          <h6 className="mb-0 fw-bold">Attendance Log — {className}</h6>
          {!canMark && (
            <select
              className="form-select form-select-sm w-auto"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            >
              {classes.map((c) => <option key={c.id}>{c.name}</option>)}
            </select>
          )}
        </div>
        <div className="card-body p-0">
          <DataTable
            rows={filteredLog}
            columns={[
              { key: 'date',    title: 'Date',    render: (item) => item.date },
              {
                key: 'student', title: 'Student',
                render: (item) => (
                  <>
                    <div className="fw-semibold">{item.studentName}</div>
                    <div className="text-muted small">{item.studentId}</div>
                  </>
                ),
              },
              { key: 'class',  title: 'Class',  render: (item) => item.className },
              {
                key: 'status', title: 'Status',
                render: (item) => (
                  <span className={`badge text-bg-${item.status === 'Present' ? 'success' : 'danger'}`}>
                    {item.status}
                  </span>
                ),
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
