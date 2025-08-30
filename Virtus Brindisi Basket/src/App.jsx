import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from "./components/pages/Home";
import ChiSiamo from "./components/pages/ChiSiamo";
import AdminLogin from "./components/pages/AdminLogin";
import AdminDashboard from "./components/pages/AdminDashboard";
import StaffManagement from "./components/pages/StaffManagement";
import NewsManagement from "./components/pages/NewsManagement";
import NewsEditor from "./components/pages/NewsEditor";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute>
              <StaffManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/news" element={
            <ProtectedRoute>
              <NewsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/news/new" element={
            <ProtectedRoute>
              <NewsEditor />
            </ProtectedRoute>
          } />
          <Route path="/admin/news/edit/:id" element={
            <ProtectedRoute>
              <NewsEditor />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

