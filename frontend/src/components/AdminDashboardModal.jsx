import React, { useState, useEffect } from 'react';
import { X, TrendingUp, DollarSign, CalendarCheck, Users, Globe, ShieldAlert, Check } from 'lucide-react';
import { api } from '../api';

export default function AdminDashboardModal({ onClose }) {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusUpdating, setStatusUpdating] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [s, b] = await Promise.all([
        api.getAdminAnalytics(),
        api.getAllBookingsAdmin(),
      ]);
      setStats(s);
      setBookings(b);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateStatus = async (reference, newStatus) => {
    setStatusUpdating(reference);
    try {
      await api.updateBookingStatusAdmin(reference, newStatus);
      loadAdminData();
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setStatusUpdating('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '920px',
          maxHeight: '90vh',
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
            <span className="badge badge-gold" style={{ marginBottom: '4px' }}>
              Spring Boot Enterprise Console
            </span>
            <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Backoffice Analytics &amp; Bookings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
              Loading platform telemetry...
            </div>
          ) : (
            <div>
              {/* Metrics Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '28px',
              }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '14px',
                  padding: '18px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Gross Revenue
                    </span>
                    <DollarSign size={18} color="#10b981" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#10b981' }}>
                    ${stats?.totalRevenue?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block', marginTop: '4px' }}>
                    +18.4% vs last quarter
                  </span>
                </div>

                <div style={{
                  background: 'rgba(6, 182, 212, 0.08)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '14px',
                  padding: '18px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Confirmed Bookings
                    </span>
                    <CalendarCheck size={18} color="#06b6d4" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                    {stats?.confirmedBookings || 0} / {stats?.totalBookings || 0}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#22d3ee', display: 'block', marginTop: '4px' }}>
                    Active Expeditions
                  </span>
                </div>

                <div style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '14px',
                  padding: '18px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Catalog Inventory
                    </span>
                    <Globe size={18} color="#f59e0b" />
                  </div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                    {stats?.activeTourPackages || 0} Tours
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'block', marginTop: '4px' }}>
                    Across {stats?.totalDestinations || 0} World Destinations
                  </span>
                </div>
              </div>

              {/* All Bookings Table */}
              <h4 style={{ color: '#ffffff', fontSize: '1.1rem', marginBottom: '16px' }}>
                Customer Reservation Registry
              </h4>

              <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                overflowX: 'auto',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-tertiary)', background: 'rgba(0,0,0,0.2)' }}>
                      <th style={{ padding: '12px 16px' }}>Reference</th>
                      <th style={{ padding: '12px 16px' }}>Traveler</th>
                      <th style={{ padding: '12px 16px' }}>Expedition</th>
                      <th style={{ padding: '12px 16px' }}>Travel Date</th>
                      <th style={{ padding: '12px 16px' }}>Amount</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 700 }}>
                          {b.bookingReference}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ color: '#ffffff', fontWeight: 600, display: 'block' }}>{b.travelerName || 'Guest'}</span>
                          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>{b.travelerEmail}</span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#ffffff', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {b.tourTitle}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                          {b.travelDate}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#34d399', fontWeight: 700 }}>
                          ${b.totalAmount?.toFixed(2)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-emerald' : (b.status === 'CANCELLED' ? 'badge-gold' : 'badge-blue')}`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <select
                            disabled={statusUpdating === b.bookingReference}
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b.bookingReference, e.target.value)}
                            style={{
                              background: '#131b26',
                              color: '#ffffff',
                              border: '1px solid var(--border-glass)',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                            }}
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
