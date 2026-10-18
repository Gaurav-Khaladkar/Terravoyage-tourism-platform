import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ onClose, onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      let userData;
      if (isLogin) {
        userData = await api.login(email, password);
      } else {
        userData = await api.register(fullName, email, password, phone, 'ROLE_CUSTOMER');
      }
      onAuthSuccess(userData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPass) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const userData = await api.login(demoEmail, demoPass);
      onAuthSuccess(userData);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          overflow: 'hidden',
          background: '#0d131f',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>
              {isLogin ? 'Welcome Back' : 'Create Traveler Account'}
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isLogin ? 'Access your luxury bookings & vouchers' : 'Join 12,000+ luxury travelers worldwide'}
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Demo fast buttons */}
        <div style={{ padding: '16px 24px 0', display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleDemoLogin('traveler@terravoyage.com', 'traveler123')}
            style={{
              flex: 1,
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            ⚡ Demo Traveler Login
          </button>
          <button
            type="button"
            onClick={() => handleDemoLogin('admin@terravoyage.com', 'admin123')}
            style={{
              flex: 1,
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              color: '#fbbf24',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            🛡️ Demo Admin Login
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
          {errorMsg && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              marginBottom: '16px',
            }}>
              {errorMsg}
            </div>
          )}

          {!isLogin && (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}>
                  <User size={16} color="#10b981" />
                  <input
                    type="text"
                    required
                    placeholder="Gaurav Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#ffffff', width: '100%', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Phone Number
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                }}>
                  <Phone size={16} color="#10b981" />
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ background: 'transparent', border: 'none', color: '#ffffff', width: '100%', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Email Address
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}>
              <Mail size={16} color="#10b981" />
              <input
                type="email"
                required
                placeholder="traveler@terravoyage.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
              Password
            </label>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              padding: '10px 14px',
            }}>
              <Lock size={16} color="#10b981" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: '#ffffff', width: '100%', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', marginBottom: '16px' }}
          >
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>

          <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {isLogin ? "Don't have an account yet?" : "Already registered?"}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg('');
              }}
              style={{
                background: 'transparent',
                color: '#10b981',
                fontWeight: 600,
                textDecoration: 'underline',
              }}
            >
              {isLogin ? 'Create one now' : 'Sign in here'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
