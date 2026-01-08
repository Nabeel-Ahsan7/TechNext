import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { urlService } from '../services/urlService';
import { isValidUrl, copyToClipboard } from '../utils/helpers';
import { Link, Loader, Copy, CheckCircle, AlertCircle } from 'lucide-react';

const UrlShortenerForm = ({ onUrlCreated, disabled = false }) => {
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.originalUrl) {
      newErrors.originalUrl = 'URL is required';
    } else if (!isValidUrl(formData.originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL (e.g., https://example.com)';
    }

    if (formData.title && formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || disabled) return;

    setLoading(true);
    setResult(null);
    setCopied(false);

    try {
      const response = await urlService.shortenUrl(
        formData.originalUrl,
        formData.title || undefined
      );
      
      setResult(response.data);
      
      if (onUrlCreated) {
        onUrlCreated(response.data);
      }

      toast.success('URL shortened successfully!');
      
      setFormData({
        originalUrl: '',
        title: ''
      });
    } catch (error) {
      console.error('Shorten URL error:', error);
      const errorMessage = error.response?.data?.error || 'Failed to shorten URL. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      const success = await copyToClipboard(result.shortUrl);
      if (success) {
        setCopied(true);
        toast.success('Short URL copied to clipboard!');
        setTimeout(() => setCopied(false), 3000);
      } else {
        toast.error('Failed to copy URL');
      }
    }
  };

  return (
    <div className="url-form-container">
      <div className="form-header">
        <div className="form-icon blue">
          <Link />
        </div>
        <h2>Shorten URL</h2>
      </div>

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="originalUrl">
            Long URL <span style={{color: '#ef4444'}}>*</span>
          </label>
          <input
            id="originalUrl"
            name="originalUrl"
            type="url"
            placeholder="https://example.com/very-long-url..."
            value={formData.originalUrl}
            onChange={handleChange}
            disabled={loading || disabled}
            required
            className="input"
          />
          {errors.originalUrl && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.originalUrl}
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="title">
            Title (optional)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Give your short URL a memorable title..."
            value={formData.title}
            onChange={handleChange}
            disabled={loading || disabled}
            className="input"
          />
          {errors.title && (
            <div className="error-message">
              <AlertCircle size={16} />
              {errors.title}
            </div>
          )}
          <p className="form-hint">
            Optional: Add a custom title to help you remember this URL
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || disabled}
          className={`btn btn-full ${disabled ? 'btn-disabled' : 'btn-primary'}`}
        >
          {loading ? (
            <>
              <Loader />
              Shortening...
            </>
          ) : disabled ? (
            'URL Limit Reached'
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>

      {result && (
        <div className="result-container">
          <div className="result-header">
            <CheckCircle className="success-icon" />
            <h3>URL shortened successfully!</h3>
          </div>

          <div className="result-content">
            <div className="result-field">
              <p className="result-label">Short URL:</p>
              <div className="copy-container">
                <input
                  type="text"
                  value={result.shortUrl}
                  readOnly
                  className="input copy-input"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={copied}
                  className={`btn ${copied ? 'btn-success' : 'btn-secondary'}`}
                >
                  {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {result.title && (
              <div className="result-field">
                <p className="result-label">Title:</p>
                <p className="result-value">{result.title}</p>
              </div>
            )}

            <div className="result-field">
              <p className="result-label">Original URL:</p>
              <p className="result-value" style={{wordBreak: 'break-all'}}>{result.originalUrl}</p>
            </div>

            <div className="result-meta">
              <div className="result-stats">
                <span>Clicks: {result.clickCount}</span>
                <span>Created: {new Date(result.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UrlShortenerForm;