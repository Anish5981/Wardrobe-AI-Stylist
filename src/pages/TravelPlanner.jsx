// ============================================
// TRAVEL PACK PLANNER
// Trip configuration, climate retrieval,
// dynamic checklist, and Gap Finder
// ============================================

import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { generateTravelChecklist, getClimateForDestination } from '../engines/travelGapEngine';
import { TRIP_TYPES, CLIMATE_DATA } from '../data/mockData';
import {
  Compass, MapPin, Calendar, Plane, Mountain, Palmtree,
  Briefcase, Snowflake as SnowIcon, Footprints, Check,
  AlertTriangle, ShoppingBag, Plus, X, ChevronRight,
  ThermometerSun, Droplets, Wind, Shirt, Package, FileText, Trash2
} from 'lucide-react';

const TRIP_ICONS = {
  'Trekking / Hiking': Mountain,
  'Beach Vacation': Palmtree,
  'Business Conference': Briefcase,
  'Ski Trip': SnowIcon,
  'City Exploration': Footprints,
};

export default function TravelPlanner() {
  const { state, actions } = useWardrobe();
  const [showNewTrip, setShowNewTrip] = useState(false);
  const [form, setForm] = useState({
    destination: '',
    tripType: 'City Exploration',
    startDate: '',
    endDate: '',
  });
  const [activeTrip, setActiveTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('outfits');

  const updateForm = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleCreateTrip = () => {
    if (!form.destination || !form.startDate || !form.endDate) return;

    const checklist = generateTravelChecklist({
      destination: form.destination,
      tripType: form.tripType,
      startDate: form.startDate,
      endDate: form.endDate,
      closetItems: state.closetItems,
    });

    actions.addTrip(checklist);
    setActiveTrip(checklist);
    setShowNewTrip(false);
    setForm({ destination: '', tripType: 'City Exploration', startDate: '', endDate: '' });

    // Auto-add gaps to shopping list
    if (checklist.gaps.length > 0) {
      checklist.gaps.forEach(gap => {
        actions.addShoppingItem({
          id: `shop_gap_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: gap.item,
          brand: gap.suggestedBrand,
          category: 'Outerwear',
          color: '#4A4A4A',
          colorName: 'Grey',
          price: gap.estimatedPrice,
          reason: gap.reason,
          affiliateUrl: '#',
          store: gap.suggestedBrand + ' Official',
          gapType: 'travel',
        });
      });
      actions.addNotification(`${checklist.gaps.length} missing items added to your Shopping List`);
    }
  };

  const climatePreview = form.destination ? getClimateForDestination(form.destination) : null;

  const TABS = [
    { key: 'outfits', label: 'Wardrobe Outfits', icon: Shirt },
    { key: 'gear', label: 'Activity Gear', icon: Package },
    { key: 'essentials', label: 'Essentials', icon: FileText },
  ];

  return (
    <div className="travel page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="travel-header">
          <div>
            <p className="uppercase text-xs text-muted font-semibold" style={{ marginBottom: 6 }}>Travel Intelligence</p>
            <h1 className="font-serif" style={{ fontSize: 'var(--font-size-2xl)' }}>Pack Planner</h1>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>
              AI-powered packing checklists with wardrobe integration and gap detection
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowNewTrip(true)}>
            <Plus size={14} /> Plan New Trip
          </button>
        </div>

        {/* Trip List */}
        {state.trips.length > 0 && !activeTrip && (
          <div className="grid grid-3" style={{ marginTop: 24 }}>
            {state.trips.map(trip => {
              const TripIcon = TRIP_ICONS[trip.tripType] || Compass;
              return (
                <div key={trip.id} className="card travel-trip-card" onClick={() => setActiveTrip(trip)}>
                  <div className="flex items-center gap-md" style={{ marginBottom: 12 }}>
                    <div className="travel-trip-icon">
                      <TripIcon size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-medium">{trip.destination}</h3>
                      <p className="text-xs text-muted">{trip.tripType}</p>
                    </div>
                  </div>
                  <div className="flex gap-sm flex-wrap" style={{ marginBottom: 12 }}>
                    <span className="badge badge-outline">
                      <ThermometerSun size={10} /> {trip.climate?.avgTemp}°C
                    </span>
                    <span className="badge badge-outline">
                      {trip.numDays} days
                    </span>
                    {trip.gaps?.length > 0 && (
                      <span className="badge badge-warning">
                        <AlertTriangle size={10} /> {trip.gaps.length} gaps
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-light">{trip.startDate} → {trip.endDate}</p>
                    <ChevronRight size={16} className="text-light" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Trip Detail */}
        {activeTrip && (
          <div className="travel-detail animate-fadeInUp">
            {/* Trip Header */}
            <div className="flex justify-between items-start" style={{ marginBottom: 28 }}>
              <div>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTrip(null)} style={{ marginBottom: 8 }}>
                  ← All Trips
                </button>
                <h2 className="font-serif" style={{ fontSize: 'var(--font-size-xl)' }}>
                  <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  {activeTrip.destination}
                </h2>
                <p className="text-sm text-muted">{activeTrip.tripType} · {activeTrip.numDays} days · {activeTrip.startDate} → {activeTrip.endDate}</p>
              </div>
              <button className="btn-icon" onClick={() => { actions.removeTrip(activeTrip.id); setActiveTrip(null); }} style={{ color: 'var(--color-grey-light)' }}>
                <Trash2 size={16} />
              </button>
            </div>

            {/* Climate Card */}
            <div className="card travel-climate-card" style={{ marginBottom: 28 }}>
              <div className="flex gap-xl flex-wrap">
                <div className="flex items-center gap-sm">
                  <ThermometerSun size={18} className="text-accent" />
                  <div>
                    <p className="font-medium">{activeTrip.climate?.avgTemp}°C</p>
                    <p className="text-xs text-muted">{activeTrip.climate?.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <Droplets size={18} className="text-accent" />
                  <div>
                    <p className="font-medium">{activeTrip.climate?.precipitation}</p>
                    <p className="text-xs text-muted">Precipitation</p>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <Wind size={18} className="text-accent" />
                  <div>
                    <p className="font-medium">{activeTrip.climate?.windSpeed} km/h</p>
                    <p className="text-xs text-muted">Wind Speed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Gap Warnings */}
            {activeTrip.gaps?.length > 0 && (
              <div className="travel-gaps" style={{ marginBottom: 28 }}>
                <p className="uppercase text-xs font-semibold text-warning" style={{ marginBottom: 12 }}>
                  <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                  Gap Finder: {activeTrip.gaps.length} Missing Items
                </p>
                <div className="flex flex-col gap-sm">
                  {activeTrip.gaps.map((gap, i) => (
                    <div key={i} className={`card travel-gap-item ${gap.severity === 'critical' ? 'critical' : ''}`}>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{gap.item}</p>
                          <p className="text-xs text-muted">{gap.reason}</p>
                        </div>
                        <div className="flex items-center gap-sm">
                          <span className={`badge ${gap.severity === 'critical' ? 'badge-danger' : 'badge-warning'}`}>
                            {gap.severity}
                          </span>
                          <span className="text-xs text-muted">{gap.estimatedPrice}</span>
                          <ShoppingBag size={14} className="text-accent" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="tabs" style={{ marginBottom: 24 }}>
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  className={`tab ${activeTab === key ? 'active' : ''}`}
                  onClick={() => setActiveTab(key)}
                >
                  <Icon size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  {label}
                </button>
              ))}
            </div>

            {/* Tab Content: Wardrobe Outfits */}
            {activeTab === 'outfits' && (
              <div className="flex flex-col gap-md">
                {activeTrip.wardrobeOutfits?.map((outfit, idx) => (
                  <div key={idx} className="card" style={{ padding: 16 }}>
                    <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
                      <p className="font-medium text-sm">{outfit.label}</p>
                      <span className="text-xs text-muted">{outfit.pieces.length} pieces</span>
                    </div>
                    <div className="flex gap-sm flex-wrap">
                      {outfit.pieces.map((piece, i) => (
                        <div key={i} className="flex items-center gap-sm" style={{ padding: '6px 12px', background: 'var(--color-surface)', borderRadius: 'var(--radius-md)' }}>
                          <div style={{ width: 20, height: 20, borderRadius: 4, backgroundColor: piece.color, flexShrink: 0 }} />
                          <div>
                            <p className="text-xs font-medium">{piece.name}</p>
                            <p style={{ fontSize: 10, color: 'var(--color-grey-light)' }}>{piece.brand}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {(!activeTrip.wardrobeOutfits || activeTrip.wardrobeOutfits.length === 0) && (
                  <p className="text-sm text-muted" style={{ textAlign: 'center', padding: 40 }}>
                    Not enough items in your closet to generate trip outfits
                  </p>
                )}
              </div>
            )}

            {/* Tab Content: Activity Gear */}
            {activeTab === 'gear' && (
              <div className="flex flex-col gap-xs">
                {activeTrip.activityGear?.map((item, idx) => (
                  <div
                    key={idx}
                    className={`checklist-item ${item.checked ? 'checked' : ''}`}
                    onClick={() => actions.toggleChecklistItem(activeTrip.id, 'activityGear', idx)}
                  >
                    <div className={`checklist-checkbox ${item.checked ? 'checked' : ''}`}>
                      {item.checked && <Check size={12} />}
                    </div>
                    <span className="checklist-label text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab Content: Essentials */}
            {activeTab === 'essentials' && (
              <div className="flex flex-col gap-xs">
                {activeTrip.essentials?.map((item, idx) => (
                  <div
                    key={idx}
                    className={`checklist-item ${item.checked ? 'checked' : ''}`}
                    onClick={() => actions.toggleChecklistItem(activeTrip.id, 'essentials', idx)}
                  >
                    <div className={`checklist-checkbox ${item.checked ? 'checked' : ''}`}>
                      {item.checked && <Check size={12} />}
                    </div>
                    <span className="checklist-label text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {state.trips.length === 0 && !showNewTrip && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <Plane size={48} strokeWidth={1} style={{ color: 'var(--color-grey-light)', marginBottom: 16 }} />
            <h3 className="font-serif" style={{ color: 'var(--color-grey-mid)', marginBottom: 6 }}>No Trips Planned</h3>
            <p className="text-sm text-muted" style={{ marginBottom: 24 }}>Plan your first trip to get AI-powered packing checklists</p>
            <button className="btn btn-primary" onClick={() => setShowNewTrip(true)}>
              <Plus size={14} /> Plan Your First Trip
            </button>
          </div>
        )}

        {/* New Trip Modal */}
        {showNewTrip && (
          <div className="modal-overlay" onClick={() => setShowNewTrip(false)}>
            <div className="modal-content animate-scaleIn" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
                <h3 className="font-serif" style={{ fontSize: 'var(--font-size-lg)' }}>
                  <Compass size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Plan New Trip
                </h3>
                <button className="btn-icon" onClick={() => setShowNewTrip(false)}><X size={18} /></button>
              </div>

              {/* Destination */}
              <div className="input-group" style={{ marginBottom: 20 }}>
                <label className="input-label">Destination</label>
                <input
                  className="input-field"
                  placeholder="e.g. Swiss Alps, Bali, Tokyo..."
                  value={form.destination}
                  onChange={e => updateForm('destination', e.target.value)}
                />
                {climatePreview && (
                  <div className="travel-climate-hint animate-fadeIn">
                    <ThermometerSun size={14} className="text-accent" />
                    <span className="text-xs">
                      {climatePreview.avgTemp}°C · {climatePreview.condition} · {climatePreview.precipitation}
                    </span>
                  </div>
                )}
              </div>

              {/* Trip Type */}
              <div className="input-group" style={{ marginBottom: 20 }}>
                <label className="input-label">Trip Type</label>
                <div className="flex gap-sm flex-wrap" style={{ marginTop: 6 }}>
                  {Object.keys(TRIP_TYPES).map(type => {
                    const TripIcon = TRIP_ICONS[type] || Compass;
                    return (
                      <button
                        key={type}
                        className={`tag ${form.tripType === type ? 'active' : ''}`}
                        onClick={() => updateForm('tripType', type)}
                        style={{ padding: '10px 16px' }}
                      >
                        <TripIcon size={14} /> {type}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dates */}
              <div className="flex gap-md" style={{ marginBottom: 28 }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Start Date</label>
                  <input
                    className="input-field"
                    type="date"
                    value={form.startDate}
                    onChange={e => updateForm('startDate', e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">End Date</label>
                  <input
                    className="input-field"
                    type="date"
                    value={form.endDate}
                    onChange={e => updateForm('endDate', e.target.value)}
                  />
                </div>
              </div>

              <button
                className="btn btn-accent btn-full btn-lg"
                onClick={handleCreateTrip}
                disabled={!form.destination || !form.startDate || !form.endDate}
              >
                <Sparkles size={16} /> Generate Packing Checklist
              </button>

              {/* Quick Destinations */}
              <div style={{ marginTop: 20 }}>
                <p className="text-xs text-muted uppercase" style={{ marginBottom: 8 }}>Popular Destinations</p>
                <div className="flex gap-xs flex-wrap">
                  {Object.keys(CLIMATE_DATA).map(dest => (
                    <button
                      key={dest}
                      className="tag"
                      onClick={() => updateForm('destination', dest.split('–')[0].trim())}
                      style={{ fontSize: '10px', padding: '4px 10px' }}
                    >
                      <MapPin size={10} /> {dest.split('–')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .travel-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .travel-trip-card {
          cursor: pointer;
        }
        .travel-trip-icon {
          width: 44px;
          height: 44px;
          border-radius: var(--radius-md);
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-charcoal);
          flex-shrink: 0;
        }
        .travel-climate-card {
          background: linear-gradient(135deg, var(--color-surface) 0%, var(--color-bg-alt) 100%);
          padding: 24px;
        }
        .travel-gap-item {
          padding: 14px;
        }
        .travel-gap-item.critical {
          border-left: 3px solid var(--color-danger);
        }
        .travel-climate-hint {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
          padding: 8px 12px;
          background: var(--color-accent-soft);
          border-radius: var(--radius-sm);
        }
        .travel .btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
