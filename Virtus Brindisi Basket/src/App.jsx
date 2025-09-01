import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import Home from "./components/pages/Home";
import ChiSiamo from "./components/pages/ChiSiamo";
import NewsPage from "./components/pages/NewsPage";
import ResultsPage from "./components/pages/ResultsPage";
import NewsDetailPage from "./components/pages/NewsDetailPage";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chi-siamo" element={<ChiSiamo />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/risultati" element={<ResultsPage />} />
          <Route path="/news/:id" element={<NewsDetailPage />} />
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

