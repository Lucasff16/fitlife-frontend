import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import Home from './pages/Home';
import Treinos from './pages/Treinos';
import Progresso from './pages/Progresso';
import Objetivos from './pages/Objetivos';
import Estatisticas from './pages/Estatisticas';
import Perfil from './pages/Perfil';
import Configuracoes from './pages/Configuracoes';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-black text-white">
        <div className="pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/treinos" element={<Treinos />} />
            <Route path="/progresso" element={<Progresso />} />
            <Route path="/objetivos" element={<Objetivos />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Routes>
        </div>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;