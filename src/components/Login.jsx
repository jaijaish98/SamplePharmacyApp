import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import GoogleSignInButton from './GoogleSignInButton';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email/Username is required';
    } else if (formData.email.includes('@') && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Since we don't have backend, any valid input will log in
      onLogin({
        email: formData.email,
        name: formData.email.includes('@') ? formData.email.split('@')[0] : formData.email,
        role: 'Admin'
      });
    }, 1000);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'admin@sathyapharmacy.com',
      password: 'admin123'
    });
  };

  const handleGoogleSuccess = (userData) => {
    console.log('Google Sign-In Success:', userData);
    // Call the parent onLogin function with Google user data
    onLogin({
      email: userData.email,
      name: userData.name,
      role: userData.role || 'Admin',
      picture: userData.picture,
      loginMethod: 'google',
      id: userData.id
    });
  };

  const handleGoogleError = (error) => {
    console.error('Google Sign-In Error:', error);
    setErrors({
      general: 'Google Sign-In failed. Please try again or use email/password.'
    });
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-overlay"></div>
      </div>
      
      <div className="login-content">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <div className="pharmacy-logo">
              <div className="logo-icon">
                <div className="pharmacy-pill">
                  <div className="pill-left"></div>
                  <div className="pill-right"></div>
                </div>
              </div>
              <div className="logo-text">
                <h1>Sathya</h1>
                <h2>Pharmacy</h2>
                <p>Management System</p>
              </div>
            </div>
            <div className="login-title">
              <h2>Welcome Back</h2>
              <p>Sign in to access your pharmacy dashboard</p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {/* General Error Message */}
            {errors.general && (
              <div className="error-banner">
                <span className="error-message">{errors.general}</span>
              </div>
            )}
            {/* Email/Username Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email or Username
              </label>
              <div className="input-wrapper">
                <User size={20} className="input-icon" />
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email or username"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <Lock size={20} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox" />
                <span className="checkmark"></span>
                Remember me
              </label>
              <button type="button" className="forgot-password">
                Forgot Password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Google SSO */}
            <div className="sso-section">
              <div className="divider">
                <span>or</span>
              </div>
              <GoogleSignInButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                disabled={isLoading}
              />
            </div>

            {/* Demo Login */}
            <div className="demo-section">
              <div className="divider">
                <span>or</span>
              </div>
              <button
                type="button"
                className="demo-button"
                onClick={handleDemoLogin}
                disabled={isLoading}
              >
                Use Demo Credentials
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="login-footer">
            <p>© 2024 Sathya Pharmacy. All rights reserved.</p>
            <div className="footer-links">
              <a href="#" className="footer-link">Privacy Policy</a>
              <a href="#" className="footer-link">Terms of Service</a>
              <a href="#" className="footer-link">Support</a>
            </div>
          </div>
        </div>

        {/* Side Info */}
        <div className="login-info">
          <div className="info-content">
            <h3>Comprehensive Pharmacy Management</h3>
            <ul className="feature-list">
              <li>✓ Real-time Inventory Management</li>
              <li>✓ Professional Billing System</li>
              <li>✓ Customer Relationship Management</li>
              <li>✓ Prescription Management</li>
              <li>✓ Advanced Analytics & Reports</li>
              <li>✓ Supplier Management</li>
            </ul>
            <div className="info-stats">
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Modules</span>
              </div>
              <div className="stat">
                <span className="stat-number">100+</span>
                <span className="stat-label">Features</span>
              </div>
              <div className="stat">
                <span className="stat-number">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
