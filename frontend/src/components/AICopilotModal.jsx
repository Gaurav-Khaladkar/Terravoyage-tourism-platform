import React, { useState } from 'react';
import { X, Sparkles, Compass, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../api';

export default function AICopilotModal({ onClose, onSelectPackage }) {
  const [style, setStyle] = useState('LUXURY');
  const [budget, setBudget] = useState(3000);
  const [companion, setCompanion] = useState('COUPLE');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.getAIRecommendation({
        travelStyle: style,
        maxBudget: budget,
        companionType: companion,
      });
      setResult(data);
    } catch (err) {
      console.error(err);
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
          maxWidth: '740px',
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
          background: 'radial-gradient(ellipse at top left, rgba(16, 185, 129, 0.15), transparent 70%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #10b981, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Sparkles size={20} color="#ffffff" />
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                AI Tourism Copilot Engine
              </span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff' }}>Intelligent Expedition Architect</h3>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {!result ? (
            <form onSubmit={handleGenerate}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                Tell our AI Copilot what kind of voyage you desire. We will calculate optimal routes, acclimatization pace, and personalized packing insights.
              </p>

              {/* Style pills */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Travel Style
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '8px' }}>
                  {[
                    { id: 'LUXURY', label: '✨ Luxury & Scenic' },
                    { id: 'ADVENTURE', label: '⛰️ Alpine Trekking' },
                    { id: 'CULTURAL', label: '🏯 Cultural Heritage' },
                    { id: 'SAFARI', label: '🦁 Wildlife Safari' },
                    { id: 'BEACH_WELLNESS', label: '🏝️ Beach & Wellness' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setStyle(s.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: style === s.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: style === s.id ? '1px solid #10b981' : '1px solid var(--border-glass)',
                        color: style === s.id ? '#34d399' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Companion */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Traveling With
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  {['SOLO', 'COUPLE', 'FAMILY', 'FRIENDS'].map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() => setCompanion(c)}
                      style={{
                        padding: '10px',
                        borderRadius: '8px',
                        background: companion === c ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                        border: companion === c ? '1px solid #06b6d4' : '1px solid var(--border-glass)',
                        color: companion === c ? '#22d3ee' : 'var(--text-secondary)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Budget slider */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                    Maximum Total Budget
                  </label>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>
                    ${budget} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="6000"
                  step="250"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#10b981' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <Sparkles size={18} />
                <span>{loading ? 'Synthesizing Expedition Plan...' : 'Generate AI Expedition Recommendation'}</span>
              </button>
            </form>
          ) : (
            <div>
              <div style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '18px',
                borderRadius: '12px',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Sparkles size={18} color="#10b981" />
                  <span style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem' }}>
                    AI Copilot Recommendation
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#fbbf24', fontWeight: 600 }}>
                    Confidence: {result.confidenceScore}%
                  </span>
                </div>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {result.summary}
                </p>
              </div>

              {/* Recommended tours list */}
              <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '12px' }}>
                Curated Matching Expeditions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {result.recommendedPackages?.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      onClose();
                      onSelectPackage(p);
                    }}
                  >
                    <div>
                      <h5 style={{ color: '#ffffff', fontSize: '0.95rem', marginBottom: '2px' }}>{p.title}</h5>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {p.destinationName}, {p.destinationCountry} • {p.durationDays} Days • ${p.discountedPrice || p.basePrice}
                      </span>
                    </div>
                    <ArrowRight size={18} color="#10b981" />
                  </div>
                ))}
              </div>

              {/* AI Packing advice */}
              {result.aiPackingTips && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '16px',
                  marginBottom: '20px',
                }}>
                  <h5 style={{ color: '#ffffff', fontSize: '0.9rem', marginBottom: '10px' }}>
                    🎒 AI Smart Packing Recommendations
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.aiPackingTips.map((tip, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        <CheckCircle2 size={14} color="#06b6d4" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setResult(null)}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Plan Another Trip
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
