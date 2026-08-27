import { useEffect, useState } from 'react';
import { students as seedStudents } from './data';
import Dashboard from './Dashboard';
import Students from './Students';
import StudentDetails from './StudentDetails';
import ErrorBoundary from './ErrorBoundary';
import { registerCrashHandler } from './reportError';
import './App.css';

function App() {
  const [students, setStudents] = useState(seedStudents);
  const [view, setView] = useState('dashboard');
  const [selectedId, setSelectedId] = useState(null);
  const [crashed, setCrashed] = useState(false);

  useEffect(() => {
    registerCrashHandler(() => setCrashed(true));
    return () => registerCrashHandler(null);
  }, []);

  function openDetails(id) {
    setSelectedId(id);
    setView('details');
  }

  if (crashed) {
    return (
      <div className="app-crashed">
        <h1>Student Quick Manager has crashed</h1>
        <p>
          A fatal error stopped the app from continuing safely, so it has
          been shut down rather than left in a broken state.
        </p>
        <button onClick={() => window.location.reload()}>Reload app</button>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 onClick={() => setView('dashboard')}>Student Quick Manager</h1>
        <nav>
          <button
            className={view === 'dashboard' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={view === 'students' || view === 'details' ? 'nav-link active' : 'nav-link'}
            onClick={() => setView('students')}
          >
            Students
          </button>
        </nav>
      </header>

      <main className="app-main">
        <ErrorBoundary key={`${view}-${selectedId ?? ''}`}>
          {view === 'dashboard' && (
            <Dashboard students={students} onViewStudents={() => setView('students')} />
          )}
          {view === 'students' && (
            <Students students={students} setStudents={setStudents} onView={openDetails} />
          )}
          {view === 'details' && (
            <StudentDetails
              studentId={selectedId}
              students={students}
              setStudents={setStudents}
              onBack={() => setView('students')}
            />
          )}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
