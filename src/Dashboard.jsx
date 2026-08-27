function Dashboard({ students, onViewStudents }) {
  const total = students.length;

  const withMarks = students.filter((s) => typeof s.marks === 'number');
  const withAttendance = students.filter((s) => typeof s.attendance === 'number');

  const avgMarks = withMarks.length
    ? Math.round(withMarks.reduce((sum, s) => sum + s.marks, 0) / withMarks.length)
    : 0;

  const avgAttendance = withAttendance.length
    ? Math.round(
        withAttendance.reduce((sum, s) => sum + s.attendance, 0) / withAttendance.length
      )
    : 0;

  return (
    <section className="dashboard">
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-label">Total Students</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Marks</span>
          <span className="stat-value">{avgMarks}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Attendance</span>
          <span className="stat-value">{avgAttendance}%</span>
        </div>
      </div>
      <button className="primary-btn" onClick={onViewStudents}>
        View Students
      </button>
    </section>
  );
}

export default Dashboard;
