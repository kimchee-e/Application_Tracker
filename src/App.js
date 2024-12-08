import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TableView from './pages/TableView';
import Home from './pages/Home';
import Extension from './pages/Extension';
import Login from './pages/Login';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import './App.css';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AuthenticatedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="authenticated-layout">
      <Sidebar />
      <div className="content-with-sidebar">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Authenticated routes */}
            <Route element={<AuthenticatedLayout />}>
              <Route path="/tableView" element={<TableView />} />
              <Route path="/extension" element={<Extension />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>

            {/* If no route matches just go home  */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
