// Small mock API layer. Everything here is backed by the local `students`
// array and just uses setTimeout to simulate network latency, so the app
// can run without any real backend.
import { students as allStudents } from './data';

export function searchStudents(query) {
  const trimmed = query.trim().toLowerCase();
  // Shorter queries simulate a "broader" search that takes a little longer
  // to come back than a more specific one.
  const delay = Math.max(150, 650 - trimmed.length * 70);
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = allStudents.filter((student) =>
        student.name.toLowerCase().includes(trimmed)
      );
      resolve(results);
    }, delay);
  });
}

export function fetchStudentsPage(page, pageSize = 4) {
  console.log(`GET /api/students?page=${page}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize;
      resolve(allStudents.slice(start, start + pageSize));
    }, 400);
  });
}

export function createStudent(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: Date.now() + Math.random(), ...data });
    }, 600);
  });
}

export function updateStudent(id, updates, user) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const student = allStudents.find((s) => s.id === id);
      if (!student) {
        return reject(new Error('Student not found'));
      }
      if (student.ownerId !== user.id) {
        return reject(new Error('Unauthorized: You do not have permission to modify this record'));
      }
      resolve({ id, ...updates });
    }, 1200);
  });
}