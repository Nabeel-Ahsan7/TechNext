import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { urlService } from '../services/urlService';
import UrlShortenerForm from '../components/UrlShortenerForm';
import UrlsTable from '../components/UrlsTable';
import Pagination from '../components/Pagination';
import { RefreshCw, Link, Eye, BarChart3, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUrls: 0,
    hasNext: false,
    hasPrev: false
  });

  const fetchUrls = async (page = 1) => {
    try {
      setLoading(page === 1);
      const response = await urlService.getUserUrls({ page, limit: 10 });
      setUrls(response.data.urls);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to load URLs');
      console.error('Fetch URLs error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handlePageChange = (page) => {
    fetchUrls(page);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUrls(pagination.currentPage);
  };

  const handleUrlCreated = (newUrl) => {
    setUrls(prev => [newUrl, ...prev.slice(0, 9)]);
    
    if (user) {
      updateUser({
        ...user,
        urlCount: user.urlCount + 1
      });
    }
    
    if (pagination.currentPage === 1) {
      setTimeout(() => fetchUrls(1), 1000);
    }
  };

  const handleUrlDeleted = (urlId) => {
    setUrls(prev => prev.filter(url => url.id !== urlId));
    
    if (user) {
      updateUser({
        ...user,
        urlCount: Math.max(0, user.urlCount - 1)
      });
    }

    if (urls.length === 1 && pagination.currentPage > 1) {
      fetchUrls(pagination.currentPage - 1);
    } else {
      fetchUrls(pagination.currentPage);
    }
  };

  const getTotalClicks = () => {
    return urls.reduce((total, url) => total + url.clickCount, 0);
  };

  const getUsagePercentage = () => {
    return user ? Math.round((user.urlCount / 100) * 100) : 0;
  };

  const isNearLimit = () => {
    return user && user.urlCount >= 90;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="loading-content">
            <RefreshCw />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard">
        <div className="dashboard-header">
          <div>
            <div>
              <h1>Dashboard</h1>
              <p>
                Manage your shortened URLs and track their performance
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-primary"
            >
              <RefreshCw className={refreshing ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

      {isNearLimit() && (
        <div className="alert alert-warning">
          <div>
            <AlertTriangle />
            <div>
              <h3>
                Approaching URL Limit
              </h3>
              <p>
                You've used {user?.urlCount} of your 100 free URLs. 
                {user?.urlCount >= 100 ? ' Upgrade your plan to create more URLs.' : ' Consider upgrading for unlimited URLs.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon blue">
              <Link />
            </div>
            <div className="stat-info">
              <p>Total URLs</p>
              <p className="stat-value">{user?.urlCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon green">
              <Eye />
            </div>
            <div className="stat-info">
              <p>Total Clicks</p>
              <p className="stat-value">{getTotalClicks()}</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon purple">
              <BarChart3 />
            </div>
            <div className="stat-info">
              <p>Usage</p>
              <p className="stat-value">{getUsagePercentage()}%</p>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <div className="stat-icon orange">
              <TrendingUp />
            </div>
            <div className="stat-info">
              <p>Average Clicks</p>
              <p className="stat-value">{user?.urlCount > 0 ? Math.round(getTotalClicks() / user.urlCount) : 0}</p>
            </div>
          </div>
        </div>
      </div>

      <UrlShortenerForm 
        onUrlCreated={handleUrlCreated} 
        disabled={user?.urlCount >= 100}
      />

      <div className="urls-section">
        <div className="section-header">
          <div>
            <h2>Your URLs</h2>
            <p>Manage and track all your shortened links</p>
          </div>
        </div>

        {urls.length > 0 ? (
          <>
            <UrlsTable 
              urls={urls} 
              onUrlDeleted={handleUrlDeleted} 
              refreshUrls={() => fetchUrls(pagination.currentPage)}
            />
            
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNext={pagination.hasNext}
                hasPrev={pagination.hasPrev}
              />
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Link />
            </div>
            <h3>No URLs yet</h3>
            <p>
              Create your first shortened URL using the form above to get started!
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default Dashboard;