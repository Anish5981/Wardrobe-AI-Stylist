// ============================================
// LANDING / AUTH PAGE
// Vogue-inspired editorial intro with demo login
// ============================================

import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { DEMO_USERS } from '../data/mockData';
import {
  Sparkles, ArrowRight, Shirt, Compass, ShoppingBag,
  Sun, Layers, Zap
} from 'lucide-react';

export default function LandingAuth() {
  const { actions } = useWardrobe();
  const [showLogin, setShowLogin] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  const handleCustomLogin = () => {
    if (!customName.trim()) return;
    actions.login({
      id: `user_custom_${Date.now()}`,
      name: customName.trim(),
      persona: 'Custom',
      avatar: '👤',
    });
  };

  const handleGoogleLogin = (accData) => {
    setShowGoogleModal(false);
    setShowLogin(false);
    actions.loginWithGoogle({
      email: accData.email,
      name: accData.name || accData.email.split('@')[0],
      avatar: accData.avatar || '🇬',
      googleId: `google_${Date.now()}`,
    });
  };

  const features = [
    { icon: Shirt, title: 'Digital Closet', desc: 'Your entire wardrobe, organized and AI-analyzed' },
    { icon: Sparkles, title: 'AI Outfit Engine', desc: 'Weather-aware daily styling at your fingertips' },
    { icon: Compass, title: 'Travel Planner', desc: 'Smart packing checklists for any destination' },
    { icon: ShoppingBag, title: 'Smart Shopping', desc: 'Curated recommendations to fill wardrobe gaps' },
    { icon: Layers, title: 'Color Science', desc: 'Season-based palette mapping for your complexion' },
    { icon: Zap, title: 'Gap Finder', desc: 'Detects missing essentials before you travel' },
  ];

  return (
    <div className="landing">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero-inner container">
          <div className="landing-hero-badge animate-fadeIn">
            <Sparkles size={12} />
            <span>AI-Powered Personal Styling</span>
          </div>
          <h1 className="landing-hero-title font-serif animate-fadeInUp">
            Your Wardrobe,<br />
            <span className="landing-hero-italic">Reimagined</span>
          </h1>
          <p className="landing-hero-sub animate-fadeInUp stagger-2">
            An intelligent stylist that knows your body, your closet, your climate,
            and your calendar — crafting perfect outfits for every moment.
          </p>
          <div className="landing-hero-actions animate-fadeInUp stagger-3" style={{ flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={() => setShowLogin(true)}>
              Get Started <ArrowRight size={16} />
            </button>
            <button
              className="btn btn-lg"
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FFFFFF', color: '#1F1F1F', border: '1px solid #DADCE0', borderRadius: 'var(--radius-md)', padding: '12px 20px', fontWeight: 500 }}
              onClick={() => setShowGoogleModal(true)}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>
            <button className="btn btn-ghost btn-lg" onClick={() => actions.loginAsDemo('elena')}>
              Try Demo
            </button>
          </div>
        </div>
        <div className="landing-hero-gradient" />
      </section>

      {/* Features Grid */}
      <section className="landing-features container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <p className="uppercase text-sm text-muted" style={{ marginBottom: 8 }}>Capabilities</p>
          <h2 className="font-serif">Designed for the Intentional Dresser</h2>
        </div>
        <div className="grid grid-3" style={{ marginTop: 40 }}>
          {features.map((f, i) => (
            <div key={i} className={`card landing-feature-card animate-fadeInUp stagger-${i % 5 + 1}`}>
              <div className="landing-feature-icon">
                <f.icon size={22} strokeWidth={1.5} />
              </div>
              <h3 className="landing-feature-title">{f.title}</h3>
              <p className="landing-feature-desc text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demo Personas */}
      <section className="landing-demos container">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <p className="uppercase text-sm text-muted" style={{ marginBottom: 8 }}>Quick Start</p>
          <h2 className="font-serif">Explore a Pre-Built Wardrobe</h2>
        </div>
        <div className="grid grid-2" style={{ maxWidth: 700, margin: '40px auto 0' }}>
          {Object.entries(DEMO_USERS).map(([key, user]) => (
            <button
              key={key}
              className="card landing-demo-card"
              onClick={() => actions.loginAsDemo(key)}
            >
              <span className="landing-demo-avatar">{user.avatar}</span>
              <div>
                <h4 className="landing-demo-name">{user.name}</h4>
                <p className="text-sm text-muted">{user.persona} · {user.colorSeason}</p>
              </div>
              <ArrowRight size={16} className="text-light" style={{ marginLeft: 'auto' }} />
            </button>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-overlay" onClick={() => setShowLogin(false)}>
          <div className="modal-content animate-scaleIn" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Sun size={32} strokeWidth={1.5} style={{ marginBottom: 12 }} />
              <h2 className="font-serif" style={{ fontSize: 'var(--font-size-xl)' }}>Welcome to Wardrobe</h2>
              <p className="text-sm text-muted" style={{ marginTop: 4 }}>Begin your style journey or sign up in one click</p>
            </div>
            
            <button
              className="btn btn-full"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, background: '#FFFFFF', color: '#1F1F1F', border: '1px solid #DADCE0', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontWeight: 500, fontSize: 'var(--font-size-sm)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'all 0.2s ease', marginBottom: 24 }}
              onClick={() => { setShowLogin(false); setShowGoogleModal(true); }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              Continue with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0 24px', color: 'var(--color-grey-light)' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--color-surface-elevated)' }} />
              <span style={{ fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or enter your name</span>
              <div style={{ flex: 1, height: 1, background: 'var(--color-surface-elevated)' }} />
            </div>

            <div className="input-group" style={{ marginBottom: 20 }}>
              <label className="input-label">Your Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="e.g. Alexandra"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleCustomLogin()}
                autoFocus
              />
            </div>
            <button className="btn btn-primary btn-full" onClick={handleCustomLogin}>
              Continue <ArrowRight size={14} />
            </button>
            <div style={{ textAlign: 'center', margin: '20px 0', color: 'var(--color-grey-light)', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              or try a demo account
            </div>
            <div className="flex flex-col gap-sm">
              {Object.entries(DEMO_USERS).map(([key, user]) => (
                <button key={key} className="btn btn-outline btn-full" onClick={() => actions.loginAsDemo(key)}>
                  {user.avatar} {user.name} — {user.persona}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Google Sign-in Interactive Modal */}
      {showGoogleModal && (
        <div className="modal-overlay" onClick={() => setShowGoogleModal(false)}>
          <div className="modal-content animate-scaleIn" style={{ maxWidth: 440, padding: 36, textAlign: 'left', background: '#FFFFFF', color: '#202124', borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <svg width="36" height="36" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: 14 }}>
                <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
                <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
              </svg>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#202124', marginBottom: 6 }}>Choose an account</h3>
              <p style={{ fontSize: '0.875rem', color: '#5F6368', margin: 0 }}>to continue to <strong>Wardrobe AI Stylist</strong></p>
            </div>

            <div className="flex flex-col gap-sm" style={{ marginBottom: 24 }}>
              {[
                { name: 'Alexandra Vogue', email: 'alexandra.vogue@gmail.com', avatar: '👩🏼‍💼' },
                { name: 'Marcus Sterling', email: 'marcus.sterling@gmail.com', avatar: '🧔🏻‍♂️' },
                { name: 'Chloe Chen', email: 'chloe.style@gmail.com', avatar: '👩🏻‍🦰' }
              ].map((acc, idx) => (
                <div
                  key={idx}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', border: '1px solid #DADCE0', borderRadius: 8, cursor: 'pointer', transition: 'background 0.2s', background: '#FFFFFF' }}
                  onClick={() => handleGoogleLogin(acc)}
                  onMouseEnter={e => e.currentTarget.style.background = '#F8F9FA'}
                  onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
                >
                  <span style={{ fontSize: 26 }}>{acc.avatar}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: '0.9375rem', color: '#202124' }}>{acc.name}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#5F6368' }}>{acc.email}</div>
                  </div>
                  <ArrowRight size={14} color="#5F6368" />
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid #E8EAED', paddingTop: 20 }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#5F6368', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Or use your Google account</p>
              <div style={{ marginBottom: 12 }}>
                <input
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #DADCE0', fontSize: '0.9375rem', color: '#202124', outline: 'none' }}
                  type="email"
                  placeholder="Email address (e.g. name@gmail.com)"
                  value={customGoogleEmail}
                  onChange={e => setCustomGoogleEmail(e.target.value)}
                />
              </div>
              {customGoogleEmail && (
                <div style={{ marginBottom: 16 }} className="animate-fadeIn">
                  <input
                    style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: '1px solid #DADCE0', fontSize: '0.9375rem', color: '#202124', outline: 'none' }}
                    type="text"
                    placeholder="Full Name (optional)"
                    value={customGoogleName}
                    onChange={e => setCustomGoogleName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && customGoogleEmail.trim() && handleGoogleLogin({ email: customGoogleEmail, name: customGoogleName || customGoogleEmail.split('@')[0], avatar: '🇬' })}
                  />
                </div>
              )}
              <button
                style={{ width: '100%', padding: '12px 20px', borderRadius: 8, background: customGoogleEmail.trim() ? '#1A73E8' : '#F1F3F4', color: customGoogleEmail.trim() ? '#FFFFFF' : '#9AA0A6', border: 'none', fontWeight: 600, fontSize: '0.9375rem', cursor: customGoogleEmail.trim() ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                onClick={() => customGoogleEmail.trim() && handleGoogleLogin({ email: customGoogleEmail, name: customGoogleName || customGoogleEmail.split('@')[0], avatar: '🇬' })}
                disabled={!customGoogleEmail.trim()}
              >
                Continue as {customGoogleEmail || 'Google User'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .landing {
          min-height: 100vh;
        }
        .landing-hero {
          position: relative;
          min-height: 85vh;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: linear-gradient(160deg, #FAFAFA 0%, #F0F0F0 50%, #E8E4DF 100%);
        }
        .landing-hero-inner {
          position: relative;
          z-index: 2;
          max-width: 720px;
        }
        .landing-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: rgba(197,160,89,0.12);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
          margin-bottom: 24px;
        }
        .landing-hero-title {
          font-size: var(--font-size-hero);
          font-weight: 500;
          line-height: var(--line-height-tight);
          letter-spacing: var(--letter-spacing-tight);
          color: var(--color-charcoal);
          margin-bottom: 20px;
        }
        .landing-hero-italic {
          font-style: italic;
          color: var(--color-accent);
        }
        .landing-hero-sub {
          font-size: var(--font-size-md);
          color: var(--color-grey-mid);
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 36px;
        }
        .landing-hero-actions {
          display: flex;
          gap: var(--space-md);
          align-items: center;
        }
        .landing-hero-gradient {
          position: absolute;
          top: -30%;
          right: -10%;
          width: 60%;
          height: 160%;
          background: radial-gradient(circle, rgba(197,160,89,0.06) 0%, transparent 70%);
          z-index: 1;
        }
        .landing-features {
          padding: 100px 0;
        }
        .landing-feature-card {
          text-align: center;
          padding: 40px 28px;
        }
        .landing-feature-icon {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-lg);
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: var(--color-charcoal);
        }
        .landing-feature-title {
          font-size: var(--font-size-md);
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--color-charcoal);
        }
        .landing-feature-desc {
          font-size: var(--font-size-sm);
          line-height: 1.6;
        }
        .landing-demos {
          padding: 0 0 100px;
        }
        .landing-demo-card {
          display: flex;
          align-items: center;
          gap: 16px;
          text-align: left;
          cursor: pointer;
        }
        .landing-demo-avatar {
          font-size: 32px;
        }
        .landing-demo-name {
          font-weight: 600;
          margin-bottom: 2px;
        }
      `}</style>
    </div>
  );
}
