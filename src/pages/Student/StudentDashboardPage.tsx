import { FiBarChart2, FiCheckCircle, FiCreditCard, FiUser, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export function StudentDashboardPage() {
  const { user } = useAuth();
  const { students, attendance, results, fees } = useApp();

  const profile = students.find((s) => s.id === user?.id);
  const myAttendance = attendance.filter((a) => a.studentId === user?.id);
  const myResults   = results.filter((r) => r.studentId === user?.id);
  const myFee       = fees.find((f) => f.studentId === user?.id);

  const presentDays = myAttendance.filter((a) => a.status === 'Present').length;
  const absentDays  = myAttendance.filter((a) => a.status === 'Absent').length;
  const avgMarks    = myResults.length
    ? (myResults.reduce((s, r) => s + r.marks, 0) / myResults.length).toFixed(1)
    : '—';
  const balance = myFee ? myFee.amount - myFee.paid : 0;

  return (
    <div>
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <h1 className="mb-1">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="text-muted mb-0">Student Portal — {user?.className}</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-success bg-opacity-10 text-success"><FiCheckCircle /></div>
              <div>
                <div className="text-muted small">Days Present</div>
                <div className="fw-bold fs-4">{presentDays}</div>
                <div className="text-muted x-small">{absentDays} absent</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-primary bg-opacity-10 text-primary"><FiBarChart2 /></div>
              <div>
                <div className="text-muted small">Avg Marks</div>
                <div className="fw-bold fs-4">{avgMarks}</div>
                <div className="text-muted x-small">{myResults.length} subjects</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className={`summary-icon ${balance > 0 ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'}`}>
                <FiCreditCard />
              </div>
              <div>
                <div className="text-muted small">Fee Balance</div>
                <div className={`fw-bold fs-5 ${balance > 0 ? 'text-danger' : 'text-success'}`}>${balance.toLocaleString()}</div>
                <div className="text-muted x-small">{balance <= 0 ? 'All cleared' : `Due ${myFee?.dueDate}`}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center gap-3">
              <div className="summary-icon bg-info bg-opacity-10 text-info"><FiUser /></div>
              <div>
                <div className="text-muted small">Class</div>
                <div className="fw-bold">{user?.className}</div>
                <div className="text-muted x-small">ID: {user?.id}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Profile card */}
        {profile && (
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-bottom py-3">
                <h6 className="mb-0 fw-bold">My Profile</h6>
              </div>
              <div className="card-body text-center pt-4">
                <img src={profile.profilePhoto} alt={profile.firstName} className="avatar-lg mb-3" />
                <h5 className="fw-bold mb-1">{profile.firstName} {profile.lastName}</h5>
                <p className="text-muted small mb-3">{profile.className}</p>
                <table className="table table-sm text-start">
                  <tbody>
                    <tr><td className="text-muted">Email</td><td className="small">{profile.email}</td></tr>
                    <tr><td className="text-muted">DOB</td><td>{profile.dateOfBirth}</td></tr>
                    <tr><td className="text-muted">Gender</td><td>{profile.gender}</td></tr>
                    <tr><td className="text-muted">Parent</td><td>{profile.parentName}</td></tr>
                    <tr><td className="text-muted">Parent Phone</td><td>{profile.parentPhone}</td></tr>
                    <tr><td className="text-muted">Address</td><td>{profile.address}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 col-lg-8">
          {/* Results */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 fw-bold">My Results</h6>
            </div>
            {myResults.length === 0
              ? <div className="card-body text-muted">No results recorded yet.</div>
              : (
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr><th>Subject</th><th>Class</th><th>Marks</th><th>GPA</th><th>Grade</th></tr>
                    </thead>
                    <tbody>
                      {myResults.map((r) => (
                        <tr key={r.id}>
                          <td className="fw-semibold">{r.subject}</td>
                          <td>{r.className}</td>
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

          {/* Attendance */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-bottom py-3">
              <h6 className="mb-0 fw-bold">My Attendance</h6>
            </div>
            {myAttendance.length === 0
              ? <div className="card-body text-muted">No attendance records yet.</div>
              : (
                <div className="card-body p-0">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr><th>Date</th><th>Class</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {myAttendance.map((a) => (
                        <tr key={a.id}>
                          <td>{a.date}</td>
                          <td>{a.className}</td>
                          <td>
                            {a.status === 'Present'
                              ? <span className="text-success d-flex align-items-center gap-1"><FiCheckCircle /> Present</span>
                              : <span className="text-danger d-flex align-items-center gap-1"><FiXCircle /> Absent</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          {/* Fee status */}
          {myFee && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom py-3">
                <h6 className="mb-0 fw-bold">My Fees</h6>
              </div>
              <div className="card-body">
                <div className="row g-3 mb-3">
                  <div className="col-4 text-center">
                    <div className="text-muted small">Total</div>
                    <div className="fw-bold">${myFee.amount.toLocaleString()}</div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-muted small">Paid</div>
                    <div className="fw-bold text-success">${myFee.paid.toLocaleString()}</div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-muted small">Balance</div>
                    <div className={`fw-bold ${balance > 0 ? 'text-danger' : 'text-success'}`}>${balance.toLocaleString()}</div>
                  </div>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className="progress-bar bg-success"
                    style={{ width: `${Math.round((myFee.paid / myFee.amount) * 100)}%` }}
                  />
                </div>
                <div className="text-muted small mt-2">
                  {Math.round((myFee.paid / myFee.amount) * 100)}% paid — Due date: {myFee.dueDate}
                </div>
                {balance > 0 && (
                  <div className="alert alert-warning mt-3 mb-0 py-2 small">
                    Please ask your parent / guardian to clear the outstanding balance of <strong>${balance.toLocaleString()}</strong> before {myFee.dueDate}.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
