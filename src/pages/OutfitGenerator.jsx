// ============================================
// OUTFIT GENERATOR
// Daily styling tool: weather + occasion
// driven AI ensemble formulation
// ============================================

import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { generateOutfit, getLayeringAdvice } from '../engines/outfitEngine';
import { OCCASIONS, WEATHER_CONDITIONS, FORMALITY_LABELS } from '../data/mockData';
import {
  Sparkles, RefreshCw, Bookmark, ThermometerSun,
  CloudRain, Snowflake, Sun, Wind, Cloud, Flame, Layers,
  ArrowRight, Check
} from 'lucide-react';

const WEATHER_ICONS = {
  'Sunny': Sun,
  'Cloudy': Cloud,
  'Rainy': CloudRain,
  'Snowy': Snowflake,
  'Windy': Wind,
  'Hot & Humid': Flame,
  'Mild': ThermometerSun,
};

const CITIES = [
  { name: 'New York', temp: 14, weather: 'Mild' },
  { name: 'London', temp: 11, weather: 'Rainy' },
  { name: 'Tokyo', temp: 18, weather: 'Mild' },
  { name: 'Paris', temp: 15, weather: 'Cloudy' },
  { name: 'Dubai', temp: 36, weather: 'Sunny' },
  { name: 'Sydney', temp: 22, weather: 'Sunny' },
  { name: 'Oslo', temp: 2, weather: 'Snowy' },
  { name: 'Mumbai', temp: 32, weather: 'Hot & Humid' },
];

