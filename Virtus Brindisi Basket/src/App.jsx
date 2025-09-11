import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { initializeStorageBuckets } from './lib/storageManager';
import Home from "./components/pages/Home";
import ChiSiamo from "./components/pages/ChiSiamo";
import NewsPage from "./components/pages/NewsPage";
import ResultsPage from "./components/pages/ResultsPage";
import NewsDetailPage from "./components/pages/NewsDetailPage";
import TrainingSchedule from "./components/pages/TrainingSchedule";
import MatchSchedule from "./components/pages/MatchSchedule";
import ContactsPage from "./components/pages/ContactsPage";
import AdminLogin from "./components/pages/AdminLogin";
import AdminDashboard from "./components/pages/AdminDashboard";
import StaffManagement from "./components/pages/StaffManagement";
import NewsManagement from "./components/pages/NewsManagement";
import NewsEditor from "./components/pages/NewsEditor";
import GalleryManagement from "./components/pages/GalleryManagement";
import PalmaresManagement from "./components/pages/PalmaresManagement";
import MatchResultsManagement from "./components/pages/MatchResultsManagement";
import CalendarManagement from "./components/pages/CalendarManagement";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Simple scroll management that works with animations
function ScrollManager() {
  const location = useLocation();
  
  useEffect(() => {
    // Reset scroll position immediately on route change, before animations start
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);
  
  return null;
}

function App() {
  // Inizializza i bucket di storage all'avvio
  useEffect(() => {
    initializeStorageBuckets()
  }, [])

  return (
    <AuthProvider>
      <Router>
        <ScrollManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/risultati" element={<ResultsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
          <Route path="/calendario-allenamenti" element={<TrainingSchedule />} />
          <Route path="/calendario-partite" element={<MatchSchedule />} />
          <Route path="/contatti" element={<ContactsPage />} />
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
          <Route path="/admin/gallery" element={
            <ProtectedRoute>
              <GalleryManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/palmares" element={
            <ProtectedRoute>
              <PalmaresManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/results" element={
            <ProtectedRoute>
              <MatchResultsManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/calendar" element={
            <ProtectedRoute>
              <CalendarManagement />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

