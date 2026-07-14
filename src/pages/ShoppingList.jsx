// ============================================
// SMART SHOPPING LIST
// Curated recommendations with affiliate
// tracking for daily gaps and travel gaps
// ============================================

import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import {
  ShoppingBag, ExternalLink, X, Sparkles, Tag,
  Compass, Shirt, Filter, AlertTriangle, ArrowRight
} from 'lucide-react';

export default function ShoppingList() {
  const { state, actions } = useWardrobe();
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = state.shoppingList.filter(item => {
    if (activeFilter === 'all') return true;
    return item.gapType === activeFilter;
  });

  const travelGaps = state.shoppingList.filter(i => i.gapType === 'travel').length;
  const dailyGaps = state.shoppingList.filter(i => i.gapType === 'daily').length;

  return (
    <div className="shopping page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="shopping-header">
          <div>
            <p className="uppercase text-xs text-muted font-semibold" style={{ marginBottom: 6 }}>Smart Recommendations</p>
            <h1 className="font-serif" style={{ fontSize: 'var(--font-size-2xl)' }}>Shopping List</h1>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>
              Curated items to fill wardrobe gaps with partner affiliate links
            </p>
          </div>
          <div className="flex gap-sm flex-wrap">
            <span className="badge badge-accent">
              <Sparkles size={10} /> {state.shoppingList.length} recommendations
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="shopping-filters" style={{ marginBottom: 28 }}>
          <button
            className={`tag ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All ({state.shoppingList.length})
          </button>
          <button
            className={`tag ${activeFilter === 'travel' ? 'active' : ''}`}
            onClick={() => setActiveFilter('travel')}
          >
            <Compass size={12} />
            Travel Gaps ({travelGaps})
          </button>
          <button
            className={`tag ${activeFilter === 'daily' ? 'active' : ''}`}
            onClick={() => setActiveFilter('daily')}
          >
            <Shirt size={12} />
            Daily Styling ({dailyGaps})
          </button>
        </div>

        {/* Shopping Grid */}
        <div className="grid grid-3">
          {filtered.map((item, idx) => (
            <div key={item.id} className={`card shopping-item-card animate-fadeInUp stagger-${(idx % 5) + 1}`}>
              {/* Color Strip */}
              <div className="shopping-item-color" style={{ backgroundColor: item.color || '#E0E0E0' }}>
                <span className={`badge ${item.gapType === 'travel' ? 'badge-warning' : 'badge-accent'}`}>
                  {item.gapType === 'travel' ? (
                    <><AlertTriangle size={9} /> Travel Gap</>
                  ) : (
                    <><Sparkles size={9} /> Style Gap</>
                  )}
                </span>
              </div>

              {/* Item Details */}
              <div className="shopping-item-body">
                <p className="text-xs text-muted uppercase" style={{ letterSpacing: '0.08em', marginBottom: 2 }}>{item.brand}</p>
                <h3 className="shopping-item-name">{item.name}</h3>
                <div className="flex items-center gap-sm" style={{ marginBottom: 10 }}>
                  <span className="badge badge-outline">{item.category || 'Outerwear'}</span>
                  <span className="text-xs text-light">{item.colorName}</span>
                </div>

                {/* Reason */}
                <div className="shopping-item-reason">
                  <Sparkles size={11} className="text-accent" style={{ flexShrink: 0, marginTop: 2 }} />
                  <p className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                    {item.reason}
                  </p>
                </div>

                {/* Price & Store */}
                <div className="shopping-item-footer">
                  <div>
                    <p className="shopping-item-price font-serif">{item.price}</p>
                    <p className="text-xs text-light">{item.store}</p>
                  </div>
                  <div className="flex gap-xs">
                    <a
                      href={item.affiliateUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm shopping-affiliate-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        actions.addNotification(`Affiliate redirect: ${item.store} — ${item.name}`);
                      }}
                    >
                      Shop <ExternalLink size={11} />
                    </a>
                    <button
                      className="btn-icon"
                      onClick={() => actions.removeShoppingItem(item.id)}
                      style={{ color: 'var(--color-grey-light)' }}
                      title="Remove"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <ShoppingBag size={48} strokeWidth={1} style={{ color: 'var(--color-grey-light)', marginBottom: 16 }} />
            <h3 className="font-serif" style={{ color: 'var(--color-grey-mid)', marginBottom: 6 }}>No Recommendations</h3>
            <p className="text-sm text-muted">
              {activeFilter === 'travel'
                ? 'Plan a trip to discover travel-specific gear gaps'
                : activeFilter === 'daily'
                  ? 'Your daily wardrobe looks complete!'
                  : 'Your wardrobe is well-stocked. Plan a trip or generate outfits to find gaps.'}
            </p>
          </div>
        )}

        {/* Affiliate Disclaimer */}
        {state.shoppingList.length > 0 && (
          <div className="shopping-disclaimer">
            <Tag size={12} />
            <p className="text-xs text-light">
              Affiliate links: Wardrobe may earn a commission on qualifying purchases. Prices are estimated and may vary by retailer.
            </p>
          </div>
        )}
      </div>

      <style>{`
        .shopping-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .shopping-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .shopping-item-card {
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        .shopping-item-color {
          height: 120px;
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 12px;
        }
        .shopping-item-body {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .shopping-item-name {
          font-size: var(--font-size-base);
          font-weight: 600;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .shopping-item-reason {
          display: flex;
          gap: 8px;
          padding: 10px 12px;
          background: var(--color-accent-soft);
          border-radius: var(--radius-sm);
          margin-bottom: 16px;
        }
        .shopping-item-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-subtle);
        }
        .shopping-item-price {
          font-size: var(--font-size-lg);
          font-weight: 500;
          color: var(--color-charcoal);
        }
        .shopping-affiliate-btn {
          padding: 6px 16px;
        }
        .shopping-disclaimer {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 48px;
          padding: 16px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          color: var(--color-grey-light);
        }
      `}</style>
    </div>
  );
}
