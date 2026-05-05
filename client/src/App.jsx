import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Condominos from './pages/Condominos';
import Unidades from './pages/Unidades';
import Garagens from './pages/Garagens';
import Utensilios from './pages/Utensilios';
import Sorteio from './pages/Sorteio';
import Chat from './pages/Chat';
import Documentos from './pages/Documentos';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>🏢 Sistema de Condomínio</h1>
          <nav className="nav">
            <NavLink to="/condominos" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Condôminos</NavLink>
            <NavLink to="/unidades" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Unidades</NavLink>
            <NavLink to="/garagens" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Garagens</NavLink>
            <NavLink to="/utensilios" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Utensílios</NavLink>
            <NavLink to="/sorteio" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Sorteio</NavLink>
            <NavLink to="/chat" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Chat</NavLink>
            <NavLink to="/documentos" className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`}>Documentos</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Condominos />} />
            <Route path="/condominos" element={<Condominos />} />
            <Route path="/unidades" element={<Unidades />} />
            <Route path="/garagens" element={<Garagens />} />
            <Route path="/utensilios" element={<Utensilios />} />
            <Route path="/sorteio" element={<Sorteio />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/documentos" element={<Documentos />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
