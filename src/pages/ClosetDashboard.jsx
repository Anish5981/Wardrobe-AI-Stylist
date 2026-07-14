// ============================================
// DIGITAL CLOSET DASHBOARD
// Grid view, category filters, manual upload,
// and e-receipt scanning
// ============================================

import { useState, useRef } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { scoreGarmentColor } from '../engines/colorSeasonEngine';
import { parseReceipt, getBackgroundRemovalStages } from '../engines/ingestionEngine';
import { CATEGORIES, FORMALITY_LABELS } from '../data/mockData';
import {
  Plus, Search, Filter, Camera, Mail, X, Check,
  Trash2, Tag, Sparkles, Upload, ScanLine
} from 'lucide-react';

export default function ClosetDashboard() {
  const { state, actions } = useWardrobe();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptText, setReceiptText] = useState('');
  const [parsedItem, setParsedItem] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileInputRef = useRef(null);

  // Filter items
  const filtered = state.closetItems.filter(item => {
    const categoryMatch = activeCategory === 'All' || item.category === activeCategory;
    const searchMatch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.colorName?.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  // Category counts
  const categoryCounts = { All: state.closetItems.length };
  CATEGORIES.forEach(cat => {
    categoryCounts[cat] = state.closetItems.filter(i => i.category === cat).length;
  });

  // Handle e-receipt scan
  const handleScanReceipt = () => {
    const result = parseReceipt(receiptText);
    if (result.success) {
      setParsedItem(result.item);
    }
  };

  const handleAddParsedItem = () => {
    if (parsedItem) {
      actions.addClosetItem(parsedItem);
      setParsedItem(null);
      setReceiptText('');
      setShowReceiptModal(false);
      actions.addNotification(`Added "${parsedItem.name}" from email receipt`);
    }
  };

  // Handle simulated upload
  const handleUpload = () => {
    const stages = getBackgroundRemovalStages();
    let i = 0;
    setUploadProgress(stages[0]);
    const interval = setInterval(() => {
      i++;
      if (i < stages.length) {
        setUploadProgress(stages[i]);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          const newItem = {
            id: `item_upload_${Date.now()}`,
            name: 'Uploaded Garment',
            brand: 'Personal',
            category: 'Tops',
            color: '#708090',
            colorName: 'Grey',
            seasonTags: ['Spring', 'Summer', 'Autumn'],
            formality: 3,
            weatherMin: 10,
            weatherMax: 28,
            rainResistant: false,
            image: null,
            source: 'Manual Upload',
          };
          actions.addClosetItem(newItem);
          setUploadProgress(null);
          setShowUploadModal(false);
          actions.addNotification('Garment uploaded and background removed');
        }, 600);
      }
    }, 700);
  };

  return (
    <div className="closet page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="closet-header">
          <div>
            <p className="uppercase text-xs text-muted font-semibold" style={{ marginBottom: 6 }}>Your Collection</p>
            <h1 className="font-serif" style={{ fontSize: 'var(--font-size-2xl)' }}>Digital Closet</h1>
            <p className="text-sm text-muted" style={{ marginTop: 4 }}>{state.closetItems.length} items across {CATEGORIES.length} categories</p>
          </div>
          <div className="flex gap-sm">
            <button className="btn btn-outline" onClick={() => setShowReceiptModal(true)}>
              <Mail size={14} /> Scan Receipt
            </button>
            <button className="btn btn-primary" onClick={() => setShowUploadModal(true)}>
              <Camera size={14} /> Upload
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="closet-filters">
          <div className="closet-search">
            <Search size={16} className="closet-search-icon" />
            <input
              className="closet-search-input"
              placeholder="Search items, brands, colors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="btn-icon" onClick={() => setSearchQuery('')}>
                <X size={14} />
              </button>
            )}
          </div>
          <div className="closet-categories">
            {['All', ...CATEGORIES].map(cat => (
              <button
                key={cat}
                className={`tag ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
                <span className="text-xs" style={{ opacity: 0.6 }}>
                  {categoryCounts[cat] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-auto-fill" style={{ marginTop: 24 }}>
          {filtered.map((item, idx) => {
            const colorInfo = state.user?.colorSeason
              ? scoreGarmentColor(item.color, state.user.colorSeason)
              : null;
            return (
              <div key={item.id} className={`card closet-item-card animate-fadeInUp stagger-${(idx % 5) + 1}`}>
                {/* Color Preview */}
                <div className="closet-item-preview" style={{ backgroundColor: item.color || '#E0E0E0' }}>
                  {colorInfo && (
                    <span className={`badge closet-item-harmony badge-${colorInfo.score === 1 ? 'success' : colorInfo.score === -1 ? 'danger' : 'outline'}`}>
                      {colorInfo.label}
                    </span>
                  )}
                </div>
                {/* Details */}
                <div className="closet-item-details">
                  <p className="text-xs text-muted uppercase" style={{ letterSpacing: '0.08em' }}>{item.brand}</p>
                  <h4 className="closet-item-name">{item.name}</h4>
                  <div className="closet-item-meta">
                    <span className="badge badge-outline">{item.category}</span>
                    <span className="text-xs text-light">{item.colorName}</span>
                  </div>
                  <div className="closet-item-tags">
                    {item.seasonTags?.map(s => (
                      <span key={s} className="text-xs text-light">{s}</span>
                    ))}
                    <span className="text-xs text-muted">· {FORMALITY_LABELS[item.formality]}</span>
                  </div>
                </div>
                {/* Actions */}
                <div className="closet-item-actions">
                  <span className="text-xs text-light">{item.source}</span>
                  <button
                    className="btn-icon"
                    onClick={() => actions.removeClosetItem(item.id)}
                    title="Remove"
                    style={{ color: 'var(--color-grey-light)' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-grey-light)' }}>
            <Filter size={40} strokeWidth={1} style={{ marginBottom: 16 }} />
            <p>No items match your filters</p>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="modal-overlay" onClick={() => !uploadProgress && setShowUploadModal(false)}>
            <div className="modal-content animate-scaleIn" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
                <h3 className="font-serif" style={{ fontSize: 'var(--font-size-lg)' }}>Upload Garment</h3>
                {!uploadProgress && (
                  <button className="btn-icon" onClick={() => setShowUploadModal(false)}><X size={18} /></button>
                )}
              </div>

              {!uploadProgress ? (
                <>
                  <div
                    className="closet-upload-zone"
                    onClick={() => handleUpload()}
                  >
                    <Upload size={36} strokeWidth={1} style={{ color: 'var(--color-grey-light)', marginBottom: 12 }} />
                    <p className="font-medium">Click to upload a garment photo</p>
                    <p className="text-sm text-muted">JPEG, PNG, or WebP · Max 10MB</p>
                  </div>
                  <p className="text-xs text-muted" style={{ marginTop: 12, textAlign: 'center' }}>
                    AI will automatically remove the background and catalog the item
                  </p>
                </>
              ) : (
                <div className="closet-upload-progress">
                  <ScanLine size={40} className={uploadProgress.stage !== 'complete' ? 'animate-pulse' : ''} style={{ color: uploadProgress.stage === 'complete' ? 'var(--color-success)' : 'var(--color-charcoal)', marginBottom: 20 }} />
                  <div className="closet-progress-bar">
                    <div className="closet-progress-fill" style={{ width: `${uploadProgress.progress}%` }} />
                  </div>
                  <p className="text-sm font-medium" style={{ marginTop: 12 }}>{uploadProgress.message}</p>
                  <p className="text-xs text-muted">{uploadProgress.progress}%</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Receipt Scanner Modal */}
        {showReceiptModal && (
          <div className="modal-overlay" onClick={() => setShowReceiptModal(false)}>
            <div className="modal-content animate-scaleIn" onClick={e => e.stopPropagation()} style={{ maxWidth: 640 }}>
              <div className="flex justify-between items-center" style={{ marginBottom: 24 }}>
                <h3 className="font-serif" style={{ fontSize: 'var(--font-size-lg)' }}>
                  <Mail size={18} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Scan Email Receipt
                </h3>
                <button className="btn-icon" onClick={() => setShowReceiptModal(false)}><X size={18} /></button>
              </div>

              {!parsedItem ? (
                <>
                  <p className="text-sm text-muted" style={{ marginBottom: 16 }}>
                    Paste your order confirmation email below. We'll extract the brand, category, color, and size.
                  </p>
                  <textarea
                    className="input-field"
                    placeholder={`Example:\n\nOrder Confirmation - COS\nItem: Ribbed Merino Turtleneck\nColor: Black\nSize: M\nTotal: $89.00`}
                    value={receiptText}
                    onChange={e => setReceiptText(e.target.value)}
                    style={{ width: '100%', minHeight: 160, resize: 'vertical', fontFamily: 'var(--font-sans)' }}
                  />
                  <button
                    className="btn btn-primary btn-full"
                    style={{ marginTop: 16 }}
                    onClick={handleScanReceipt}
                    disabled={receiptText.trim().length < 10}
                  >
                    <Sparkles size={14} /> Parse Receipt
                  </button>
                </>
              ) : (
                <div className="closet-parsed-result animate-fadeInUp">
                  <p className="uppercase text-xs font-semibold text-success" style={{ marginBottom: 16 }}>
                    <Check size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                    Successfully Parsed
                  </p>
                  <div className="card" style={{ marginBottom: 20 }}>
                    <div className="flex gap-md items-center">
                      <div className="color-swatch" style={{ backgroundColor: parsedItem.color, width: 48, height: 48, borderRadius: 'var(--radius-md)' }} />
                      <div>
                        <p className="text-xs text-muted uppercase">{parsedItem.brand}</p>
                        <p className="font-medium">{parsedItem.name}</p>
                        <div className="flex gap-sm" style={{ marginTop: 4 }}>
                          <span className="badge badge-outline">{parsedItem.category}</span>
                          <span className="badge badge-outline">{parsedItem.colorName}</span>
                          {parsedItem.size && <span className="badge badge-dark">{parsedItem.size}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-sm">
                    <button className="btn btn-accent btn-full" onClick={handleAddParsedItem}>
                      <Plus size={14} /> Add to Closet
                    </button>
                    <button className="btn btn-ghost" onClick={() => { setParsedItem(null); setReceiptText(''); }}>
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .closet-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 32px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .closet-filters {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .closet-search {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
          padding: 0 16px;
          border: 1.5px solid transparent;
          transition: all var(--transition-fast);
        }
        .closet-search:focus-within {
          border-color: var(--color-charcoal);
          background: var(--color-bg);
        }
        .closet-search-icon {
          color: var(--color-grey-light);
          flex-shrink: 0;
        }
        .closet-search-input {
          flex: 1;
          padding: 12px 0;
          font-size: var(--font-size-base);
        }
        .closet-categories {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .closet-item-card {
          padding: 0;
          overflow: hidden;
        }
        .closet-item-preview {
          height: 180px;
          position: relative;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          padding: 10px;
        }
        .closet-item-harmony {
          font-size: 9px;
        }
        .closet-item-details {
          padding: 16px;
        }
        .closet-item-name {
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin: 4px 0 8px;
          line-height: 1.3;
        }
        .closet-item-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .closet-item-tags {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .closet-item-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px 12px;
        }
        .closet-upload-zone {
          border: 2px dashed var(--color-grey-whisper);
          border-radius: var(--radius-lg);
          padding: 48px;
          text-align: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .closet-upload-zone:hover {
          border-color: var(--color-charcoal);
          background: var(--color-surface);
        }
        .closet-upload-progress {
          text-align: center;
          padding: 32px 0;
        }
        .closet-progress-bar {
          width: 100%;
          height: 4px;
          background: var(--color-surface);
          border-radius: var(--radius-full);
          overflow: hidden;
        }
        .closet-progress-fill {
          height: 100%;
          background: var(--color-charcoal);
          border-radius: var(--radius-full);
          transition: width 0.5s ease;
        }
        @media (max-width: 768px) {
          .closet-header { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
