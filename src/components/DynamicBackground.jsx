// ============================================
// DYNAMIC TIME & WEATHER BACKGROUND
// Ambient editorial canvas reflecting time
// of day and weather with interactive widget
// ============================================

import { useState, useEffect } from 'react';
import { Sun, Moon, CloudRain, Snowflake, Cloud, Flame, Sparkles, Wind } from 'lucide-react';

const TIME_PRESETS = {
  morning: {
    label: 'Morning Light',
    icon: Sun,
    gradient: 'radial-gradient(circle at 80% 20%, rgba(255, 235, 200, 0.45) 0%, rgba(250, 250, 250, 0) 60%), linear-gradient(135deg, #FCFCFD 0%, #F5F7FA 100%)',
    accentColor: '#DDA15E',
  },
  day: {
    label: 'Crisp Day',
    icon: Sun,
    gradient: 'radial-gradient(circle at 50% 0%, rgba(235, 245, 255, 0.5) 0%, rgba(255, 255, 255, 0) 70%), linear-gradient(180deg, #FFFFFF 0%, #F3F4F6 100%)',
    accentColor: '#3B82F6',
  },
  golden: {
    label: 'Golden Hour',
    icon: Flame,
    gradient: 'radial-gradient(circle at 90% 40%, rgba(246, 177, 122, 0.35) 0%, rgba(212, 160, 23, 0.08) 45%, rgba(255, 255, 255, 0) 80%), linear-gradient(135deg, #FFFDFB 0%, #F8F5F1 100%)',
    accentColor: '#C5A059',
  },
  night: {
    label: 'Midnight Editorial',
    icon: Moon,
    gradient: 'radial-gradient(circle at 20% 20%, rgba(60, 65, 80, 0.15) 0%, rgba(20, 22, 28, 0) 60%), linear-gradient(135deg, #18191C 0%, #0D0E11 100%)',
    accentColor: '#8A99AD',
    dark: true,
  },
};

const WEATHER_PRESETS = {
  clear: { label: 'Clear & Calm', icon: Sparkles },
  rainy: { label: 'Soft Rain Mist', icon: CloudRain },
  snowy: { label: 'Nordic Snow', icon: Snowflake },
  cloudy: { label: 'Silver Overcast', icon: Cloud },
};

