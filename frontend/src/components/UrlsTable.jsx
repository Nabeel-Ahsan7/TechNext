import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { urlService } from '../services/urlService';
import { copyToClipboard } from '../utils/helpers';
import { Copy, Trash2, ExternalLink, CheckCircle, MoreHorizontal, Calendar, Eye } from 'lucide-react';

const UrlsTable = ({ urls, onUrlDeleted, refreshUrls }) => {
  const [loadingStates, setLoadingStates] = useState({});
  const [copiedStates, setCopiedStates] = useState({});

  const handleCopy = async (shortUrl, urlId) => {
    const success = await copyToClipboard(shortUrl);
    if (success) {
      setCopiedStates(prev => ({ ...prev, [urlId]: true }));
      toast.success('Short URL copied to clipboard!');
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [urlId]: false }));
      }, 3000);
    } else {
      toast.error('Failed to copy URL');
    }
  };

  const handleDelete = async (urlId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || 'this URL'}"?`)) {
      return;
    }

    setLoadingStates(prev => ({ ...prev, [urlId]: true }));

    try {
      await urlService.deleteUrl(urlId);
      toast.success('URL deleted successfully');
      onUrlDeleted(urlId);
    } catch (error) {
      console.error('Delete URL error:', error);
      toast.error('Failed to delete URL');
    } finally {
      setLoadingStates(prev => ({ ...prev, [urlId]: false }));
    }
  };

  if (urls.length === 0) {
    return (
      <div>
        <p>No URLs found.</p>
      </div>
    );
  }

  return (
    <div className="urls-table-container">
      <table className="urls-table">
        <thead>
          <tr>
            <th>Title/URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url.id}>
              <td>
                <div className="url-cell">
                  <div className="url-title">
                    {url.title || 'Untitled'}
                  </div>
                  <div className="url-original">
                    <span className="url-text">{url.originalUrl}</span>
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="url-external-link"
                      title="Visit original URL"
                    >
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              </td>

              <td>
                <div className="short-url-cell">
                  <span className="url-short">{url.shortUrl}</span>
                  <button
                    onClick={() => handleCopy(url.shortUrl, url.id)}
                    disabled={copiedStates[url.id]}
                    className={`copy-button ${copiedStates[url.id] ? 'copied' : ''}`}
                    title="Copy short URL"
                  >
                    {copiedStates[url.id] ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </td>

              <td className="url-clicks">
                <span className="click-count">{url.clickCount}</span>
              </td>

              <td className="url-date">
                {new Date(url.createdAt).toLocaleDateString()}
              </td>

              <td>
                <div className="url-actions">
                  <button
                    onClick={() => handleCopy(url.shortUrl, url.id)}
                    disabled={copiedStates[url.id]}
                    className={`action-btn copy ${copiedStates[url.id] ? 'copied' : ''}`}
                    title="Copy URL"
                  >
                    {copiedStates[url.id] ? <CheckCircle size={14} /> : <Copy size={14} />}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(url.id, url.title)}
                    disabled={loadingStates[url.id]}
                    className="action-btn delete"
                    title="Delete URL"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile View - Hidden on Desktop */}
      <div className="mobile-urls">
        {urls.map((url) => (
          <div key={url.id} className="mobile-url-card">
            <div className="mobile-url-header">
              <div className="url-cell">
                <div className="url-title">
                  {url.title || 'Untitled'}
                </div>
                <div className="url-original">
                  <span className="url-text">
                    {url.originalUrl.length > 50 ? url.originalUrl.substring(0, 50) + '...' : url.originalUrl}
                  </span>
                  <a
                    href={url.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="url-external-link"
                    title="Visit original URL"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(url.id, url.title)}
                disabled={loadingStates[url.id]}
                className="action-btn delete"
                title="Delete URL"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mobile-url-content">
              <div className="mobile-url-field">
                <div className="mobile-url-row">
                  <span className="mobile-label">Short URL:</span>
                  <div className="short-url-cell">
                    <span className="url-short">{url.shortUrl}</span>
                    <button
                      onClick={() => handleCopy(url.shortUrl, url.id)}
                      disabled={copiedStates[url.id]}
                      className={`copy-button ${copiedStates[url.id] ? 'copied' : ''}`}
                      title="Copy short URL"
                    >
                      {copiedStates[url.id] ? <CheckCircle size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="mobile-url-stats">
                  <div className="mobile-stat">
                    <Eye size={14} />
                    <span>{url.clickCount} clicks</span>
                  </div>
                  
                  <div className="mobile-stat">
                    <Calendar size={14} />
                    <span>{new Date(url.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrlsTable;