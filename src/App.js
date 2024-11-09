import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import TableView from './pages/TableView';
import Home from './pages/Home';
import Extension from './pages/Extension';
import Login from './pages/Login';
import { useAuth, AuthProvider } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return null;
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tableView" element={
              <ProtectedRoute>
                <TableView />
              </ProtectedRoute>
            } />
            <Route path="/extension" element={<Extension />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
