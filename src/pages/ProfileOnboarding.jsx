// ============================================
// PROFILE ONBOARDING
// Multi-step form: body metrics, skin tone,
// and automatic Color Season assignment
// ============================================

import { useState } from 'react';
import { useWardrobe } from '../context/WardrobeContext';
import { determineColorSeason, getSeasonPalette } from '../engines/colorSeasonEngine';
import { SKIN_TONES, UNDERTONES, BODY_TYPES, GENDERS } from '../data/mockData';
import { ArrowRight, ArrowLeft, Check, Palette, User, Ruler } from 'lucide-react';

const STEPS = ['Identity', 'Body', 'Complexion', 'Your Season'];

export default function ProfileOnboarding() {
  const { state, actions } = useWardrobe();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    gender: state.user?.gender || '',
    bodyType: state.user?.bodyType || '',
    height: state.user?.height || '',
    weight: state.user?.weight || '',
    skinTone: state.user?.skinTone || '',
    undertone: state.user?.undertone || '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const computedSeason = determineColorSeason(form.skinTone, form.undertone);
  const palette = getSeasonPalette(computedSeason);

  const canProceed = () => {
    if (step === 0) return form.gender;
    if (step === 1) return form.bodyType && form.height;
    if (step === 2) return form.skinTone && form.undertone;
    return true;
  };

  const handleComplete = () => {
    actions.completeOnboarding({
      ...form,
      colorSeason: computedSeason,
    });
  };

  return (
    <div className="onboarding page-wrapper">
      <div className="container-narrow">
        {/* Header */}
        <div className="onboarding-header animate-fadeIn">
          <p className="uppercase text-sm text-muted" style={{ marginBottom: 8 }}>Style Profile</p>
          <h1 className="font-serif" style={{ fontSize: 'var(--font-size-2xl)' }}>Let's Build Your Profile</h1>
          <p className="text-muted" style={{ marginTop: 4 }}>This helps us recommend colors, fits, and outfits tailored to you.</p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator" style={{ margin: '32px 0' }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none', gap: 8 }}>
              <div
                className={`step-dot ${i === step ? 'active' : ''} ${i < step ? 'completed' : ''}`}
                onClick={() => i <= step && setStep(i)}
                style={{ cursor: i <= step ? 'pointer' : 'default' }}
              />
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
        <p className="text-sm font-medium" style={{ marginBottom: 32, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-grey-mid)' }}>
          Step {step + 1}: {STEPS[step]}
        </p>

        {/* Step Content */}
        <div className="onboarding-step animate-fadeInUp" key={step}>
          {step === 0 && (
            <div>
              <h3 className="font-serif" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 24 }}>
                <User size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                How do you identify?
              </h3>
              <div className="onboarding-options">
                {GENDERS.map(g => (
                  <button
                    key={g}
                    className={`tag ${form.gender === g ? 'active' : ''}`}
                    onClick={() => update('gender', g)}
                    style={{ padding: '12px 24px', fontSize: 'var(--font-size-sm)' }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-serif" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 24 }}>
                <Ruler size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Body & Measurements
              </h3>
              <p className="text-sm text-muted" style={{ marginBottom: 20 }}>Select your body type</p>
              <div className="onboarding-options" style={{ marginBottom: 28 }}>
                {BODY_TYPES.map(bt => (
                  <button
                    key={bt}
                    className={`tag ${form.bodyType === bt ? 'active' : ''}`}
                    onClick={() => update('bodyType', bt)}
                    style={{ padding: '10px 20px', fontSize: 'var(--font-size-sm)' }}
                  >
                    {bt}
                  </button>
                ))}
              </div>
              <div className="flex gap-lg">
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Height</label>
                  <input
                    className="input-field"
                    placeholder={"e.g. 5'8\" or 173cm"}
                    value={form.height}
                    onChange={e => update('height', e.target.value)}
                  />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <label className="input-label">Weight (optional)</label>
                  <input
                    className="input-field"
                    placeholder="e.g. 150 lbs or 68 kg"
                    value={form.weight}
                    onChange={e => update('weight', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="font-serif" style={{ fontSize: 'var(--font-size-lg)', marginBottom: 24 }}>
                <Palette size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                Complexion & Undertone
              </h3>
              <p className="text-sm text-muted" style={{ marginBottom: 16 }}>Skin Tone</p>
              <div className="onboarding-options" style={{ marginBottom: 28 }}>
                {SKIN_TONES.map(st => (
                  <button
                    key={st}
                    className={`tag ${form.skinTone === st ? 'active' : ''}`}
                    onClick={() => update('skinTone', st)}
                    style={{ padding: '10px 20px', fontSize: 'var(--font-size-sm)' }}
                  >
                    {st}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted" style={{ marginBottom: 16 }}>Undertone</p>
              <div className="onboarding-options">
                {UNDERTONES.map(ut => (
                  <button
                    key={ut}
                    className={`tag ${form.undertone === ut ? 'active' : ''}`}
                    onClick={() => update('undertone', ut)}
                    style={{ padding: '12px 24px', fontSize: 'var(--font-size-sm)' }}
                  >
                    {ut}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="onboarding-result">
              <div className="onboarding-season-card card animate-scaleIn">
                <span className="onboarding-season-emoji">{palette.emoji}</span>
                <h2 className="font-serif" style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 8 }}>{computedSeason}</h2>
                <p className="text-muted" style={{ marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>{palette.description}</p>

                <p className="uppercase text-xs font-semibold text-muted" style={{ marginBottom: 12 }}>Your Harmonious Colors</p>
                <div className="onboarding-swatches">
                  {palette.harmonious.map((c, i) => (
                    <div key={i} className="color-swatch" style={{ backgroundColor: c }} title={c} />
                  ))}
                </div>

                <p className="uppercase text-xs font-semibold text-muted" style={{ marginTop: 24, marginBottom: 12 }}>Colors to Avoid</p>
                <div className="onboarding-swatches">
                  {palette.avoid.map((c, i) => (
                    <div key={i} className="color-swatch" style={{ backgroundColor: c, opacity: 0.6, border: '2px dashed var(--color-grey-whisper)' }} title={c} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="onboarding-nav">
          {step > 0 && (
            <button className="btn btn-ghost" onClick={() => setStep(step - 1)}>
              <ArrowLeft size={14} /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3 ? (
            <button className="btn btn-primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button className="btn btn-accent btn-lg" onClick={handleComplete}>
              <Check size={16} /> Complete Profile
            </button>
          )}
        </div>
      </div>

      <style>{`
        .onboarding-header {
          padding-top: 20px;
        }
        .onboarding-options {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .onboarding-nav {
          display: flex;
          align-items: center;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--color-border-subtle);
        }
        .onboarding-result {
          text-align: center;
        }
        .onboarding-season-card {
          padding: 48px 32px;
          text-align: center;
        }
        .onboarding-season-emoji {
          font-size: 48px;
          display: block;
          margin-bottom: 16px;
        }
        .onboarding-swatches {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .onboarding-nav button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
