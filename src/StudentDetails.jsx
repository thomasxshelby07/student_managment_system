import { useState } from 'react';
import StudentModal from './components/StudentModal';

// Builds a readable chain of study partners, e.g. "Sneha Reddy -> Karan Mehta".
// Most students don't have a partner at all, so this only ever recurses one
// or two levels deep in practice.
function getPartnerChain(studentId, students) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return [];
  if (!student.studyPartnerId) return [student.name];
  return [student.name, ...getPartnerChain(student.studyPartnerId, students)];
}

function StudentDetails({ studentId, students, setStudents, onBack }) {
  const student = students.find((s) => s.id === studentId);

  const [attendanceToday, setAttendanceToday] = useState(student?.attendance ?? 0);
  const [showEdit, setShowEdit] = useState(false);

  if (!student) {
    return (
      <section className="student-details">
        <p>Student not found.</p>
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
      </section>
    );
  }

  const partnerChain = student.studyPartnerId ? getPartnerChain(student.id, students) : null;
  const partnerNames = partnerChain ? partnerChain.slice(1).join(', ') : null;

  function handleDelete() {
    setStudents((prev) => prev.filter((s) => s.id !== student.id));
    onBack();
  }

  function handleUpdated(updated) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
  }

  function handleMarkPresent() {
    setAttendanceToday((prev) => Math.min(100, prev + 1));
  }

  return (
    <section className="student-details">
      <h2>Student Details</h2>
      <div className="details-card">
        <h3>{student.name}</h3>
        <p>Email: {student.email}</p>
        <p>Marks: {student.marks ?? '—'}</p>
        <p>Attendance: {attendanceToday}%</p>
        <p>Course/Class: {student.profile.class}</p>
        {partnerNames && <p>Study Partner: {partnerNames}</p>}
      </div>

      <div className="details-actions">
        <button className="primary-btn" onClick={handleMarkPresent}>
          Mark Present
        </button>
        <button onClick={() => setShowEdit(true)}>Edit</button>
        <button onClick={handleDelete}>Delete</button>
        <button className="secondary-btn" onClick={onBack}>
          Back
        </button>
      </div>

      {showEdit && (
        <StudentModal
          mode="edit"
          student={student}
          onClose={() => setShowEdit(false)}
          onUpdated={handleUpdated}
        />
      )}
    </section>
  );
}

export default StudentDetails;
