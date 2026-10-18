import React from 'react';
import { Search, SlidersHorizontal, MapPin, Compass, Shield, Award, Users } from 'lucide-react';

const CATEGORIES = [
  { id: 'ALL', label: 'All Expeditions' },
  { id: 'LUXURY', label: '✨ Luxury & Scenic' },
  { id: 'ADVENTURE', label: '⛰️ Alpine & Trekking' },
  { id: 'CULTURAL', label: '🏯 Cultural Heritage' },
  { id: 'SAFARI', label: '🦁 Wildlife Safari' },
  { id: 'BEACH_WELLNESS', label: '🏝️ Beach & Wellness' },
];

export default function HeroSection({
  searchKeyword,
  setSearchKeyword,
  selectedCategory,
  setSelectedCategory,
  selectedDifficulty,
  setSelectedDifficulty,
  maxPrice,
  setMaxPrice,
  onTriggerSearch,
}) {
  return (
    <section style={{
      position: 'relative',
      padding: '80px 24px 60px',
      background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(16, 185, 129, 0.15), transparent 70%), linear-gradient(180deg, #090d16 0%, #0d131f 100%)',
      borderBottom: '1px solid var(--border-glass)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        {/* Top Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '6px 18px',
          borderRadius: '9999px',
          marginBottom: '24px',
        }}>
          <Compass size={16} color="#10b981" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#34d399' }}>
            Enterprise Tourism &amp; Expedition Booking Engine
          </span>
        </div>

        {/* Main Headline */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          lineHeight: 1.1,
          marginBottom: '20px',
          fontWeight: 800,
        }}>
          Extraordinary Journeys.{' '}
          <span className="gradient-text">Unrivaled Luxury.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 1.8vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '750px',
          margin: '0 auto 40px',
        }}>
          Discover handcrafted expeditions across Swiss summits, Balinese temples, Serengeti migrations, and Amalfi coastlines. Engineered with Java Spring Boot &amp; AI trip intelligence.
        </p>

        {/* Floating Search Console */}
        <div className="glass-panel" style={{
          padding: '24px',
          maxWidth: '1050px',
          margin: '0 auto',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        }}>
          {/* Top category tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            overflowX: 'auto',
            paddingBottom: '16px',
            borderBottom: '1px solid var(--border-glass)',
            marginBottom: '20px',
          }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  background: selectedCategory === cat.id ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === cat.id ? '#ffffff' : 'var(--text-secondary)',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  border: selectedCategory === cat.id ? 'none' : '1px solid var(--border-glass)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Inputs Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            alignItems: 'end',
            textAlign: 'left',
          }}>
            {/* Keyword Input */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Destination or Keyword
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '10px 14px',
              }}>
                <MapPin size={18} color="#10b981" />
                <input
                  type="text"
                  placeholder="e.g. Switzerland, Bali, Safari..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onTriggerSearch()}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#ffffff',
                    width: '100%',
                    fontSize: '0.9rem',
                  }}
                />
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>
                Trek Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  background: '#131b26',
                  color: '#ffffff',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '11px 14px',
                  fontSize: '0.9rem',
                }}
              >
                <option value="ALL">Any Activity Level</option>
                <option value="EASY">Easy &amp; Leisurely</option>
                <option value="MODERATE">Moderate Exploration</option>
                <option value="CHALLENGING">Challenging Summit</option>
              </select>
            </div>

            {/* Price Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                  Max Budget
                </label>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981' }}>
                  ${maxPrice} USD
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="4000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                style={{
                  width: '100%',
                  accentColor: '#10b981',
                  cursor: 'pointer',
                  height: '6px',
                }}
              />
            </div>

            {/* Search Button */}
            <div>
              <button
                onClick={onTriggerSearch}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', height: '46px' }}
              >
                <Search size={18} />
                <span>Search Expeditions</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          marginTop: '40px',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color="#10b981" />
            <span>Spring Security JWT &amp; Role-Based Access</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={16} color="#f59e0b" />
            <span>4.9/5 Rating from 2,400+ Verified Travelers</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={16} color="#06b6d4" />
            <span>Small Groups (Max 12-16 per Expedition)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
