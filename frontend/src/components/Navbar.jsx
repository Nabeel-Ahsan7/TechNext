import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link as LinkIcon, LogOut, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav>
      <div>
        <Link to="/">
          <LinkIcon />
          <span>URL Shortener</span>
        </Link>

        <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <BarChart3 />
                <span>Dashboard</span>
              </Link>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <span style={{color: '#64748b'}}>Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-danger">
                  <LogOut />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn btn-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;