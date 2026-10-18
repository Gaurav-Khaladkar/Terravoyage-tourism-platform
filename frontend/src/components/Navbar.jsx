import React from 'react';
import { Compass, Sparkles, User, Calendar, ShieldCheck, LogOut, LogIn } from 'lucide-react';
import { getUser, removeToken } from '../api';

export default function Navbar({ onOpenAuth, onOpenMyBookings, onOpenAdmin, onOpenAI, currentUser, onLogout }) {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(9, 13, 22, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      padding: '16px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #10b981, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)',
        }}>
          <Compass size={24} color="#ffffff" />
        </div>
        <div>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Terra<span style={{ color: '#10b981' }}>Voyage</span>
          </span>
          <span style={{
            fontSize: '0.65rem',
            letterSpacing: '0.15em',
            display: 'block',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            fontWeight: 700,
            marginTop: '-4px',
          }}>
            Global Expeditions
          </span>
        </div>
      </div>

      {/* Nav Center Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={onOpenAI}
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#34d399',
            padding: '8px 16px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '0.9rem',
          }}
        >
          <Sparkles size={16} />
          <span>AI Trip Copilot</span>
        </button>

        {currentUser && (
          <button
            onClick={onOpenMyBookings}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              padding: '8px 16px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 500,
              fontSize: '0.9rem',
            }}
          >
            <Calendar size={16} color="#06b6d4" />
            <span>My Bookings</span>
          </button>
        )}

        {currentUser && currentUser.role === 'ROLE_ADMIN' && (
          <button
            onClick={onOpenAdmin}
            style={{
              background: 'rgba(245, 158, 11, 0.12)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              color: '#fbbf24',
              padding: '8px 16px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <ShieldCheck size={16} />
            <span>Admin Portal</span>
          </button>
        )}
      </div>

      {/* User Session */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
              alt={currentUser.fullName}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #10b981',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{currentUser.fullName}</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                {currentUser.role === 'ROLE_ADMIN' ? 'Administrator' : 'Verified Traveler'}
              </span>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                color: '#f43f5e',
                padding: '8px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="btn-primary"
            style={{ padding: '8px 20px', fontSize: '0.9rem' }}
          >
            <LogIn size={16} />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </nav>
  );
}
