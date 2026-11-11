import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Projects from './pages/Projects';
import BudgetEditor from './pages/BudgetEditor';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="container">
      <h1>Budget Creator</h1>

      {user && (
        <nav>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/clients">Clients</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <div className="nav-right">
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route
          path="/projects/:id/budget"
          element={<ProtectedRoute><BudgetEditor /></ProtectedRoute>}
        />
      </Routes>
    </div>
  );
}

export default App;