import { FiAlertTriangle, FiAward, FiBarChart2, FiCheckCircle, FiGrid, FiTrendingUp, FiUsers, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function AcademicDashboardPage() {
  const { user } = useAuth();
  const { students, classes, attendance, results } = useApp();

  // Attendance breakdown
  const totalAttendance = attendance.length;
  const presentCount    = attendance.filter((a) => a.status === 'Present').length;
  const absentCount     = totalAttendance - presentCount;
  const attendanceRate  = totalAttendance ? Math.round((presentCount / totalAttendance) * 100) : 0;

  // Students with 2+ absences (poor attendance alert)
  const absenteeMap = attendance
    .filter((a) => a.status === 'Absent')
    .reduce<Record<string, { name: string; count: number; className: string }>>((acc, a) => {
      if (!acc[a.studentId]) acc[a.studentId] = { name: a.studentName, count: 0, className: a.className };
      acc[a.studentId].count++;
      return acc;
    }, {});
  const poorAttendance = Object.values(absenteeMap).filter((s) => s.count >= 1);

  // Academic performance by class
  const classPerfMap = classes.map((cls) => {
    const classResults = results.filter((r) => r.className === cls.name);
    const avg = classResults.length
      ? Math.round(classResults.reduce((s, r) => s + r.marks, 0) / classResults.length)
      : null;
    return { name: cls.name, avg, count: classResults.length };
  });

  // Top performers
  const topStudents = [...results]
    .sort((a, b) => b.marks - a.marks)
    .slice(0, 5);

  // Overall avg
  const overallAvg = results.length
    ? Math.round(results.reduce((s, r) => s + r.marks, 0) / results.length)
    : 0;

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Academic Overview</h1>
          <p>Welcome, {user?.name} — Head of Academics</p>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-primary bg-opacity-10 text-primary"><FiUsers /></div>
              <div>
                <div className="text-muted small">Total Students</div>
                <div className="fw-bold fs-4">{students.length}</div>
                <div className="text-muted x-small">{classes.length} classes</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-success bg-opacity-10 text-success"><FiCheckCircle /></div>
              <div>
                <div className="text-muted small">Attendance Rate</div>
                <div className="fw-bold fs-4">{attendanceRate}%</div>
                <div className="text-muted x-small">{absentCount} absent today</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-warning bg-opacity-10 text-warning"><FiBarChart2 /></div>
              <div>
                <div className="text-muted small">School Avg Marks</div>
                <div className="fw-bold fs-4">{overallAvg || '—'}</div>
                <div className="text-muted x-small">{results.length} results entered</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className={`summary-icon ${poorAttendance.length > 0 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                <FiAlertTriangle />
              </div>
              <div>
                <div className="text-muted small">Attendance Alerts</div>
                <div className={`fw-bold fs-4 ${poorAttendance.length > 0 ? 'text-danger' : 'text-success'}`}>{poorAttendance.length}</div>
                <div className="text-muted x-small">students with absences</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        {/* Class performance */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiGrid className="text-primary" />
              <h6 className="mb-0 fw-bold">Class Performance</h6>
            </div>
            <div className="card-body">
              {classPerfMap.map((cls) => (
                <div key={cls.name} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span className="small fw-semibold">{cls.name}</span>
                    <span className="small text-muted">
                      {cls.avg !== null ? `${cls.avg} avg` : 'No results'}
                    </span>
                  </div>
                  <div className="progress" style={{ height: 10, borderRadius: 6 }}>
                    <div
                      className={`progress-bar ${
                        cls.avg === null ? 'bg-secondary' :
                        cls.avg >= 80 ? 'bg-success' :
                        cls.avg >= 60 ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: cls.avg !== null ? `${cls.avg}%` : '5%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top performers */}
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
              <FiAward className="text-warning" />
              <h6 className="mb-0 fw-bold">Top Performers</h6>
            </div>
            {topStudents.length === 0
              ? <div className="card-body text-muted">No results yet.</div>
              : (
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr><th>#</th><th>Student</th><th>Subject</th><th>Marks</th><th>GPA</th></tr>
                    </thead>
                    <tbody>
                      {topStudents.map((r, i) => (
                        <tr key={r.id}>
                          <td>
                            <span className={`badge ${i === 0 ? 'bg-warning text-dark' : i === 1 ? 'bg-secondary' : 'bg-light text-dark border'}`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="fw-semibold">{r.studentName}</td>
                          <td className="text-muted small">{r.subject}</td>
                          <td><span className="text-success fw-bold">{r.marks}</span></td>
                          <td>{r.gpa.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Attendance alerts */}
      {poorAttendance.length > 0 && (
        <div className="card border-0 shadow-sm border-start border-danger border-4">
          <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
            <FiAlertTriangle className="text-danger" />
            <h6 className="mb-0 fw-bold text-danger">Attendance Concerns</h6>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Student</th><th>Class</th><th>Absences</th><th>Action</th></tr>
              </thead>
              <tbody>
                {poorAttendance.map((s) => (
                  <tr key={s.name}>
                    <td className="fw-semibold">{s.name}</td>
                    <td>{s.className}</td>
                    <td><span className="badge bg-danger">{s.count} absent</span></td>
                    <td>
                      <span className="d-flex align-items-center gap-1 text-danger small">
                        <FiXCircle /> Notify parent
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* School-wide results */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-white border-bottom py-3 d-flex align-items-center gap-2">
          <FiTrendingUp className="text-primary" />
          <h6 className="mb-0 fw-bold">All Academic Results</h6>
        </div>
        {results.length === 0
          ? <div className="card-body text-muted">No results entered yet.</div>
          : (
            <div className="card-body p-0">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr><th>Student</th><th>Class</th><th>Subject</th><th>Marks</th><th>GPA</th><th>Grade</th></tr>
                </thead>
                <tbody>
                  {[...results].sort((a, b) => b.marks - a.marks).map((r) => (
                    <tr key={r.id}>
                      <td className="fw-semibold">{r.studentName}</td>
                      <td>{r.className}</td>
                      <td className="text-muted">{r.subject}</td>
                      <td>
                        <span className={r.marks >= 80 ? 'text-success fw-bold' : r.marks >= 60 ? 'text-warning fw-bold' : 'text-danger fw-bold'}>
                          {r.marks}
                        </span>
                      </td>
                      <td>{r.gpa.toFixed(1)}</td>
                      <td>
                        <span className={`badge ${r.marks >= 80 ? 'bg-success' : r.marks >= 60 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                          {r.marks >= 80 ? 'A' : r.marks >= 60 ? 'B' : 'C'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>
    </div>
  );
}
