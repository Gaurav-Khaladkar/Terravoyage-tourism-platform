import React from 'react';
import { Star, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

export default function PackageCard({ pkg, onSelectPackage, onBookNow }) {
  const isDiscounted = pkg.discountedPrice && pkg.discountedPrice < pkg.basePrice;
  const savings = isDiscounted ? Math.round(pkg.basePrice - pkg.discountedPrice) : 0;

  return (
    <div
      className="glass-panel"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px)';
        e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 25px rgba(16, 185, 129, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border-glass)';
        e.currentTarget.style.boxShadow = 'var(--shadow-subtle)';
      }}
    >
      {/* Banner Image */}
      <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
        <img
          src={pkg.bannerImageUrl}
          alt={pkg.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
          }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(9,13,22,0.85) 100%)',
        }} />

        {/* Top Floating Badges */}
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          display: 'flex',
          gap: '8px',
        }}>
          <span className="badge badge-emerald">
            {pkg.category?.replace('_', ' ')}
          </span>
          {isDiscounted && (
            <span className="badge badge-gold">
              Save ${savings}
            </span>
          )}
        </div>

        <div style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(0, 0, 0, 0.65)',
          backdropFilter: 'blur(8px)',
          borderRadius: '9999px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.8rem',
          fontWeight: 600,
        }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span>{pkg.rating?.toFixed(1) || '4.9'}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
            ({pkg.reviewCount || 12})
          </span>
        </div>

        {/* Bottom Destination Country on Image */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 600,
        }}>
          <MapPin size={14} color="#10b981" />
          <span>{pkg.destinationName}, {pkg.destinationCountry}</span>
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Title */}
        <h3 style={{
          fontSize: '1.2rem',
          lineHeight: 1.3,
          marginBottom: '10px',
          fontWeight: 700,
          color: '#ffffff',
        }}>
          {pkg.title}
        </h3>

        {/* Duration & Difficulty */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          marginBottom: '14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={14} color="#06b6d4" />
            <span>{pkg.durationDays} Days / {pkg.durationNights} Nights</span>
          </div>
          <span>•</span>
          <span style={{
            color: pkg.difficulty === 'EASY' ? '#34d399' : (pkg.difficulty === 'MODERATE' ? '#fbbf24' : '#f87171'),
            fontWeight: 600,
          }}>
            {pkg.difficulty} Trek
          </span>
        </div>

        {/* Highlights Preview */}
        {pkg.highlights && pkg.highlights.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', flex: 1 }}>
            {pkg.highlights.slice(0, 2).map((hl, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <CheckCircle2 size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hl}</span>
              </div>
            ))}
          </div>
        )}

        {/* Slots remaining */}
        <div style={{
          fontSize: '0.75rem',
          color: pkg.availableSlots <= 5 ? '#f43f5e' : '#34d399',
          fontWeight: 600,
          marginBottom: '16px',
        }}>
          ⚡ {pkg.availableSlots > 0 ? `Only ${pkg.availableSlots} slots remaining for upcoming dates` : 'Sold out for this season'}
        </div>

        {/* Price & Action Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '16px',
          marginTop: 'auto',
        }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block', textTransform: 'uppercase' }}>
              Starting From
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
              {isDiscounted ? (
                <>
                  <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#10b981' }}>
                    ${pkg.discountedPrice}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', textDecoration: 'line-through' }}>
                    ${pkg.basePrice}
                  </span>
                </>
              ) : (
                <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                  ${pkg.basePrice}
                </span>
              )}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/ person</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onSelectPackage(pkg)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 600,
                border: '1px solid var(--border-glass)',
              }}
            >
              Itinerary
            </button>
            <button
              onClick={() => onBookNow(pkg)}
              className="btn-primary"
              style={{
                padding: '8px 16px',
                fontSize: '0.85rem',
                borderRadius: '8px',
              }}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
