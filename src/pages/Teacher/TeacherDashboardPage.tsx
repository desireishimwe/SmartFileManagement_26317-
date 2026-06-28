import { FiBook, FiCheckSquare, FiClipboard, FiUsers } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function TeacherDashboardPage() {
  const { user } = useAuth();
  const { students, attendance, results, classes } = useApp();

  const myClass = classes.find((c) => c.classTeacher === user?.name);
  const myStudents = students.filter((s) => s.className === myClass?.name);
  const myAttendance = attendance.filter((a) => a.className === myClass?.name);
  const myResults = results.filter((r) => r.subject === user?.subject);

  const presentToday = myAttendance.filter((a) => a.status === 'Present').length;
  const avgMarks = myResults.length
    ? Math.round(myResults.reduce((sum, r) => sum + r.marks, 0) / myResults.length)
    : 0;

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p>{user?.subject} Teacher{myClass ? ` — ${myClass.name}` : ''}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-primary bg-opacity-10 text-primary"><FiUsers /></div>
              <div>
                <div className="text-muted small">My Students</div>
                <div className="fw-bold fs-4">{myStudents.length || myClass?.students || 0}</div>
                <div className="text-muted x-small">{myClass?.name ?? 'No class assigned'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-success bg-opacity-10 text-success"><FiCheckSquare /></div>
              <div>
                <div className="text-muted small">Present Today</div>
                <div className="fw-bold fs-4">{presentToday}</div>
                <div className="text-muted x-small">of {myAttendance.length} recorded</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-warning bg-opacity-10 text-warning"><FiBook /></div>
              <div>
                <div className="text-muted small">Subject</div>
                <div className="fw-bold fs-5">{user?.subject}</div>
                <div className="text-muted x-small">Avg marks: {avgMarks || '—'}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-info bg-opacity-10 text-info"><FiClipboard /></div>
              <div>
                <div className="text-muted small">Results Entered</div>
                <div className="fw-bold fs-4">{myResults.length}</div>
                <div className="text-muted x-small">for {user?.subject}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* My students */}
      {myStudents.length > 0 && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-bottom py-3">
            <h6 className="mb-0 fw-bold">My Students — {myClass?.name}</h6>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Email</th>
                  <th>Parent</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <img src={s.profilePhoto} alt="" className="avatar-sm" />
                        <span className="fw-semibold">{s.firstName} {s.lastName}</span>
                      </div>
                    </td>
                    <td>{s.gender}</td>
                    <td className="text-muted small">{s.email}</td>
                    <td>{s.parentName}</td>
                    <td className="text-muted small">{s.parentPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* My results */}
      {myResults.length > 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-bottom py-3">
            <h6 className="mb-0 fw-bold">{user?.subject} Results</h6>
          </div>
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr><th>Student</th><th>Class</th><th>Marks</th><th>GPA</th></tr>
              </thead>
              <tbody>
                {myResults.map((r) => (
                  <tr key={r.id}>
                    <td className="fw-semibold">{r.studentName}</td>
                    <td>{r.className}</td>
                    <td><span className={r.marks >= 80 ? 'text-success fw-semibold' : r.marks >= 60 ? 'text-warning fw-semibold' : 'text-danger fw-semibold'}>{r.marks}</span></td>
                    <td>{r.gpa.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
