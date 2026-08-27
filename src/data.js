// Seed data for Student Quick Manager.
// This array is intentionally the single in-memory "source of truth" that
// gets shared across the app (dashboard stats, the students list, and the
// mock API layer all read from it).
export const students = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    marks: 85,
    attendance: 91,
    profile: { class: '10-A' },
    studyPartnerId: null,
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    marks: 92,
    attendance: 88,
    profile: { class: '10-B' },
    studyPartnerId: null,
  },
  {
    id: 3,
    name: 'Arjun Kumar',
    email: 'arjun.kumar@example.com',
    marks: 78,
    attendance: 95,
    profile: { class: '10-A' },
    studyPartnerId: 3,
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    marks: 65,
    attendance: 72,
    profile: { class: '10-C' },
    studyPartnerId: 5,
  },
  {
    id: 5,
    name: 'Karan Mehta',
    email: 'karan.mehta@example.com',
    marks: 88,
    attendance: 80,
    profile: { class: '10-B' },
    studyPartnerId: null,
  },
  {
    id: 6,
    name: 'Ananya Joshi',
    email: 'ananya.joshi@example.com',
    marks: 73,
    attendance: 90,
    profile: { class: '10-C' },
    studyPartnerId: null,
  },
  {
    id: 7,
    name: 'Vikram Rao',
    email: 'vikram.rao@example.com',
    marks: 95,
    attendance: 85,
    profile: { class: '10-A' },
    studyPartnerId: null,
  },
  {
    id: 8,
    name: 'Meera Nair',
    email: 'meera.nair@example.com',
    marks: 70,
    attendance: null,
    // profile intentionally omitted for this student -- their record was
    // created before the profile/class field was added to the enrollment form
    studyPartnerId: null,
  },
  {
    id: 9,
    name: 'Fatima Khan',
    email: 'fatima.khan@example.com',
    marks: 82,
    attendance: 93,
    profile: { class: '10-B' },
    studyPartnerId: null,
  },
];
