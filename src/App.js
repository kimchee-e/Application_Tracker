import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TableView from './pages/TableView';
import Home from './pages/Home';
import Extension from './pages/Extension';
import Login from './pages/Login';
import { useAuth, AuthProvider } from './context/AuthContext';
import Calendar from './pages/Calendar';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="authenticated-layout">
            <Sidebar />
            <div className="content-with-sidebar">
                {children}
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
                        <Route path="/" element={<><Navbar /><Home /></>} />
                        <Route path="/login" element={<><Navbar /><Login /></>} />
                        <Route path="/tableView" element={
                            <ProtectedRoute>
                                <TableView />
                            </ProtectedRoute>
                        } />
                        <Route path="/extension" element={
                            <ProtectedRoute>
                                <Extension />
                            </ProtectedRoute>
                        } />
                        <Route path="/calendar" element={
                            <ProtectedRoute>
                                <Calendar />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
