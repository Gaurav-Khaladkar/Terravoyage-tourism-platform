import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { api } from '../api';

export default function MyBookingsModal({ onClose, onSelectBookingVoucher }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');

  const loadBookings = () => {
    setLoading(true);
    api.getMyBookings()
      .then(setBookings)
      .catch((err) => setActionError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (ref) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${ref}? Your slots will be released and a full refund simulated.`)) {
      return;
    }
    try {
      await api.cancelBooking(ref);
      loadBookings();
    } catch (err) {
      setActionError(err.message || 'Error cancelling booking');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '780px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0d131f',
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
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
              Traveler Portal
            </span>
            <h3 style={{ fontSize: '1.3rem', color: '#ffffff' }}>My Expedition Bookings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {actionError && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}>
              {actionError}
            </div>
          )}

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              Loading your travel expeditions...
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Calendar size={48} color="#94a3b8" style={{ marginBottom: '12px' }} />
              <h4 style={{ color: '#ffffff', marginBottom: '6px' }}>No active reservations yet</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Explore our world-class expeditions and secure your place with zero deposit fees.
              </p>
              <button onClick={onClose} className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Discover Expeditions
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {bookings.map((b) => (
                <div
                  key={b.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '14px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em' }}>
                          {b.bookingReference}
                        </span>
                        <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-emerald' : (b.status === 'CANCELLED' ? 'badge-gold' : 'badge-blue')}`}>
                          {b.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', color: '#ffffff' }}>
                        {b.tourTitle}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '4px' }}>
                        <MapPin size={13} color="#10b981" />
                        <span>{b.destinationName}, {b.destinationCountry}</span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>Total Paid</span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>
                        ${b.totalAmount?.toFixed(2)} USD
                      </span>
                    </div>
                  </div>

                  {/* Travel Date & Party */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="#06b6d4" />
                      <span>Departure: <strong style={{ color: '#ffffff' }}>{b.travelDate}</strong></span>
                    </div>
                    <div>
                      <span>Travelers: <strong style={{ color: '#ffffff' }}>{b.adultCount} Adults {b.childCount > 0 ? `, ${b.childCount} Children` : ''}</strong></span>
                    </div>
                    {b.couponCode && (
                      <span style={{ color: '#fbbf24' }}>Promo: {b.couponCode} (-${b.discountAmount?.toFixed(2)})</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    {b.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleCancel(b.bookingReference)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.1)',
                          color: '#f43f5e',
                          border: '1px solid rgba(244, 63, 94, 0.3)',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                        }}
                      >
                        Cancel Reservation
                      </button>
                    )}
                    <button
                      onClick={() => onSelectBookingVoucher(b)}
                      className="btn-primary"
                      style={{ padding: '6px 16px', fontSize: '0.8rem', borderRadius: '8px' }}
                    >
                      <Download size={14} />
                      <span>View Voucher</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