export default function DynamicBackground() {
  // Determine real time on initial load
  const getInitialTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'morning';
    if (hour >= 11 && hour < 17) return 'day';
    if (hour >= 17 && hour < 20) return 'golden';
    return 'night';
  };

  const [timeMode, setTimeMode] = useState(getInitialTime);
  const [weatherMode, setWeatherMode] = useState('clear');
  const [showControls, setShowControls] = useState(false);

  // Apply high-contrast tokens to root when atmosphere changes
  useEffect(() => {
    const root = document.documentElement;
    if (TIME_PRESETS[timeMode]?.dark) {
      root.style.setProperty('--color-bg', '#111216');
      root.style.setProperty('--color-bg-alt', '#16181D');
      root.style.setProperty('--color-surface', '#1E2027');
      root.style.setProperty('--color-surface-elevated', '#272A33');
      root.style.setProperty('--color-charcoal', '#FFFFFF');
      root.style.setProperty('--color-charcoal-soft', '#EBEBEB');
      root.style.setProperty('--color-grey-dark', '#DFE2E8');
      root.style.setProperty('--color-grey-mid', '#B4BCCA');
      root.style.setProperty('--color-grey-light', '#949EAD');
      root.style.setProperty('--color-border', '#2C303B');
      root.style.setProperty('--color-border-subtle', '#23262F');
      root.style.setProperty('--glass-bg', 'rgba(18, 20, 26, 0.93)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.15)');
    } else {
      // Revert to high-contrast light mode tokens
      root.style.setProperty('--color-bg', '#FFFFFF');
      root.style.setProperty('--color-bg-alt', '#FAFAFA');
      root.style.setProperty('--color-surface', '#F4F5F7');
      root.style.setProperty('--color-surface-elevated', '#EAECEF');
      root.style.setProperty('--color-charcoal', '#0A0A0A');
      root.style.setProperty('--color-charcoal-soft', '#222222');
      root.style.setProperty('--color-grey-dark', '#333333');
      root.style.setProperty('--color-grey-mid', '#555555');
      root.style.setProperty('--color-grey-light', '#6A6A6A');
      root.style.setProperty('--color-border', '#E2E4E8');
      root.style.setProperty('--color-border-subtle', '#ECEEEF');
      root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.93)');
      root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.65)');
    }
  }, [timeMode]);

  const activeTime = TIME_PRESETS[timeMode] || TIME_PRESETS.day;
  const TimeIcon = activeTime.icon;
  const WeatherIcon = WEATHER_PRESETS[weatherMode]?.icon || Sparkles;

  return (
    <>
      {/* Fixed Ambient Background Canvas */}
      <div 
        className="dynamic-bg-canvas"
        style={{ background: activeTime.gradient }}
      >
        {/* Soft Ambient Orbs */}
        <div className="ambient-orb orb-1" />
        <div className="ambient-orb orb-2" />

        {/* Weather Effect Overlay: Rain */}
        {weatherMode === 'rainy' && (
          <div className="weather-effect-rain">
            {Array.from({ length: 30 }).map((_, i) => (
              <div 
                key={i} 
                className="raindrop" 
                style={{
                  left: `${(i * 3.3) + Math.sin(i) * 2}%`,
                  animationDelay: `${(i % 5) * 0.4}s`,
                  animationDuration: `${1.2 + (i % 3) * 0.3}s`,
                  opacity: 0.25 + (i % 3) * 0.15,
                }} 
              />
            ))}
          </div>
        )}

        {/* Weather Effect Overlay: Snow */}
        {weatherMode === 'snowy' && (
          <div className="weather-effect-snow">
            {Array.from({ length: 25 }).map((_, i) => (
              <div 
                key={i} 
                className="snowflake-particle" 
                style={{
                  left: `${(i * 4) + Math.cos(i) * 3}%`,
                  animationDelay: `${(i % 6) * 0.7}s`,
                  animationDuration: `${6 + (i % 4) * 2}s`,
                  width: `${3 + (i % 3) * 2}px`,
                  height: `${3 + (i % 3) * 2}px`,
                }} 
              />
            ))}
          </div>
        )}

        {/* Weather Effect Overlay: Clouds */}
        {weatherMode === 'cloudy' && (
          <div className="weather-effect-clouds">
            <div className="cloud-layer cloud-layer-1" />
            <div className="cloud-layer cloud-layer-2" />
          </div>
        )}
      </div>

      {/* Floating Atmosphere Controller Widget (Bottom-Right) */}
      <div className="atmosphere-widget-container">
        {showControls ? (
          <div className="atmosphere-panel card-glass animate-scaleIn">
            <div className="flex justify-between items-center" style={{ marginBottom: 12 }}>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-xs">
                <Sparkles size={11} className="text-accent" /> Atmosphere Engine
              </span>
              <button 
                className="btn-icon btn-sm" 
                onClick={() => setShowControls(false)}
                style={{ width: 22, height: 22, fontSize: 11 }}
              >
                ✕
              </button>
            </div>

            {/* Time Selector */}
            <p className="text-xs font-medium" style={{ marginBottom: 6 }}>Time of Day Effect</p>
            <div className="flex gap-xs" style={{ marginBottom: 14 }}>
              {Object.entries(TIME_PRESETS).map(([key, item]) => {
                const Icon = item.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setTimeMode(key)}
                    className={`atmosphere-chip ${timeMode === key ? 'active' : ''}`}
                    title={item.label}
                  >
                    <Icon size={12} />
                    <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                  </button>
                );
              })}
            </div>

            {/* Weather Selector */}
            <p className="text-xs font-medium" style={{ marginBottom: 6 }}>Weather Effect</p>
            <div className="flex gap-xs flex-wrap">
              {Object.entries(WEATHER_PRESETS).map(([key, item]) => {
                const Icon = item.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setWeatherMode(key)}
                    className={`atmosphere-chip ${weatherMode === key ? 'active' : ''}`}
                  >
                    <Icon size={12} />
                    <span>{item.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            className="atmosphere-toggle card-glass"
            onClick={() => setShowControls(true)}
            title="Configure Time & Weather Atmosphere"
          >
            <TimeIcon size={14} className="text-accent animate-pulse" />
            <span className="text-xs font-medium">{activeTime.label} · {WEATHER_PRESETS[weatherMode]?.label}</span>
            <WeatherIcon size={13} style={{ opacity: 0.7 }} />
          </button>
        )}
      </div>

      <style>{`
        .dynamic-bg-canvas {
          position: fixed;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          transition: background 1.2s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
        }
        .ambient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: floatOrb 20s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 50vw;
          height: 50vw;
          top: -10vw;
          right: -10vw;
          background: radial-gradient(circle, var(--color-accent-soft) 0%, transparent 70%);
        }
        .orb-2 {
          width: 40vw;
          height: 40vw;
          bottom: -15vw;
          left: -5vw;
          background: radial-gradient(circle, rgba(140, 160, 190, 0.15) 0%, transparent 70%);
          animation-delay: -10s;
        }
        @keyframes floatOrb {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 40px) scale(1.08); }
          100% { transform: translate(20px, -20px) scale(0.95); }
        }

        /* Rain Animation */
        .weather-effect-rain {
          position: absolute;
          inset: 0;
        }
        .raindrop {
          position: absolute;
          top: -20px;
          width: 1px;
          height: 45px;
          background: linear-gradient(180deg, transparent, rgba(160, 180, 210, 0.6));
          animation: dropFall linear infinite;
        }
        @keyframes dropFall {
          0% { transform: translateY(-20px); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(105vh); opacity: 0; }
        }

        /* Snow Animation */
        .weather-effect-snow {
          position: absolute;
          inset: 0;
        }
        .snowflake-particle {
          position: absolute;
          top: -10px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(255, 255, 255, 0.8);
          animation: snowFall linear infinite;
        }
        @keyframes snowFall {
          0% { transform: translateY(-10px) translateX(0); opacity: 0; }
          15% { opacity: 0.9; }
          50% { transform: translateY(50vh) translateX(15px); }
          100% { transform: translateY(105vh) translateX(-10px); opacity: 0.1; }
        }

        /* Clouds Animation */
        .weather-effect-clouds {
          position: absolute;
          inset: 0;
        }
        .cloud-layer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 60vh;
          background: radial-gradient(ellipse at 50% 0%, rgba(180, 190, 205, 0.18) 0%, transparent 70%);
          animation: cloudDrift 25s ease-in-out infinite alternate;
        }
        .cloud-layer-2 {
          top: 10vh;
          background: radial-gradient(ellipse at 70% 10%, rgba(150, 160, 175, 0.12) 0%, transparent 65%);
          animation: cloudDrift 35s ease-in-out infinite alternate-reverse;
        }
        @keyframes cloudDrift {
          0% { transform: translateX(-4%); }
          100% { transform: translateX(4%); }
        }

        /* Widget Container */
        .atmosphere-widget-container {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 100;
        }
        .atmosphere-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          transition: all var(--transition-normal);
        }
        .atmosphere-toggle:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-xl);
          border-color: var(--color-accent);
        }
        .atmosphere-panel {
          width: 290px;
          padding: 16px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          box-shadow: var(--shadow-xl);
        }
        .atmosphere-chip {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 6px 4px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--color-border-subtle);
          background: var(--color-surface);
          font-size: 10px;
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--color-grey-dark);
        }
        .atmosphere-chip:hover {
          background: var(--color-surface-elevated);
        }
        .atmosphere-chip.active {
          background: var(--color-charcoal);
          color: var(--color-bg);
          border-color: var(--color-charcoal);
        }
      `}</style>
    </>
  );
}
