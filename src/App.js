import './App.css';
import { Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import TableView from './pages/TableView';
import Home from './pages/Home';
import Extension from './pages/Extension';

function App() {
  // let page;
  // switch (window.location.pathname) {
  //   case "/":
  //     page = <Home />
  //     break;
  //   case "/tableView":
  //     page = <TableView />
  //     break;
  //   case "/extension":
  //     page = <Extension />
  //     break;
  //   default:
  //     break;
  // }



  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tableView" element={<TableView />} />
        <Route path="/extension" element={<Extension />} />
      </Routes>
    </div>
  );
}

export default App;
