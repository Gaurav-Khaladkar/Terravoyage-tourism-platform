import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import PackageCard from './components/PackageCard';
import DestinationExplorer from './components/DestinationExplorer';
import TourModal from './components/TourModal';
import BookingModal from './components/BookingModal';
import MyBookingsModal from './components/MyBookingsModal';
import AdminDashboardModal from './components/AdminDashboardModal';
import AICopilotModal from './components/AICopilotModal';
import AuthModal from './components/AuthModal';
import { api, getUser, removeToken } from './api';
import { ShieldCheck, Compass, HeartHandshake, Award, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(() => getUser());

  // Search Filters
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [maxPrice, setMaxPrice] = useState(4000);

  // Modals
  const [selectedTour, setSelectedTour] = useState(null);
  const [bookingTour, setBookingTour] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showMyBookings, setShowMyBookings] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showAI, setShowAI] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const data = await api.getPackages({
        keyword: searchKeyword,
        category: selectedCategory,
        difficulty: selectedDifficulty,
        maxPrice: maxPrice,
      });
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [selectedCategory, selectedDifficulty, maxPrice]);

  const handleLogout = () => {
    removeToken();
    setCurrentUser(null);
    showToast('Signed out successfully.');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          background: 'rgba(16, 185, 129, 0.95)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 600,
          fontSize: '0.9rem',
          backdropFilter: 'blur(8px)',
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar */}
      <Navbar
        currentUser={currentUser}
        onOpenAuth={() => setShowAuth(true)}
        onOpenMyBookings={() => setShowMyBookings(true)}
        onOpenAdmin={() => setShowAdmin(true)}
        onOpenAI={() => setShowAI(true)}
        onLogout={handleLogout}
      />

      {/* Hero with Search Bar */}
      <HeroSection
        searchKeyword={searchKeyword}
        setSearchKeyword={setSearchKeyword}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        onTriggerSearch={fetchPackages}
      />

      {/* Tour Packages Section */}
      <section style={{ padding: '60px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-emerald" style={{ marginBottom: '10px' }}>
              Handcrafted Itineraries
            </span>
            <h2 style={{ fontSize: '2.2rem', color: '#ffffff' }}>
              Featured Expeditions &amp; Treks
            </h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <span>Showing <strong style={{ color: '#ffffff' }}>{packages.length}</strong> available packages</span>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--text-secondary)' }}>
            Loading handcrafted tour packages...
          </div>
        ) : packages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px' }} className="glass-panel">
            <Compass size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
            <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>No matching expeditions found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Try broadening your budget slider or clearing specific filters.
            </p>
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedCategory('ALL');
                setSelectedDifficulty('ALL');
                setMaxPrice(4000);
              }}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '28px',
          }}>
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onSelectPackage={(p) => setSelectedTour(p)}
                onBookNow={(p) => setBookingTour(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Destinations Explorer */}
      <DestinationExplorer
        onSelectDestination={(dest) => {
          setSearchKeyword(dest.country);
          fetchPackages();
          window.scrollTo({ top: 380, behavior: 'smooth' });
        }}
      />

      {/* Enterprise Pillars Banner */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(180deg, #090d16 0%, #0e1522 100%)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <span className="badge badge-gold" style={{ marginBottom: '12px' }}>
            Built for High-Trust Global Travel
          </span>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '40px', color: '#ffffff' }}>
            Why World Travelers Choose TerraVoyage
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            textAlign: 'left',
          }}>
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <ShieldCheck size={26} color="#10b981" />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '10px' }}>
                Bank-Grade Security &amp; JWT
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Full Spring Security 6 integration with stateless JWT authentication, RBAC authorization, and end-to-end data encryption.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Sparkles size={26} color="#06b6d4" />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '10px' }}>
                AI Trip Copilot
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Machine learning-assisted itinerary generation, smart packing recommendations, and real-time seasonal dynamic pricing predictions.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                <Award size={26} color="#f59e0b" />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '10px' }}>
                Zero-Deposit Reservation
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Reserve slots instantly with dynamic promo coupon codes (`EARLYBIRD15`, `WANDER2026`) and instant automated ticket vouchers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        background: '#070a10',
        padding: '60px 24px 30px',
        borderTop: '1px solid var(--border-glass)',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '40px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px' }}>
            <div style={{ maxWidth: '380px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Compass size={24} color="#10b981" />
                <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                  Terra<span style={{ color: '#10b981' }}>Voyage</span>
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Enterprise Online Tourism &amp; Luxury Expedition Booking Platform. Designed with Java Spring Boot, React, and Python AI microservices.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
              <div>
                <h5 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '0.95rem' }}>Top Expeditions</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li>Swiss Alpine Express</li>
                  <li>Bali Sanctuary &amp; Temples</li>
                  <li>Kyoto Sakura Odyssey</li>
                  <li>Serengeti Great Migration</li>
                  <li>Amalfi Private Catamaran</li>
                </ul>
              </div>

              <div>
                <h5 style={{ color: '#ffffff', marginBottom: '14px', fontSize: '0.95rem' }}>Architecture</h5>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <li>Spring Boot 3.2.3 (Java 17)</li>
                  <li>Spring Security &amp; JJWT</li>
                  <li>Spring Data JPA &amp; H2/MySQL</li>
                  <li>OpenAPI Swagger UI 3.0</li>
                  <li>React 19 + Vite 6 + Lucide</li>
                  <li>Python FastAPI AI Service</li>
                </ul>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: 'var(--text-tertiary)',
          }}>
            <span>© 2026 TerraVoyage Global Expeditions Ltd. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '16px' }}>
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>OpenAPI Specification (/swagger-ui.html)</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedTour && (
        <TourModal
          pkg={selectedTour}
          currentUser={currentUser}
          onClose={() => setSelectedTour(null)}
          onBookNow={(p) => setBookingTour(p)}
        />
      )}

      {bookingTour && (
        <BookingModal
          pkg={bookingTour}
          currentUser={currentUser}
          onClose={() => setBookingTour(null)}
          onOpenAuth={() => setShowAuth(true)}
          onBookingSuccess={(b) => {
            showToast(`Booking ${b.bookingReference} confirmed successfully!`);
          }}
        />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onAuthSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome, ${user.fullName}!`);
          }}
        />
      )}

      {showMyBookings && (
        <MyBookingsModal
          onClose={() => setShowMyBookings(false)}
          onSelectBookingVoucher={(b) => {
            setShowMyBookings(false);
            setBookingTour(b);
          }}
        />
      )}

      {showAdmin && (
        <AdminDashboardModal
          onClose={() => setShowAdmin(false)}
        />
      )}

      {showAI && (
        <AICopilotModal
          onClose={() => setShowAI(false)}
          onSelectPackage={(p) => {
            setSelectedTour(p);
          }}
        />
      )}
    </div>
  );
}
