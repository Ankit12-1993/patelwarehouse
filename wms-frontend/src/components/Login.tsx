import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const data = await api.post('/auth/login', { email, password });
      
      // Store token
      localStorage.setItem('jwt_token', data.token);
      localStorage.setItem('user_role', data.role);
      
      if (data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/vendor');
      }
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ 
      maxWidth: '440px', 
      width: '100%', 
      margin: '0 auto', // Removed vertical margin, relying on flex parent to center
      padding: '40px', 
      textAlign: 'center',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <h2 style={{ marginBottom: '8px', fontSize: '28px' }}>Warehouse Portal Login</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>
        Secure access to manage your warehouse operations
      </p>
      
      {error && (
        <div style={{ 
          backgroundColor: '#fef2f2', 
          color: 'var(--error)', 
          padding: '12px', 
          borderRadius: '6px',
          marginBottom: '20px', 
          fontSize: '14px',
          border: '1px solid #fee2e2'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>
            Email Address
          </label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            placeholder="Enter your email"
            disabled={loading}
            style={{ height: '44px', width: '100%' }}
          />
        </div>
        
        <div style={{ textAlign: 'left' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: 'var(--text-main)' }}>
            Password
          </label>
          <input 
            type="password" 
            required 
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            placeholder="Enter your password"
            disabled={loading}
            style={{ height: '44px', width: '100%' }}
          />
          <div style={{ textAlign: 'right', marginTop: '8px' }}>
            <Link to="#" onClick={(e) => { e.preventDefault(); alert("Contact support to reset your password."); }} style={{ color: 'var(--primary)', fontSize: '13px', textDecoration: 'none', fontWeight: 500 }}>
              Forgot Password?
            </Link>
          </div>
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading} 
          style={{ 
            marginTop: '8px', 
            height: '48px', 
            fontSize: '16px',
            backgroundColor: 'var(--primary)',
            color: 'white',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--primary-hover)'; }}
          onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = 'var(--primary)'; }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
