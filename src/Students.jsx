import { useState, useEffect } from 'react';
import StudentCard from './components/StudentCard';
import StudentModal from './components/StudentModal';
import { searchStudents, fetchStudentsPage } from './api';

const PAGE_SIZE = 4;

function Students({ students, setStudents, onView }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [sortKey, setSortKey] = useState('marks');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalMode, setModalMode] = useState(null); // null | 'add' | 'edit'
  const [editingStudent, setEditingStudent] = useState(null);

  // Search: query the mock API whenever the search box changes. Results can
  // come back out of order (a short, broad query can resolve after a longer,
  // more specific one), so a stale response is dropped instead of being
  // allowed to overwrite whatever the user is currently looking at.
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    let cancelled = false;
    setSearching(true);
    searchStudents(trimmed).then((results) => {
      if (cancelled) return;
      setSearchResults(results);
      setSearching(false);
    });
    return () => {
      cancelled = true;
    };
  }, [query]);

  // Load more: fetch the next page once the user asks for it.
  useEffect(() => {
    if (visibleCount <= PAGE_SIZE) return;
    const page = Math.ceil(visibleCount / PAGE_SIZE);
    fetchStudentsPage(page, PAGE_SIZE).then(() => {
      // refresh the list now that another page has come in
      setStudents((prev) => [...prev]);
    });
  }, [visibleCount, students]);

  function handleSortChange(e) {
    const key = e.target.value;
    setSortKey(key);
    const sorted = [...students].sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0));
    setStudents(sorted);
  }

  function handleDelete(id) {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  function openAddModal() {
    setEditingStudent(null);
    setModalMode('add');
  }

  function openEditModal(student) {
    setEditingStudent(student);
    setModalMode('edit');
  }

  function closeModal() {
    setModalMode(null);
    setEditingStudent(null);
  }

  function handleAdded(newStudent) {
    setStudents((prev) => [...prev, newStudent]);
  }

  function handleUpdated(updated) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s)));
  }

  const baseList = query.trim() ? searchResults ?? [] : students.slice(0, visibleCount);

  return (
    <section className="students-page">
      <h2>Students</h2>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={sortKey} onChange={handleSortChange}>
          <option value="marks">Sort: Marks</option>
          <option value="attendance">Sort: Attendance</option>
        </select>
      </div>

      {searching && <p className="hint">Searching...</p>}

      <ul className="student-list">
        {baseList.map((student) => (
          <StudentCard
            key={student.id}
            student={student}
            onView={() => onView(student.id)}
            onEdit={() => openEditModal(student)}
            onDelete={() => handleDelete(student.id)}
          />
        ))}
      </ul>

      {!query.trim() && visibleCount < students.length && (
        <button
          className="secondary-btn"
          onClick={() => setVisibleCount((c) => Math.min(c + PAGE_SIZE, students.length))}
        >
          Load More
        </button>
      )}

      <button className="primary-btn" onClick={openAddModal}>
        Add Student
      </button>

      {modalMode && (
        <StudentModal
          mode={modalMode}
          student={editingStudent}
          onClose={closeModal}
          onAdded={handleAdded}
          onUpdated={handleUpdated}
        />
      )}
    </section>
  );
}

export default Students;
