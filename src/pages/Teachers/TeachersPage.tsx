import { FormEvent, useMemo, useState } from 'react';
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';
import { Teacher } from '../../types';

const blankTeacher: Teacher = { id: '', fullName: '', subject: '', qualification: '', phone: '', email: '', address: '' };

export function TeachersPage() {
  const { teachers, addTeacher, updateTeacher, deleteTeacher, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Teacher | null>(null);
  const filtered = useMemo(() => teachers.filter((teacher) => `${teacher.id} ${teacher.fullName} ${teacher.subject}`.toLowerCase().includes(search.toLowerCase())), [search, teachers]);

  const saveTeacher = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const teacher: Teacher = {
      id: String(data.get('id')),
      fullName: String(data.get('fullName')),
      subject: String(data.get('subject')),
      qualification: String(data.get('qualification')),
      phone: String(data.get('phone')),
      email: String(data.get('email')),
      address: String(data.get('address')),
    };
    teachers.some((item) => item.id === teacher.id) ? updateTeacher(teacher) : addTeacher(teacher);
    addToast({ title: 'Teacher saved', message: `${teacher.fullName} is ready for scheduling.`, variant: 'success' });
    setEditing(null);
  };

  return (
    <div>
      <div className="page-heading">
        <div><h1>Teacher Management</h1><p>Maintain teacher profiles, subjects, qualifications, and contact details.</p></div>
        <button className="btn btn-primary" onClick={() => setEditing({ ...blankTeacher, id: `TCH-${Date.now().toString().slice(-3)}` })}><FiPlus className="me-2" /> Add Teacher</button>
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text"><FiSearch /></span>
        <input className="form-control" placeholder="Search teachers" value={search} onChange={(event) => setSearch(event.target.value)} />
      </div>
      <DataTable
        rows={filtered}
        columns={[
          { key: 'id', title: 'Teacher ID', render: (teacher) => teacher.id },
          { key: 'name', title: 'Full Name', render: (teacher) => <span className="fw-semibold">{teacher.fullName}</span> },
          { key: 'subject', title: 'Subject', render: (teacher) => teacher.subject },
          { key: 'qualification', title: 'Qualification', render: (teacher) => teacher.qualification },
          { key: 'phone', title: 'Phone', render: (teacher) => teacher.phone },
          { key: 'email', title: 'Email', render: (teacher) => teacher.email },
          { key: 'address', title: 'Address', render: (teacher) => teacher.address },
          { key: 'actions', title: 'Actions', render: (teacher) => <div className="btn-group btn-group-sm"><button className="btn btn-outline-secondary" onClick={() => setEditing(teacher)}><FiEdit2 /></button><button className="btn btn-outline-danger" onClick={() => deleteTeacher(teacher.id)}><FiTrash2 /></button></div> },
        ]}
      />
      {editing && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <h2 className="h5 mb-3">Teacher Profile</h2>
            <form onSubmit={saveTeacher}>
              <div className="row g-3">
                {(Object.keys(blankTeacher) as (keyof Teacher)[]).map((key) => (
                  <div className={key === 'address' ? 'col-12' : 'col-md-6'} key={key}>
                    <label className="form-label text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input className="form-control" name={key} defaultValue={editing[key]} required />
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4"><button className="btn btn-light" type="button" onClick={() => setEditing(null)}>Cancel</button><button className="btn btn-primary">Save Teacher</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
