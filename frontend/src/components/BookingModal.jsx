import React, { useState, useEffect } from 'react';
import { X, Calendar, Users, Shield, Tag, CreditCard, CheckCircle, Download, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

export default function BookingModal({ pkg, onClose, onBookingSuccess, currentUser, onOpenAuth }) {
  const [step, setStep] = useState(1); // 1: details, 2: checkout, 3: voucher
  const [travelDate, setTravelDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [adultCount, setAdultCount] = useState(2);
  const [childCount, setChildCount] = useState(0);
  const [airportTransfer, setAirportTransfer] = useState(false);
  const [travelInsurance, setTravelInsurance] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');
  
  // Promo code
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardHolder, setCardHolder] = useState(currentUser?.fullName || 'Gaurav Sharma');
  
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!pkg) return null;

  const unitPrice = pkg.discountedPrice || pkg.basePrice;
  const adultSubtotal = adultCount * unitPrice;
  const childSubtotal = childCount * (unitPrice * 0.70);
  const baseSubtotal = adultSubtotal + childSubtotal;

  const addOnsTotal = (airportTransfer ? 60 : 0) + (travelInsurance ? 35 * (adultCount + childCount) : 0);
  const discountAmount = couponResult?.valid ? couponResult.discountAmount : 0;
  const finalTotal = Math.max(0, (baseSubtotal + addOnsTotal) - discountAmount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    setErrorMessage('');
    try {
      const res = await api.validateCoupon(couponCode, baseSubtotal + addOnsTotal);
      setCouponResult(res);
      if (!res.valid) {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Error validating promo code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setStep(2);
  };

  const handleProcessCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setErrorMessage('');

    try {
      // 1. Create booking in Spring Boot backend
      const booking = await api.createBooking({
        tourPackageId: pkg.id,
        travelDate: travelDate,
        adultCount: adultCount,
        childCount: childCount,
        couponCode: couponResult?.valid ? couponResult.code : null,
        specialRequests: specialRequests,
        airportTransferSelected: airportTransfer,
        insuranceSelected: travelInsurance,
      });

      // 2. Process simulated payment checkout
      await api.checkout({
        bookingReference: booking.bookingReference,
        amount: booking.totalAmount,
        paymentMethod: paymentMethod,
        cardNumber: cardNumber,
        cardExpiry: cardExpiry,
        cardCvc: cardCvc,
        cardHolderName: cardHolder,
      });

      setConfirmedBooking(booking);
      setStep(3);

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#ffffff'],
      });

      if (onBookingSuccess) onBookingSuccess(booking);
    } catch (err) {
      setErrorMessage(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#0d131f',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
              Step {step} of 3 • {step === 1 ? 'Expedition Customization' : (step === 2 ? 'Secure Checkout' : 'Digital Boarding Voucher')}
            </span>
            <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginTop: '2px' }}>
              {step === 3 ? 'Reservation Confirmed!' : `Booking: ${pkg.title}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              color: 'var(--text-secondary)',
              borderRadius: '50%',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {errorMessage && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#f43f5e',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '18px',
            }}>
              {errorMessage}
            </div>
          )}

          {/* STEP 1: Customization */}
          {step === 1 && (
            <div>
              {/* Date Selection */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Departure Date
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-glass)',
                  padding: '10px 14px',
                  borderRadius: '10px',
                }}>
                  <Calendar size={18} color="#10b981" />
                  <input
                    type="date"
                    value={travelDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setTravelDate(e.target.value)}
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

              {/* Guests Count */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  padding: '14px',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', display: 'block' }}>Adults</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Age 12+ (${unitPrice})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setAdultCount(Math.max(1, adultCount - 1))}
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '6px' }}
                      >-</button>
                      <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{adultCount}</span>
                      <button
                        type="button"
                        onClick={() => setAdultCount(adultCount + 1)}
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '6px' }}
                      >+</button>
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  padding: '14px',
                  borderRadius: '10px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', display: 'block' }}>Children</span>
                      <span style={{ fontSize: '0.75rem', color: '#10b981' }}>30% Off (${Math.round(unitPrice * 0.70)})</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setChildCount(Math.max(0, childCount - 1))}
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '6px' }}
                      >-</button>
                      <span style={{ fontWeight: 700, width: '20px', textAlign: 'center' }}>{childCount}</span>
                      <button
                        type="button"
                        onClick={() => setChildCount(childCount + 1)}
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: '28px', height: '28px', borderRadius: '6px' }}
                      >+</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add-ons */}
              <div style={{ marginBottom: '20px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '10px' }}>
                  Expedition Add-ons
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={airportTransfer}
                        onChange={(e) => setAirportTransfer(e.target.checked)}
                        style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                      />
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                          Private VIP Airport Chauffeur
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          Mercedes executive transfer directly to hotel
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>+$60</span>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <input
                        type="checkbox"
                        checked={travelInsurance}
                        onChange={(e) => setTravelInsurance(e.target.checked)}
                        style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                      />
                      <div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'block' }}>
                          Comprehensive Medical &amp; Trip Protection
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          $1,000,000 emergency coverage &amp; cancellation guarantee
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#34d399' }}>
                      +${35 * (adultCount + childCount)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Promo Coupon Bar */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Have a Promo Code? (Try: <span style={{ color: '#fbbf24', cursor: 'pointer' }} onClick={() => setCouponCode('EARLYBIRD15')}>EARLYBIRD15</span> or <span style={{ color: '#fbbf24', cursor: 'pointer' }} onClick={() => setCouponCode('WANDER2026')}>WANDER2026</span>)
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{
                      flex: 1,
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      textTransform: 'uppercase',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={validatingCoupon}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    {validatingCoupon ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {couponResult?.valid && (
                  <p style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '6px' }}>
                    ✓ {couponResult.message}
                  </p>
                )}
              </div>

              {/* Special Requests */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                  Special Requests / Dietary Needs
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vegetarian meals, high floor room, anniversary champagne..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#ffffff',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Price Calculation Card */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  <span>Base Expedition ({adultCount} Adults, {childCount} Children)</span>
                  <span>${baseSubtotal.toFixed(2)}</span>
                </div>
                {addOnsTotal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    <span>Selected Add-ons</span>
                    <span>+${addOnsTotal.toFixed(2)}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#34d399', marginBottom: '6px' }}>
                    <span>Promo Coupon Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  paddingTop: '10px',
                  marginTop: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>Total Amount</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
                    ${finalTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Checkout Simulation */}
          {step === 2 && (
            <form onSubmit={handleProcessCheckout}>
              {/* Payment Method selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {[
                  { id: 'CREDIT_CARD', label: '💳 Credit / Debit Card' },
                  { id: 'PAYPAL', label: '🅿️ PayPal Express' },
                  { id: 'UPI', label: '⚡ Instant UPI / Wire' },
                ].map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '8px',
                      background: paymentMethod === m.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: paymentMethod === m.id ? '1px solid #10b981' : '1px solid var(--border-glass)',
                      color: paymentMethod === m.id ? '#34d399' : 'var(--text-secondary)',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              {/* Card Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#ffffff',
                      fontSize: '0.9rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                    Card Number (Simulation Mode Active)
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
                    <CreditCard size={18} color="#10b981" />
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      style={{ background: 'transparent', border: 'none', color: '#ffffff', width: '100%', fontSize: '0.9rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      CVC / CVV
                    </label>
                    <input
                      type="password"
                      required
                      maxLength="4"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '8px',
                        padding: '10px 14px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Order total confirmation */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '10px',
                padding: '14px',
                marginBottom: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Charge:</span>
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', display: 'block' }}>
                    ${finalTotal.toFixed(2)} USD
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', fontSize: '0.75rem' }}>
                  <Shield size={14} color="#10b981" />
                  <span>256-bit TLS Encrypted</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="btn-primary"
                  style={{ flex: 2, justifyContent: 'center' }}
                >
                  {processing ? 'Authorizing Payment...' : `Confirm & Pay $${finalTotal.toFixed(2)}`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Digital Boarding Pass */}
          {step === 3 && confirmedBooking && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.2)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}>
                  <CheckCircle size={32} color="#10b981" />
                </div>
                <h4 style={{ fontSize: '1.3rem', color: '#ffffff' }}>Expedition Confirmed!</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  A confirmation voucher and detailed packing guide have been sent to your registered email.
                </p>
              </div>

              {/* Digital Boarding Pass Card */}
              <div style={{
                background: 'linear-gradient(135deg, #131b26 0%, #1a2332 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                position: 'relative',
                overflow: 'hidden',
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px dashed rgba(255,255,255,0.15)', paddingBottom: '16px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                      Booking Reference
                    </span>
                    <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', letterSpacing: '0.05em', display: 'block' }}>
                      {confirmedBooking.bookingReference}
                    </span>
                  </div>
                  <span className="badge badge-emerald">
                    STATUS: {confirmedBooking.status}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Expedition</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                      {confirmedBooking.tourTitle || pkg.title}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Departure Date</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                      {confirmedBooking.travelDate}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Travelers</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff', display: 'block' }}>
                      {confirmedBooking.adultCount} Adults {confirmedBooking.childCount > 0 ? `, ${confirmedBooking.childCount} Children` : ''}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>Paid Amount</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#10b981', display: 'block' }}>
                      ${confirmedBooking.totalAmount?.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Simulated Barcode */}
                <div style={{
                  background: 'rgba(255,255,255,0.06)',
                  padding: '12px',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ fontFamily: 'monospace', fontSize: '0.75rem', letterSpacing: '3px', color: '#94a3b8' }}>
                    ||| | |||| | ||| || |||||| | ||| || ||||
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                    VIP Expeditions Pass
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <Download size={16} />
                  <span>Print Voucher</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer for Step 1 */}
        {step === 1 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-glass)',
            background: 'rgba(9, 13, 22, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Total with Add-ons</span>
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10b981', display: 'block' }}>
                ${finalTotal.toFixed(2)} USD
              </span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={onClose} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Cancel
              </button>
              <button
                onClick={handleProceedToPayment}
                className="btn-primary"
                style={{ padding: '8px 20px', fontSize: '0.85rem' }}
              >
                <span>Proceed to Payment</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
