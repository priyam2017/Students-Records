import { useEffect, useMemo, useState } from "react";
import { BookOpen, Edit2, Plus, Search, Trash2, Users, X } from "react-feather";

const STORAGE_KEY = "student-ledger-records";
const emptyForm = { name: "", email: "", course: "", phone: "", year: "" };

function readStudents() {
  try {
    const savedStudents = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(savedStudents) ? savedStudents : [];
  } catch {
    return [];
  }
}

const AddStudents = () => {
  const [students, setStudents] = useState(readStudents);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const visibleStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter((student) =>
      [student.name, student.email, student.course, student.phone, student.year]
        .some((value) => value.toLowerCase().includes(query)),
    );
  }, [search, students]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const saveStudent = (event) => {
    event.preventDefault();
    const record = { ...form, name: form.name.trim(), email: form.email.trim() };

    if (editingId) {
      setStudents((currentStudents) => currentStudents.map((student) =>
        student.id === editingId ? { ...student, ...record } : student,
      ));
    } else {
      setStudents((currentStudents) => [
        { ...record, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` },
        ...currentStudents,
      ]);
    }

    resetForm();
  };

  const editStudent = (student) => {
    setForm({
      name: student.name,
      email: student.email,
      course: student.course,
      phone: student.phone,
      year: student.year,
    });
    setEditingId(student.id);
  };

  const deleteStudent = (student) => {
    if (!window.confirm(`Delete ${student.name}'s record? This cannot be undone.`)) return;
    setStudents((currentStudents) => currentStudents.filter((item) => item.id !== student.id));
    if (editingId === student.id) resetForm();
  };

  return (
    <main className="records-page">
      <section className="records-intro" aria-labelledby="page-title">
        <div>
          <p className="eyebrow">STUDENT DIRECTORY</p>
          <h1 id="page-title">Your students, <em>in order.</em></h1>
          <p className="intro-copy">Keep every student record close at hand.</p>
        </div>
        <div className="intro-mark" aria-hidden="true"><BookOpen size={27} /></div>
      </section>

      <section className="records-overview" aria-label="Directory summary">
        <div className="overview-icon"><Users size={20} /></div>
        <div>
          <strong>{students.length}</strong>
          <span>{students.length === 1 ? "student record" : "student records"}</span>
        </div>
        <span className="overview-note">All records are saved on this device</span>
      </section>

      <div className="records-layout">
        <section className="student-form-panel" aria-labelledby="form-title">
          <div className="panel-heading">
            <div className="panel-number">{editingId ? "02" : "01"}</div>
            <div>
              <h2 id="form-title">{editingId ? "Edit student" : "Add a student"}</h2>
              <p>{editingId ? "Update this student's details." : "Start a new student record."}</p>
            </div>
          </div>

          <form className="student-form" onSubmit={saveStudent}>
            <label>
              Full name <span>*</span>
              <input name="name" value={form.name} onChange={updateField} placeholder="e.g. Maya Patel" required />
            </label>
            <label>
              Email address <span>*</span>
              <input name="email" type="email" value={form.email} onChange={updateField} placeholder="maya@example.com" required />
            </label>
            <label>
              Course
              <input name="course" value={form.course} onChange={updateField} placeholder="e.g. Biology" />
            </label>
            <div className="form-row">
              <label>
                Phone
                <input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="Phone number" />
              </label>
              <label>
                Year
                <select name="year" value={form.year} onChange={updateField}>
                  <option value="">Select</option>
                  <option value="1st year">1st year</option>
                  <option value="2nd year">2nd year</option>
                  <option value="3rd year">3rd year</option>
                  <option value="4th year">4th year</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </label>
            </div>
            <div className="form-actions">
              {editingId && (
                <button className="button button-quiet" type="button" onClick={resetForm}>
                  <X size={16} /> Cancel
                </button>
              )}
              <button className="button button-primary" type="submit">
                <Plus size={16} /> {editingId ? "Save changes" : "Add student"}
              </button>
            </div>
          </form>
        </section>

        <section className="directory-panel" aria-labelledby="directory-title">
          <div className="directory-heading">
            <div>
              <p className="eyebrow">ALL RECORDS</p>
              <h2 id="directory-title">Student directory</h2>
            </div>
            <label className="search-box">
              <Search size={17} aria-hidden="true" />
              <span className="visually-hidden">Search students</span>
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students" />
            </label>
          </div>

          {visibleStudents.length > 0 ? (
            <div className="table-wrap">
              <table className="student-table">
                <thead>
                  <tr>
                    <th scope="col">Student</th>
                    <th scope="col">Course</th>
                    <th scope="col">Year</th>
                    <th scope="col">Phone</th>
                    <th scope="col"><span className="visually-hidden">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStudents.map((student) => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name">{student.name}</div>
                        <div className="student-email">{student.email}</div>
                      </td>
                      <td>{student.course || <span className="muted-value">Not set</span>}</td>
                      <td>{student.year || <span className="muted-value">—</span>}</td>
                      <td>{student.phone || <span className="muted-value">—</span>}</td>
                      <td>
                        <div className="row-actions">
                          <button className="icon-button" type="button" onClick={() => editStudent(student)} aria-label={`Edit ${student.name}`} title="Edit student">
                            <Edit2 size={16} />
                          </button>
                          <button className="icon-button delete-button" type="button" onClick={() => deleteStudent(student)} aria-label={`Delete ${student.name}`} title="Delete student">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon"><Users size={22} /></div>
              <h3>{search ? "No matching students" : "No student records yet"}</h3>
              <p>{search ? "Try another name, email, or course." : "Add your first student using the form."}</p>
            </div>
          )}
          <div className="directory-footnote">
            Showing {visibleStudents.length} of {students.length} {students.length === 1 ? "record" : "records"}
          </div>
        </section>
      </div>
    </main>
  );
};

export default AddStudents;
