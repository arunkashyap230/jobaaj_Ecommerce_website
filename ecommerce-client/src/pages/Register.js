import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './Auth.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fade-in">
      <div className="container auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <span className="logo-mark">S</span>
          </div>
          <h1>Create account</h1>
          <p className="auth-sub">Start your shopping journey</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input
                type="text" className="form-input" required
                value={name} onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email" className="form-input" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password" className="form-input" required minLength={6}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
