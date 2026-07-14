// ============================================
// NAVBAR — Editorial Navigation Header
// ============================================

import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import {
  Shirt, ShoppingBag, Compass, Sparkles, UserCircle,
  Menu, X, LogOut, MapPin, Sun
} from 'lucide-react';

const NAV_ITEMS = [
  { key: 'closet', label: 'Closet', icon: Shirt },
  { key: 'outfits', label: 'Outfits', icon: Sparkles },
  { key: 'travel', label: 'Travel', icon: Compass },
  { key: 'shopping', label: 'Shop', icon: ShoppingBag },
];

export default function Navbar() {
  const { state, actions } = useWardrobe();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!state.isAuthenticated) return null;

  const gapCount = state.shoppingList?.filter(i => i.gapType === 'travel').length || 0;

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <button className="navbar-logo" onClick={() => actions.setPage('closet')}>
          <Sun size={20} strokeWidth={1.5} />
          <span className="navbar-logo-text font-serif">Wardrobe</span>
        </button>

        {/* Desktop Navigation */}
        <div className="navbar-links hide-mobile">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`navbar-link ${state.currentPage === key ? 'active' : ''}`}
              onClick={() => actions.setPage(key)}
            >
              <Icon size={16} strokeWidth={1.5} />
              <span>{label}</span>
              {key === 'shopping' && gapCount > 0 && (
                <span className="navbar-badge">{gapCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* User & Controls */}
        <div className="navbar-actions">
          {state.user && (
            <button className="navbar-user" onClick={() => actions.setPage('onboarding')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {typeof state.user.avatar === 'string' && (state.user.avatar.startsWith('http://') || state.user.avatar.startsWith('https://')) ? (
                <img
                  src={state.user.avatar}
                  alt={state.user.name || 'User'}
                  style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--color-border)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              ) : (
                <span className="navbar-avatar">{state.user.avatar || '👤'}</span>
              )}
              <span className="navbar-username hide-mobile">{state.user.name?.split(' ')[0] || 'Stylist'}</span>
            </button>
          )}
          <button className="btn-icon navbar-logout hide-mobile" onClick={actions.logout} title="Sign Out">
            <LogOut size={16} strokeWidth={1.5} />
          </button>

          {/* Mobile Hamburger */}
          <button className="btn-icon navbar-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="navbar-mobile-drawer animate-fadeIn">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`navbar-mobile-link ${state.currentPage === key ? 'active' : ''}`}
              onClick={() => { actions.setPage(key); setMobileOpen(false); }}
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{label}</span>
            </button>
          ))}
          <div className="navbar-mobile-divider" />
          <button
            className="navbar-mobile-link"
            onClick={() => { actions.setPage('onboarding'); setMobileOpen(false); }}
          >
            <UserCircle size={18} strokeWidth={1.5} />
            <span>Profile</span>
          </button>
          <button className="navbar-mobile-link text-danger" onClick={() => { actions.logout(); setMobileOpen(false); }}>
            <LogOut size={18} strokeWidth={1.5} />
            <span>Sign Out</span>
          </button>
        </div>
      )}

      <style>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--navbar-height);
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--color-border);
          z-index: 100;
        }
        .navbar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
        }
        .navbar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--color-charcoal);
        }
        .navbar-logo-text {
          font-size: var(--font-size-lg);
          font-weight: 600;
          letter-spacing: var(--letter-spacing-tight);
        }
        .navbar-links {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .navbar-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-grey-mid);
          text-transform: uppercase;
          letter-spacing: var(--letter-spacing-wide);
          transition: all var(--transition-fast);
          position: relative;
        }
        .navbar-link:hover {
          color: var(--color-charcoal);
          background: var(--color-surface);
        }
        .navbar-link.active {
          color: var(--color-charcoal);
          background: var(--color-surface);
        }
        .navbar-badge {
          position: absolute;
          top: 2px;
          right: 4px;
          min-width: 16px;
          height: 16px;
          border-radius: var(--radius-full);
          background: var(--color-accent);
          color: white;
          font-size: 10px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
        }
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }
        .navbar-user {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }
        .navbar-user:hover {
          background: var(--color-surface);
        }
        .navbar-avatar {
          font-size: 20px;
        }
        .navbar-username {
          font-size: var(--font-size-sm);
          font-weight: 500;
          color: var(--color-charcoal);
        }
        .navbar-logout {
          color: var(--color-grey-mid);
        }
        .navbar-logout:hover {
          color: var(--color-danger);
        }
        .navbar-hamburger {
          display: none;
        }
        .navbar-mobile-drawer {
          position: fixed;
          top: var(--navbar-height);
          left: 0;
          right: 0;
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
          padding: var(--space-md);
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .navbar-mobile-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          font-size: var(--font-size-base);
          font-weight: 500;
          color: var(--color-grey-dark);
          transition: all var(--transition-fast);
        }
        .navbar-mobile-link:hover,
        .navbar-mobile-link.active {
          background: var(--color-surface);
          color: var(--color-charcoal);
        }
        .navbar-mobile-divider {
          height: 1px;
          background: var(--color-border);
          margin: var(--space-sm) 0;
        }
        @media (max-width: 768px) {
          .navbar-hamburger { display: flex; }
        }
      `}</style>
    </nav>
  );
}
