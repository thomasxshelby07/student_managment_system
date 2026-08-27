import { useState } from 'react';
import { createStudent, updateStudent } from '../api';

const emptyForm = { name: '', email: '', marks: '', attendance: '', course: '' };

function StudentModal({ mode, student, onClose, onAdded, onUpdated }) {
  const [form, setForm] = useState(() =>
    mode === 'edit' && student
      ? {
          name: student.name ?? '',
          email: student.email ?? '',
          marks: student.marks ?? '',
          attendance: student.attendance ?? '',
          course: student.profile?.class ?? '',
        }
      : emptyForm
  );
  const [saving, setSaving] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    if (saving) return;
    setSaving(true);
    const payload = {
      name: form.name,
      email: form.email,
      marks: Number(form.marks) || 0,
      attendance: Number(form.attendance) || 0,
      profile: { class: form.course },
    };

    if (mode === 'add') {
      createStudent(payload).then((saved) => {
        onAdded(saved);
        setSaving(false);
        onClose();
      });
    } else {
      updateStudent(student.id, payload).then((updated) => {
        setSaving(false);
        onUpdated(updated);
        onClose();
      });
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{mode === 'add' ? 'Add Student' : 'Edit Student'}</h3>

        <label>
          Name
          <input value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
        </label>
        <label>
          Email
          <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
        </label>
        <label>
          Marks
          <input
            type="number"
            value={form.marks}
            onChange={(e) => handleChange('marks', e.target.value)}
          />
        </label>
        <label>
          Attendance
          <input
            type="number"
            value={form.attendance}
            onChange={(e) => handleChange('attendance', e.target.value)}
          />
        </label>
        <label>
          Course/Class
          <input value={form.course} onChange={(e) => handleChange('course', e.target.value)} />
        </label>

        <div className="modal-actions">
          <button className="primary-btn" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button className="secondary-btn" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentModal;
