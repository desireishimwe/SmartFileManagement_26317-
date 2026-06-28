import { FiEdit2, FiEye, FiPlus } from 'react-icons/fi';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';

export function ClassesPage() {
  const { classes, students, addToast } = useApp();
  return (
    <div>
      <div className="page-heading">
        <div><h1>Class Management</h1><p>Create classes, assign class teachers, edit room data, and view students.</p></div>
        <button className="btn btn-primary" onClick={() => addToast({ title: 'Class created', message: 'Sample class creation flow is ready for API wiring.', variant: 'info' })}><FiPlus className="me-2" /> Create Class</button>
      </div>
      <DataTable
        rows={classes}
        columns={[
          { key: 'name', title: 'Class', render: (item) => <span className="fw-semibold">{item.name}</span> },
          { key: 'teacher', title: 'Class Teacher', render: (item) => item.classTeacher },
          { key: 'room', title: 'Room', render: (item) => item.room },
          { key: 'students', title: 'Students', render: (item) => item.students },
          { key: 'subjects', title: 'Subjects', render: (item) => item.subjects.join(', ') },
          { key: 'actions', title: 'Actions', render: (item) => <div className="btn-group btn-group-sm"><button className="btn btn-outline-primary" onClick={() => addToast({ title: item.name, message: `${students.filter((student) => student.className === item.name).length} sample students found.`, variant: 'info' })}><FiEye /></button><button className="btn btn-outline-secondary"><FiEdit2 /></button></div> },
        ]}
      />
    </div>
  );
}
