import React, { useState, useEffect } from 'react';
import { MapPin, Sun, Calendar, ArrowUpRight } from 'lucide-react';
import { api } from '../api';

export default function DestinationExplorer({ onSelectDestination }) {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    api.getDestinations().then(setDestinations).catch(console.error);
  }, []);

  return (
    <section style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="badge badge-blue" style={{ marginBottom: '10px' }}>
            Curated Global Destinations
          </span>
          <h2 style={{ fontSize: '2.2rem', color: '#ffffff' }}>
            Explore by Continent &amp; Climate
          </h2>
        </div>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '450px', fontSize: '0.9rem' }}>
          From Swiss glaciated summits to Bali volcanic retreats and Serengeti wild savannahs. Handcrafted for discerning travelers.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '24px',
      }}>
        {destinations.map((dest) => (
          <div
            key={dest.id}
            className="glass-panel"
            onClick={() => onSelectDestination(dest)}
            style={{
              position: 'relative',
              height: '320px',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <img
              src={dest.imageUrl}
              alt={dest.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(9,13,22,0.95) 100%)',
            }} />

            {/* Top Region badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
            }}>
              <span className="badge badge-emerald">
                {dest.region || dest.country}
              </span>
            </div>

            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'rgba(0,0,0,0.5)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <ArrowUpRight size={18} color="#ffffff" />
            </div>

            {/* Bottom details */}
            <div style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.85rem', fontWeight: 600, marginBottom: '4px' }}>
                <MapPin size={14} />
                <span>{dest.country}</span>
              </div>
              <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '8px', lineHeight: 1.2 }}>
                {dest.name}
              </h3>

              <div style={{ display: 'flex', gap: '14px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sun size={13} color="#f59e0b" />
                  <span>{dest.climate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#06b6d4" />
                  <span>{dest.bestSeason?.split('/')[0]}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
