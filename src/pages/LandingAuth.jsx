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
  const [customName, setCustomName] = useState('');

  const handleCustomLogin = () => {
    if (!customName.trim()) return;
    actions.login({
      id: `user_custom_${Date.now()}`,
      name: customName.trim(),
      persona: 'Custom',
      avatar: '👤',
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
          <div className="landing-hero-actions animate-fadeInUp stagger-3">
            <button className="btn btn-primary btn-lg" onClick={() => setShowLogin(true)}>
              Get Started <ArrowRight size={16} />
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
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Sun size={32} strokeWidth={1.5} style={{ marginBottom: 12 }} />
              <h2 className="font-serif" style={{ fontSize: 'var(--font-size-xl)' }}>Welcome to Wardrobe</h2>
              <p className="text-sm text-muted" style={{ marginTop: 4 }}>Enter your name to begin your style journey</p>
            </div>
            <div className="input-group" style={{ marginBottom: 24 }}>
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
