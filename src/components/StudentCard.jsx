function StudentCard({ student, onView, onEdit, onDelete }) {
  const marks = typeof student.marks === 'number' ? student.marks : '—';
  const attendance = typeof student.attendance === 'number' ? `${student.attendance}%` : '—';

  return (
    <li className="student-card">
      <div className="student-info">
        <h3>{student.name}</h3>
        <p>Marks: {marks}</p>
        <p>Attendance: {attendance}</p>
      </div>
      <div className="student-actions">
        <button onClick={onView}>View</button>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}

export default StudentCard;
