import { FormEvent, useMemo, useState } from 'react';
import { FiEdit2, FiEye, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import { DataTable } from '../../components/Tables/DataTable';
import { useApp } from '../../context/AppContext';
import { ALevelCombination, AcademicLevel, Student } from '../../types';

const A_LEVEL_COMBINATIONS: Record<ALevelCombination, string[]> = {
  MCB: ['Mathematics', 'Chemistry', 'Biology'],
  PCB: ['Physics', 'Chemistry', 'Biology'],
  PCM: ['Physics', 'Chemistry', 'Mathematics'],
  MCI: ['Mathematics', 'Computer Science', 'ICT'],
  HEG: ['History', 'Economics', 'Geography'],
  HGL: ['History', 'Geography', 'Literature in English'],
  MEG: ['Mathematics', 'Economics', 'Geography'],
  CEG: ['Computer Science', 'Economics', 'Geography'],
};

const O_LEVEL_SUBJECTS = [
  'Mathematics', 'English Language', 'French', 'Biology',
  'Chemistry', 'Physics', 'History', 'Geography',
  'Computer Science', 'Religious Education', 'Kinyarwanda', 'Entrepreneurship',
];

const emptyStudent: Student = {
  id: '',
  firstName: '',
  lastName: '',
  gender: 'Female',
  dateOfBirth: '',
  enrollmentDate: new Date().toISOString().slice(0, 10),
  level: 'O Level',
  combination: undefined,
  className: 'Grade 10A',
  parentName: '',
  parentPhone: '',
  address: '',
  email: '',
  profilePhoto: '',
};

export function StudentsPage() {
  const { students, classes, addStudent, updateStudent, deleteStudent, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [selected, setSelected] = useState<Student | null>(null);
  const [editing, setEditing] = useState<Student | null>(null);
  const [formLevel, setFormLevel] = useState<AcademicLevel>('O Level');

  const openEdit = (student: Student) => {
    setEditing(student);
    setFormLevel(student.level);
  };

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const haystack = `${student.id} ${student.firstName} ${student.lastName} ${student.email}`.toLowerCase();
        return (
          haystack.includes(search.toLowerCase()) &&
          (!classFilter || student.className === classFilter) &&
          (!levelFilter || student.level === levelFilter)
        );
      }),
    [classFilter, levelFilter, search, students],
  );

  const saveStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const level = String(data.get('level')) as AcademicLevel;
    const student: Student = {
      id: String(data.get('id')),
      firstName: String(data.get('firstName')),
      lastName: String(data.get('lastName')),
      gender: String(data.get('gender')) as Student['gender'],
      dateOfBirth: String(data.get('dateOfBirth')),
      enrollmentDate: String(data.get('enrollmentDate')),
      level,
      combination: level === 'A Level' ? (String(data.get('combination')) as ALevelCombination) : undefined,
      className: String(data.get('className')),
      parentName: String(data.get('parentName')),
      parentPhone: String(data.get('parentPhone')),
      address: String(data.get('address')),
      email: String(data.get('email')),
      profilePhoto: String(data.get('profilePhoto')) || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=120&q=80',
    };
    if (students.some((item) => item.id === student.id)) {
      updateStudent(student);
      addToast({ title: 'Student updated', message: `${student.firstName} ${student.lastName} was updated.`, variant: 'success' });
    } else {
      addStudent(student);
      addToast({ title: 'Student added', message: `${student.firstName} ${student.lastName} was added.`, variant: 'success' });
    }
    setEditing(null);
  };

  return (
    <div>
      <div className="page-heading">
        <div>
          <h1>Student Management</h1>
          <p>Add, edit, delete, search, filter, and view student details.</p>
        </div>
        <button className="btn btn-primary" onClick={() => openEdit({ ...emptyStudent, id: `STU-${Date.now().toString().slice(-4)}` })}>
          <FiPlus className="me-2" /> Add Student
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar card border-0 shadow-sm mb-3">
        <div className="card-body row g-3">
          <div className="col-lg-6">
            <div className="input-group">
              <span className="input-group-text"><FiSearch /></span>
              <input className="form-control" placeholder="Search by name, ID, or email" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-lg-3">
            <select className="form-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
              <option value="">All classes</option>
              {classes.map((sc) => <option key={sc.id}>{sc.name}</option>)}
            </select>
          </div>
          <div className="col-lg-3">
            <select className="form-select" value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)}>
              <option value="">All levels</option>
              <option>O Level</option>
              <option>A Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <DataTable
        rows={filteredStudents}
        columns={[
          {
            key: 'student',
            title: 'Student',
            render: (s) => (
              <div className="d-flex align-items-center gap-2">
                <img className="avatar-sm" src={s.profilePhoto} alt={`${s.firstName} ${s.lastName}`} />
                <div>
                  <div className="fw-semibold">{s.firstName} {s.lastName}</div>
                  <div className="text-muted small">{s.id}</div>
                </div>
              </div>
            ),
          },
          { key: 'gender', title: 'Gender', render: (s) => s.gender },
          { key: 'class', title: 'Class', render: (s) => s.className },
          {
            key: 'level',
            title: 'Level / Combination',
            render: (s) => (
              <div>
                <span className={`badge me-1 ${s.level === 'A Level' ? 'bg-primary' : 'bg-success'}`}>{s.level}</span>
                {s.combination && <span className="badge bg-secondary">{s.combination}</span>}
              </div>
            ),
          },
          { key: 'enrolled', title: 'Enrolled', render: (s) => s.enrollmentDate },
          { key: 'parent', title: 'Parent', render: (s) => <><div>{s.parentName}</div><div className="text-muted small">{s.parentPhone}</div></> },
          { key: 'email', title: 'Email', render: (s) => s.email },
          {
            key: 'actions',
            title: 'Actions',
            render: (s) => (
              <div className="btn-group btn-group-sm">
                <button className="btn btn-outline-primary" onClick={() => setSelected(s)} aria-label="View student"><FiEye /></button>
                <button className="btn btn-outline-secondary" onClick={() => openEdit(s)} aria-label="Edit student"><FiEdit2 /></button>
                <button className="btn btn-outline-danger" onClick={() => { deleteStudent(s.id); addToast({ title: 'Student deleted', message: `${s.firstName} ${s.lastName} was removed.`, variant: 'danger' }); }} aria-label="Delete student"><FiTrash2 /></button>
              </div>
            ),
          },
        ]}
      />

      {/* Edit / Add modal */}
      {editing && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <h2 className="h5 mb-3">{students.some((s) => s.id === editing.id) ? 'Edit Student' : 'Add Student'}</h2>
            <form onSubmit={saveStudent}>
              <div className="row g-3">
                {([
                  ['id', 'Student ID', 'text'],
                  ['firstName', 'First Name', 'text'],
                  ['lastName', 'Last Name', 'text'],
                  ['dateOfBirth', 'Date of Birth', 'date'],
                  ['enrollmentDate', 'Enrollment Date', 'date'],
                  ['parentName', 'Parent Name', 'text'],
                  ['parentPhone', 'Parent Phone', 'tel'],
                  ['email', 'Email', 'email'],
                  ['profilePhoto', 'Profile Photo URL', 'url'],
                ] as [string, string, string][]).map(([name, label, type]) => (
                  <div className="col-md-6" key={name}>
                    <label className="form-label">{label}</label>
                    <input
                      className="form-control"
                      name={name}
                      type={type}
                      defaultValue={String(editing[name as keyof Student] ?? '')}
                      required={name !== 'profilePhoto'}
                    />
                  </div>
                ))}

                {/* Gender */}
                <div className="col-md-6">
                  <label className="form-label">Gender</label>
                  <select className="form-select" name="gender" defaultValue={editing.gender}>
                    <option>Female</option>
                    <option>Male</option>
                  </select>
                </div>

                {/* Class */}
                <div className="col-md-6">
                  <label className="form-label">Class</label>
                  <select className="form-select" name="className" defaultValue={editing.className}>
                    {classes.map((sc) => <option key={sc.id}>{sc.name}</option>)}
                  </select>
                </div>

                {/* Academic level */}
                <div className="col-md-6">
                  <label className="form-label">Academic Level</label>
                  <select
                    className="form-select"
                    name="level"
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as AcademicLevel)}
                  >
                    <option>O Level</option>
                    <option>A Level</option>
                  </select>
                </div>

                {/* Combination — only for A Level */}
                {formLevel === 'A Level' && (
                  <div className="col-md-6">
                    <label className="form-label">Combination</label>
                    <select className="form-select" name="combination" defaultValue={editing.combination ?? 'MCB'}>
                      {(Object.keys(A_LEVEL_COMBINATIONS) as ALevelCombination[]).map((code) => (
                        <option key={code} value={code}>
                          {code} – {A_LEVEL_COMBINATIONS[code].join(', ')}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Address */}
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" name="address" defaultValue={editing.address} required />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button className="btn btn-light" type="button" onClick={() => setEditing(null)}>Cancel</button>
                <button className="btn btn-primary" type="submit">Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail view modal */}
      {selected && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <div className="d-flex align-items-center gap-3 mb-3">
              <img className="avatar-lg" src={selected.profilePhoto} alt={`${selected.firstName} ${selected.lastName}`} />
              <div>
                <h2 className="h5 mb-1">{selected.firstName} {selected.lastName}</h2>
                <p className="text-muted mb-0">{selected.id} • {selected.className}</p>
              </div>
            </div>

            <p><strong>Email:</strong> {selected.email}</p>
            <p><strong>Enrolled:</strong> {selected.enrollmentDate}</p>
            <p>
              <strong>Academic Level:</strong>{' '}
              <span className={`badge ${selected.level === 'A Level' ? 'bg-primary' : 'bg-success'}`}>{selected.level}</span>
              {selected.combination && (
                <span className="ms-2">
                  <strong>{selected.combination}</strong> — {A_LEVEL_COMBINATIONS[selected.combination].join(', ')}
                </span>
              )}
            </p>

            {/* Subject list */}
            <div className="mb-3">
              <strong>Subjects:</strong>
              <div className="d-flex flex-wrap gap-1 mt-1">
                {(selected.level === 'A Level' && selected.combination
                  ? A_LEVEL_COMBINATIONS[selected.combination]
                  : O_LEVEL_SUBJECTS
                ).map((subj) => (
                  <span key={subj} className="badge bg-light text-dark border">{subj}</span>
                ))}
              </div>
            </div>

            <p><strong>Parent:</strong> {selected.parentName} ({selected.parentPhone})</p>
            <p><strong>Address:</strong> {selected.address}</p>
            <button className="btn btn-primary" onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
