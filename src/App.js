import './App.css';
import Navbar from './components/Navbar';
import TableView from './pages/TableView';
import Home from './pages/Home';
import Extension from './pages/Extension';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  let page;
  switch (window.location.pathname) {
    case "/":
      page = <Home />
      break;
    case "/login":
      page = <Login />
      break;
    case "/tableView":
      page = <TableView />
      break;
    case "/extension":
      page = <Extension />
      break;
    default:
      break;
  }

  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        {page}
      </div>
    </AuthProvider>
  );
}

export default App;
