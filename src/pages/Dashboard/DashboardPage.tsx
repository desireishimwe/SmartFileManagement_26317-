import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip } from 'chart.js';
import { FiBookOpen, FiClipboard, FiGrid, FiUsers } from 'react-icons/fi';
import { SummaryCard } from '../../components/Cards/SummaryCard';
import { useApp } from '../../context/AppContext';
import { activities } from '../../services/mockData';

ChartJS.register(ArcElement, CategoryScale, Legend, LinearScale, LineElement, PointElement, Tooltip);


export function DashboardPage() {
  const { students, teachers, classes, attendance } = useApp();
  const attendanceRate = Math.round((attendance.filter((item) => item.status === 'Present').length / attendance.length) * 100);
  const subjects = new Set(classes.flatMap((schoolClass) => schoolClass.subjects));

  const classChart = {
    labels: classes.map((item) => item.name),
    datasets: [{ label: 'Students', data: classes.map((item) => item.students), backgroundColor: '#0d6efd' }],
  };

  const genderChart = {
    labels: ['Female', 'Male'],
    datasets: [
      {
        data: [students.filter((student) => student.gender === 'Female').length, students.filter((student) => student.gender === 'Male').length],
        backgroundColor: ['#20c997', '#0d6efd'],
      },
    ],
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Live overview of academics, attendance, staffing, and operations.</p>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-primary">Add Student</button>
          <button className="btn btn-outline-primary">Generate Report</button>
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-xl"><SummaryCard title="Total Students" value={String(students.length)} note="+8 this month" icon={FiUsers} variant="primary" /></div>
        <div className="col-sm-6 col-xl"><SummaryCard title="Total Teachers" value={String(teachers.length)} note="4 departments" icon={FiBookOpen} variant="success" /></div>
        <div className="col-sm-6 col-xl"><SummaryCard title="Total Classes" value={String(classes.length)} note="Active sections" icon={FiGrid} variant="info" /></div>
        <div className="col-sm-6 col-xl"><SummaryCard title="Total Subjects" value={String(subjects.size)} note="Across grades" icon={FiClipboard} variant="warning" /></div>
        <div className="col-sm-6 col-xl"><SummaryCard title="Attendance Rate" value={`${attendanceRate}%`} note="Today" icon={FiClipboard} variant="danger" /></div>
      </div>
      {/* Row 2: Charts — full width, 8 + 4 */}
      <div className="row g-3 mb-3">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold border-bottom">Student Statistics by Class</div>
            <div className="card-body" style={{ height: 220 }}>
              <Line data={classChart} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold border-bottom">Gender Distribution</div>
            <div className="card-body d-flex align-items-center justify-content-center" style={{ height: 220 }}>
              <Doughnut data={genderChart} options={{ maintainAspectRatio: true }} />
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Activity + Quick Actions — full width, 8 + 4 */}
      <div className="row g-3">
        <div className="col-xl-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold border-bottom">Recent Activities</div>
            <div className="list-group list-group-flush">
              {activities.map((activity) => (
                <div className="list-group-item py-2 px-3 small" key={activity}>{activity}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="col-xl-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white fw-semibold border-bottom">Quick Actions</div>
            <div className="card-body quick-actions">
              {['Mark Attendance', 'Record Payment', 'Add Marks', 'Create Timetable'].map((action) => (
                <button className="btn btn-outline-primary" key={action}>{action}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