export default function OutfitGenerator() {
  const { state, actions } = useWardrobe();
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [selectedOccasion, setSelectedOccasion] = useState('Smart Casual');
  const [generatedOutfit, setGeneratedOutfit] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setSaved(false);
    setTimeout(() => {
      const result = generateOutfit(state.closetItems, {
        weather: selectedCity.weather,
        occasion: selectedOccasion,
        colorSeason: state.user?.colorSeason,
        temperature: selectedCity.temp,
      });
      setGeneratedOutfit(result);
      setIsGenerating(false);
    }, 800);
  };

  const handleSave = () => {
    if (generatedOutfit?.success) {
      actions.saveOutfit({
        ...generatedOutfit,
        city: selectedCity.name,
      });
      setSaved(true);
      actions.addNotification(`Outfit saved to Lookbook for ${selectedOccasion} in ${selectedCity.name}`);
    }
  };

  const layeringAdvice = getLayeringAdvice(selectedCity.temp, selectedCity.weather);
  const WeatherIcon = WEATHER_ICONS[selectedCity.weather] || ThermometerSun;

  return (
    <div className="outfits page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <p className="uppercase text-xs text-muted font-semibold" style={{ marginBottom: 6 }}>Daily Styling</p>
          <h1 className="font-serif" style={{ fontSize: 'var(--font-size-2xl)' }}>Outfit Generator</h1>
          <p className="text-sm text-muted" style={{ marginTop: 4 }}>AI-powered ensemble formulation based on weather, occasion, and your palette</p>
        </div>

        <div className="outfits-layout">
          {/* Controls Panel */}
          <div className="outfits-controls">
            {/* City / Weather */}
            <div className="card" style={{ padding: 20 }}>
              <p className="uppercase text-xs font-semibold text-muted" style={{ marginBottom: 14 }}>
                <ThermometerSun size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Location & Weather
              </p>
              <div className="outfits-cities">
                {CITIES.map(city => (
                  <button
                    key={city.name}
                    className={`outfits-city-chip ${selectedCity.name === city.name ? 'active' : ''}`}
                    onClick={() => setSelectedCity(city)}
                  >
                    <span className="outfits-city-name">{city.name}</span>
                    <span className="outfits-city-temp">{city.temp}°C</span>
                  </button>
                ))}
              </div>
              <div className="outfits-weather-display">
                <WeatherIcon size={28} strokeWidth={1.5} />
                <div>
                  <p className="font-medium">{selectedCity.temp}°C · {selectedCity.weather}</p>
                  <p className="text-xs text-muted">{layeringAdvice.icon} {layeringAdvice.advice}</p>
                </div>
              </div>
            </div>

            {/* Occasion */}
            <div className="card" style={{ padding: 20 }}>
              <p className="uppercase text-xs font-semibold text-muted" style={{ marginBottom: 14 }}>
                <Sparkles size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Occasion
              </p>
              <div className="outfits-occasions">
                {OCCASIONS.map(occ => (
                  <button
                    key={occ}
                    className={`tag ${selectedOccasion === occ ? 'active' : ''}`}
                    onClick={() => setSelectedOccasion(occ)}
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              className={`btn btn-primary btn-full btn-lg ${isGenerating ? 'animate-pulse' : ''}`}
              onClick={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={16} className="spin-icon" /> Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Generate Outfit
                </>
              )}
            </button>
          </div>

          {/* Result Panel */}
          <div className="outfits-result">
            {!generatedOutfit && !isGenerating && (
              <div className="outfits-empty card-flat" style={{ textAlign: 'center', padding: 60 }}>
                <Layers size={48} strokeWidth={1} style={{ color: 'var(--color-grey-light)', marginBottom: 16 }} />
                <h3 className="font-serif" style={{ color: 'var(--color-grey-mid)', marginBottom: 6 }}>Select & Generate</h3>
                <p className="text-sm text-muted">Choose your city and occasion, then let the AI formulate your look</p>
              </div>
            )}

            {isGenerating && (
              <div className="outfits-loading card-flat" style={{ textAlign: 'center', padding: 60 }}>
                <Sparkles size={48} strokeWidth={1} className="animate-pulse" style={{ color: 'var(--color-accent)', marginBottom: 16 }} />
                <h3 className="font-serif">Formulating your look...</h3>
                <p className="text-sm text-muted">Analyzing weather, occasion, and your palette</p>
              </div>
            )}

            {generatedOutfit?.success && !isGenerating && (
              <div className="outfits-result-content animate-fadeInUp">
                {/* Ensemble Header */}
                <div className="flex justify-between items-start" style={{ marginBottom: 24 }}>
                  <div>
                    <p className="uppercase text-xs font-semibold text-accent">
                      <Sparkles size={10} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      AI-Generated Ensemble
                    </p>
                    <h2 className="font-serif" style={{ fontSize: 'var(--font-size-xl)', marginTop: 4 }}>
                      {selectedOccasion} in {selectedCity.name}
                    </h2>
                    <p className="text-sm text-muted">{selectedCity.temp}°C · {selectedCity.weather}</p>
                  </div>
                  <div className="flex gap-sm">
                    <button className="btn btn-outline btn-sm" onClick={handleGenerate}>
                      <RefreshCw size={12} /> Regenerate
                    </button>
                    <button
                      className={`btn btn-sm ${saved ? 'btn-accent' : 'btn-primary'}`}
                      onClick={handleSave}
                      disabled={saved}
                    >
                      {saved ? <><Check size={12} /> Saved</> : <><Bookmark size={12} /> Save to Lookbook</>}
                    </button>
                  </div>
                </div>

                {/* Ensemble Pieces */}
                <div className="outfits-pieces">
                  {Object.entries(generatedOutfit.ensemble).map(([slot, item]) => (
                    <div key={slot} className="card outfits-piece">
                      <div className="outfits-piece-color" style={{ backgroundColor: item.color }} />
                      <div className="outfits-piece-info">
                        <p className="text-xs text-muted uppercase" style={{ letterSpacing: '0.06em' }}>
                          {slot === 'top' ? 'Top' : slot === 'bottom' ? 'Bottom' : slot === 'outerwear' ? 'Outerwear' : slot === 'footwear' ? 'Footwear' : slot === 'accessory' ? 'Accessory' : slot === 'dress' ? 'Dress' : slot}
                        </p>
                        <p className="font-medium" style={{ fontSize: 'var(--font-size-sm)' }}>{item.name}</p>
                        <p className="text-xs text-light">{item.brand} · {item.colorName}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Editorial Commentary */}
                <div className="card-flat outfits-commentary" style={{ marginTop: 20 }}>
                  <p className="uppercase text-xs font-semibold text-muted" style={{ marginBottom: 8 }}>
                    Styling Notes
                  </p>
                  <p className="text-sm" style={{ lineHeight: 1.7, fontStyle: 'italic', color: 'var(--color-grey-dark)' }}>
                    "{generatedOutfit.commentary}"
                  </p>
                </div>
              </div>
            )}

            {generatedOutfit && !generatedOutfit.success && !isGenerating && (
              <div className="card-flat" style={{ textAlign: 'center', padding: 40 }}>
                <p className="text-muted">{generatedOutfit.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Saved Lookbook */}
        {state.savedOutfits.length > 0 && (
          <div style={{ marginTop: 64 }}>
            <div className="section-header">
              <h2 className="font-serif">Lookbook</h2>
              <p className="text-sm text-muted">{state.savedOutfits.length} saved outfits</p>
            </div>
            <div className="grid grid-3">
              {state.savedOutfits.map((outfit, idx) => (
                <div key={outfit.id} className="card" style={{ padding: 20 }}>
                  <div className="flex justify-between items-start" style={{ marginBottom: 12 }}>
                    <div>
                      <p className="font-medium text-sm">{outfit.occasion}</p>
                      <p className="text-xs text-muted">{outfit.city} · {outfit.temperature}°C</p>
                    </div>
                    <button className="btn-icon" onClick={() => actions.removeOutfit(outfit.id)} style={{ color: 'var(--color-grey-light)' }}>
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex gap-xs" style={{ flexWrap: 'wrap' }}>
                    {Object.values(outfit.ensemble).map((item, i) => (
                      <div
                        key={i}
                        className="color-swatch"
                        style={{ backgroundColor: item.color, width: 28, height: 28 }}
                        title={`${item.name} (${item.brand})`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .outfits-layout {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: var(--space-xl);
          align-items: start;
        }
        .outfits-controls {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          position: sticky;
          top: calc(var(--navbar-height) + 24px);
        }
        .outfits-cities {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 16px;
        }
        .outfits-city-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          background: var(--color-surface);
          font-size: var(--font-size-xs);
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }
        .outfits-city-chip:hover {
          background: var(--color-surface-elevated);
        }
        .outfits-city-chip.active {
          background: var(--color-charcoal);
          color: white;
        }
        .outfits-city-name { font-weight: 500; }
        .outfits-city-temp { opacity: 0.6; }
        .outfits-weather-display {
          display: flex;
          gap: 14px;
          align-items: center;
          padding: 14px;
          background: var(--color-surface);
          border-radius: var(--radius-md);
        }
        .outfits-occasions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .outfits-pieces {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .outfits-piece {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 14px;
        }
        .outfits-piece-color {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          flex-shrink: 0;
          box-shadow: var(--shadow-sm);
        }
        .outfits-piece-info { flex: 1; }
        .outfits-commentary {
          padding: 20px;
          border-left: 3px solid var(--color-accent);
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @media (max-width: 900px) {
          .outfits-layout {
            grid-template-columns: 1fr;
          }
          .outfits-controls {
            position: static;
          }
        }
      `}</style>
    </div>
  );
}
