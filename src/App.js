import './App.css';
import Navbar from './components/Navbar';
import TableView from './pages/TableView';
import Home from './pages/Home';
import Extension from './pages/Extension';

function App() {
  let page;
  switch (window.location.pathname) {
    case "/":
      page = <Home />
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
    <div className="App">
      <Navbar />
      {page}
    </div>
  );
}

export default App;
