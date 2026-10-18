import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Check, Ban, Star, ShieldCheck, ChevronDown, ChevronUp, MessageSquarePlus } from 'lucide-react';
import { api } from '../api';

export default function TourModal({ pkg, onClose, onBookNow, currentUser }) {
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary', 'inclusions', 'reviews'
  const [expandedDay, setExpandedDay] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    if (pkg?.id) {
      api.getReviews(pkg.id).then(setReviews).catch(console.error);
    }
  }, [pkg]);

  if (!pkg) return null;

  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setReviewMessage('Please sign in to submit a review.');
      return;
    }
    if (!newComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const rev = await api.postReview({
        tourPackageId: pkg.id,
        rating: newRating,
        title: 'Verified Expedition Review',
        comment: newComment,
      });
      setReviews([rev, ...reviews]);
      setNewComment('');
      setReviewMessage('Thank you! Your verified review has been published.');
    } catch (err) {
      setReviewMessage(err.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '850px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0e1522',
        }}
      >
        {/* Modal Header Banner */}
        <div style={{ position: 'relative', height: '260px', flexShrink: 0 }}>
          <img
            src={pkg.bannerImageUrl}
            alt={pkg.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, #0e1522 100%)',
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0, 0, 0, 0.6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <X size={20} />
          </button>

          {/* Title on banner */}
          <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-emerald">{pkg.category?.replace('_', ' ')}</span>
              <span className="badge badge-blue">{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', color: '#ffffff', lineHeight: 1.2 }}>
              {pkg.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.85rem', marginTop: '6px' }}>
              <MapPin size={14} color="#10b981" />
              <span>{pkg.destinationName}, {pkg.destinationCountry}</span>
            </div>
          </div>
        </div>

        {/* Modal Nav Tabs */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-glass)',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.02)',
        }}>
          {[
            { id: 'itinerary', label: 'Day-by-Day Itinerary' },
            { id: 'inclusions', label: 'What is Included' },
            { id: 'reviews', label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'transparent',
                color: activeTab === tab.id ? '#10b981' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '2px solid #10b981' : '2px solid transparent',
                padding: '14px 20px',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* TAB 1: Itinerary */}
          {activeTab === 'itinerary' && (
            <div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '24px', lineHeight: 1.6 }}>
                {pkg.overview}
              </p>

              <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', color: '#ffffff' }}>
                Expedition Schedule
              </h4>

              {pkg.itinerary && pkg.itinerary.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pkg.itinerary.map((day) => {
                    const isOpen = expandedDay === day.dayNumber;
                    return (
                      <div
                        key={day.dayNumber}
                        style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          onClick={() => setExpandedDay(isOpen ? null : day.dayNumber)}
                          style={{
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            cursor: 'pointer',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              background: 'rgba(16, 185, 129, 0.2)',
                              color: '#34d399',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.8rem',
                              fontWeight: 700,
                            }}>
                              Day {day.dayNumber}
                            </span>
                            <span style={{ fontWeight: 600, color: '#ffffff' }}>
                              {day.title}
                            </span>
                          </div>
                          {isOpen ? <ChevronUp size={18} color="#94a3b8" /> : <ChevronDown size={18} color="#94a3b8" />}
                        </div>

                        {isOpen && (
                          <div style={{
                            padding: '0 18px 16px',
                            borderTop: '1px solid rgba(255,255,255,0.05)',
                            paddingTop: '12px',
                          }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
                              {day.description}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#06b6d4' }}>
                              <span>🏨 <strong>Stay:</strong> {day.accommodation || 'Handpicked Boutique Resort'}</span>
                              <span>🍽️ <strong>Meals:</strong> {day.mealsIncluded || 'Breakfast'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>Full schedule available upon booking confirmation.</p>
              )}
            </div>
          )}

          {/* TAB 2: Inclusions / Exclusions */}
          {activeTab === 'inclusions' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
              <div>
                <h4 style={{ color: '#34d399', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Check size={18} /> Included in Expedition
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.inclusions?.map((inc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <Check size={14} color="#10b981" />
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ color: '#f43f5e', fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ban size={18} /> Not Included
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pkg.exclusions?.map((exc, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      <Ban size={14} color="#f43f5e" />
                      <span>{exc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {activeTab === 'reviews' && (
            <div>
              {/* Reviews list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <div
                      key={rev.id || Math.random()}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 600, color: '#ffffff' }}>{rev.reviewerName || 'Traveler'}</span>
                          <span className="badge badge-emerald" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                            <ShieldCheck size={12} /> Verified Traveler
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '2px' }}>
                          {[...Array(rev.rating || 5)].map((_, i) => (
                            <Star key={i} size={14} color="#f59e0b" fill="#f59e0b" />
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-secondary)' }}>No traveler reviews yet. Be the first to review!</p>
                )}
              </div>

              {/* Submit review */}
              <form onSubmit={handlePostReview} style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
                padding: '16px',
                borderRadius: '12px',
              }}>
                <h5 style={{ color: '#ffffff', marginBottom: '10px' }}>Leave a Verified Review</h5>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Rating:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      style={{ background: 'transparent' }}
                    >
                      <Star
                        size={18}
                        color="#f59e0b"
                        fill={star <= newRating ? '#f59e0b' : 'none'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  rows="3"
                  placeholder="Share details of your journey, guides, and hotels..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#131b26',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '10px',
                    fontSize: '0.85rem',
                    marginBottom: '10px',
                  }}
                />
                {reviewMessage && (
                  <p style={{ fontSize: '0.85rem', color: '#34d399', marginBottom: '8px' }}>{reviewMessage}</p>
                )}
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="btn-primary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <MessageSquarePlus size={16} />
                  <span>{reviewSubmitting ? 'Submitting...' : 'Post Verified Review'}</span>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Sticky Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-glass)',
          background: 'rgba(9, 13, 22, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
              All-inclusive Rate
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10b981' }}>
                ${pkg.discountedPrice || pkg.basePrice}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/ guest</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={onClose} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookNow(pkg);
              }}
              className="btn-primary"
              style={{ padding: '10px 24px', fontSize: '0.9rem' }}
            >
              Reserve &amp; Book Tour
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
