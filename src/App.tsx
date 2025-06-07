import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StudentProvider } from './contexts/StudentContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/auth/Login';
import FacultyLayout from './components/layouts/FacultyLayout';
import StudentLayout from './components/layouts/StudentLayout';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyAttendance from './pages/faculty/Attendance';
import FacultyAssignments from './pages/faculty/Assignments';
import FacultyNotices from './pages/faculty/Notices';
import FacultyLeaveManagement from './pages/faculty/LeaveManagement';
import StudentDashboard from './pages/student/Dashboard';
import StudentAttendance from './pages/student/Attendance';
import StudentAssignments from './pages/student/Assignments';
import StudentAcademics from './pages/student/Academics';
import StudentNotifications from './pages/student/Notifications';
import StudentLeave from './pages/student/Leave';
import CommunityFeed from './pages/community/Feed';
import EventCalendar from './pages/community/Calendar';
import CampusNavigator from './pages/campus/Navigator';
import CampusCopilot from './pages/campus/Copilot';
import ManageContentPage from './pages/academic/ManageContentPage';

function App() {
  return (
    <AuthProvider>
      <StudentProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Faculty Routes */}
          <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyLayout /></ProtectedRoute>}>
            <Route index element={<FacultyDashboard />} />
            <Route path="attendance" element={<FacultyAttendance />} />
            <Route path="assignments" element={<FacultyAssignments />} />
            <Route path="notices" element={<FacultyNotices />} />
            <Route path="leave-management" element={<FacultyLeaveManagement />} />
            <Route path="community" element={<CommunityFeed />} />
            <Route path="events" element={<EventCalendar />} />
            <Route path="campus" element={<CampusNavigator />} />
            <Route path="manage-content" element={<ManageContentPage />} />
          </Route>
          
          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route index element={<StudentDashboard />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="assignments" element={<StudentAssignments />} />
            <Route path="academics" element={<StudentAcademics />} />
            <Route path="notifications" element={<StudentNotifications />} />
            <Route path="leave" element={<StudentLeave />} />
            <Route path="community" element={<CommunityFeed />} />
            <Route path="events" element={<EventCalendar />} />
            <Route path="campus" element={<CampusNavigator />} />
            <Route path="copilot" element={<CampusCopilot />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      </StudentProvider>
    </AuthProvider>
  );
}

export default App;