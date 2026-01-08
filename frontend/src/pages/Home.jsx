import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Link2, BarChart3, Shield, Zap } from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <div className="hero">
        <div className="container">
          <div style={{display: 'flex', justifyContent: 'center', marginBottom: '2rem'}}>
            <div className="stat-icon blue" style={{width: '80px', height: '80px'}}>
              <Link2 size={40} />
            </div>
          </div>
          
          <h1>
            Make Long URLs <span style={{color: '#fbbf24'}}>Short</span>
          </h1>
          
          <p>
            Transform lengthy URLs into clean, shareable links. Track clicks, manage your links, 
            and boost your online presence with our powerful URL shortener.
          </p>

          <div>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {!isAuthenticated && (
            <p style={{marginTop: '1rem', opacity: 0.8}}>
              Free tier includes 100 shortened URLs
            </p>
          )}
        </div>
      </div>

      <div className="features container">
        <div>
          <h2>
            Why Choose Our URL Shortener?
          </h2>
          <p style={{textAlign: 'center', maxWidth: '600px', margin: '0 auto 3rem'}}>
            Built with performance and security in mind, our platform offers everything you need 
            to manage your links effectively.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon green">
              <Zap size={32} />
            </div>
            <h3>Lightning Fast</h3>
            <p>
              Generate short URLs instantly with our optimized infrastructure.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon purple">
              <BarChart3 size={32} />
            </div>
            <h3>Detailed Analytics</h3>
            <p>
              Track clicks, monitor performance, and gain insights into your audience.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon red">
              <Shield size={32} />
            </div>
            <h3>Secure & Reliable</h3>
            <p>
              Your links are protected with enterprise-grade security measures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;