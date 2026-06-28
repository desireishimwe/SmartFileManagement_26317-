import { FiCalendar, FiPlus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = ['08:30', '09:30', '10:45', '12:30', '01:30'];

export function TimetablePage() {
  const { classes, teachers, addToast } = useApp();
  return (
    <div>
      <div className="page-heading">
        <div><h1>Timetable Management</h1><p>Create weekly schedules, assign subjects, and assign teachers.</p></div>
        <button className="btn btn-primary" onClick={() => addToast({ title: 'Timetable created', message: 'Weekly timetable draft is ready.', variant: 'success' })}><FiPlus className="me-2" /> Create Timetable</button>
      </div>
      <div className="card border-0 shadow-sm mb-4"><div className="card-body row g-3"><div className="col-md-4"><label className="form-label">Class</label><select className="form-select">{classes.map((item) => <option key={item.id}>{item.name}</option>)}</select></div><div className="col-md-4"><label className="form-label">Subject</label><select className="form-select">{classes.flatMap((item) => item.subjects).map((subject) => <option key={subject}>{subject}</option>)}</select></div><div className="col-md-4"><label className="form-label">Teacher</label><select className="form-select">{teachers.map((teacher) => <option key={teacher.id}>{teacher.fullName}</option>)}</select></div></div></div>
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white fw-semibold"><FiCalendar className="me-2" /> Weekly Schedule View</div>
        <div className="table-responsive">
          <table className="table table-bordered timetable mb-0">
            <thead><tr><th>Time</th>{days.map((day) => <th key={day}>{day}</th>)}</tr></thead>
            <tbody>
              {periods.map((period, index) => (
                <tr key={period}>
                  <th>{period}</th>
                  {days.map((day, dayIndex) => <td key={`${day}-${period}`}><strong>{classes[(index + dayIndex) % classes.length].subjects[index % 3]}</strong><span>{teachers[(index + dayIndex) % teachers.length].fullName}</span></td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
