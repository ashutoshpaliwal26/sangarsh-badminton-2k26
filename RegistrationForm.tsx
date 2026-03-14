/**
 * RegistrationForm.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Two-column layout: form on left, sticky info sidebar on right.
 * Section 1: Team & Captain details.
 * Section 2: Dynamic teammate rows (5–7 extras, total 6–8 with captain).
 * Section 3: Submit with success overlay.
 */

import React, { useState, useCallback, useMemo, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Phone, Users, Plus, Trash2, ChevronDown,
  CheckCircle, Home, AlertTriangle, Info, Hash, BookOpen,
} from 'lucide-react';
import type { RegistrationFormData, Teammate } from '../types';
import { BRANCHES, YEARS, MIN_EXTRA, MAX_EXTRA } from '../types';
import '../styles/RegistrationForm.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Creates a unique ID for teammate entries */
const genId = (): string =>
  `tm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;

/** Factory for a blank teammate */
const blankTeammate = (): Teammate => ({
  id: genId(),
  name: '',
  gender: '',
  branch: '',
});

/** Initial form state */
const INITIAL_STATE: RegistrationFormData = {
  teamName: '',
  captainName: '',
  contactNumber: '',
  captainYear: '',
  captainBranch: '',
  captainGender: '',
  teammates: Array.from({ length: MIN_EXTRA }, blankTeammate),
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Styled text / tel input with left icon */
interface TextInputProps {
  id: string;
  type?: 'text' | 'tel' | 'email';
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  maxLength?: number;
  icon: React.ReactNode;
  required?: boolean;
  pattern?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id, type = 'text', value, onChange, placeholder,
  maxLength, icon, required, pattern,
}) => (
  <div className="input-wrap">
    <span className="input-icon">{icon}</span>
    <input
      id={id}
      type={type}
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      required={required}
      pattern={pattern}
      autoComplete="off"
    />
  </div>
);

/** Styled select with chevron */
interface SelectInputProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
  noIcon?: boolean;
}

const SelectInput: React.FC<SelectInputProps> = ({
  id, value, onChange, options, placeholder, icon, noIcon = false,
}) => (
  <div className="select-wrap">
    {!noIcon && icon && (
      <div className="input-wrap">
        <span className="input-icon">{icon}</span>
        <select
          id={id}
          className="form-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    )}

    {noIcon && (
      <select
        id={id}
        className="form-select no-icon"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    )}

    <span className="select-chevron">
      <ChevronDown size={15} />
    </span>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const formId = useId(); // unique prefix for label/input associations

  // ── State ────────────────────────────────────────────────────────────────
  const [form, setForm] = useState<RegistrationFormData>(INITIAL_STATE);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Field updaters ───────────────────────────────────────────────────────

  /** Update any top-level form field */
  const setField = useCallback(
    <K extends keyof RegistrationFormData>(
      key: K,
      value: RegistrationFormData[K]
    ) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  /** Update a specific teammate's field */
  const updateTeammate = useCallback(
    (id: string, key: keyof Omit<Teammate, 'id'>, value: string) => {
      setForm((prev) => ({
        ...prev,
        teammates: prev.teammates.map((t) =>
          t.id === id ? { ...t, [key]: value } : t
        ),
      }));
    },
    []
  );

  /** Append a new blank teammate row */
  const addTeammate = useCallback(() => {
    setForm((prev) => {
      if (prev.teammates.length >= MAX_EXTRA) return prev;
      return { ...prev, teammates: [...prev.teammates, blankTeammate()] };
    });
  }, []);

  /** Remove a teammate row by id */
  const removeTeammate = useCallback((id: string) => {
    setForm((prev) => {
      if (prev.teammates.length <= MIN_EXTRA) return prev;
      return {
        ...prev,
        teammates: prev.teammates.filter((t) => t.id !== id),
      };
    });
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────

  /** Total members = captain + teammates */
  const totalMembers = form.teammates.length + 1;

  /** Gender tally — captain gender + each teammate gender */
  const genderTally = useMemo(() => {
    let male = form.captainGender === 'Male' ? 1 : 0;
    let female = form.captainGender === 'Female' ? 1 : 0;

    form.teammates.forEach((t) => {
      if (t.gender === 'Male') male++;
      else if (t.gender === 'Female') female++;
    });

    return { male, female };
  }, [form.captainGender, form.teammates]);

  /** Whether gender rule is satisfied (min 3 boys AND 3 girls) */
  const genderRuleMet =
    genderTally.male >= 3 && genderTally.female >= 3;

  /** Form completion check (loose — strict check on submit) */
  const formIsComplete = useMemo(() => {
    const captainOk = form.teamName && form.captainName &&
      form.contactNumber && form.captainYear &&
      form.captainBranch && form.captainGender;
    const teammatesOk = form.teammates.every(
      (t) => t.name && t.gender && t.branch
    );
    return Boolean(captainOk && teammatesOk && genderRuleMet);
  }, [form, genderRuleMet]);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // — Validation —
    if (!form.teamName.trim() || !form.captainName.trim() || !form.contactNumber.trim()) {
      alert('Please fill in all required captain / team fields.');
      return;
    }

    if (!/^\d{10}$/.test(form.contactNumber)) {
      alert('Contact number must be exactly 10 digits.');
      return;
    }

    if (!form.captainYear || !form.captainBranch || !form.captainGender) {
      alert('Please complete captain year, branch, and gender.');
      return;
    }

    const incompleteTm = form.teammates.findIndex(
      (t) => !t.name.trim() || !t.gender || !t.branch
    );
    if (incompleteTm !== -1) {
      alert(`Please complete all details for Member ${incompleteTm + 2}.`);
      return;
    }

    if (!genderRuleMet) {
      alert(
        `Gender rule not met!\nCurrent: ${genderTally.male} Boys, ${genderTally.female} Girls.\nRequired: Minimum 3 Boys AND 3 Girls.`
      );
      return;
    }

    // — Mock submit (replace with API call in production) —
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    console.log('📋 Registration Submitted:', JSON.stringify(form, null, 2));
    setIsSubmitting(false);
    setShowSuccess(true);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="reg-page page-enter">
      <div className="container reg-container">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <header className="reg-header">
          <button className="reg-back-link" onClick={() => navigate('/')}>
            <ArrowLeft size={14} /> Back to Home
          </button>
          <h1 className="reg-page-title">
            Team <span>Registration</span>
          </h1>
          <p className="reg-page-sub">
            Complete the form below to officially register your team for
            SANGARSH BADMIN2K26. Ensure all details are accurate.
          </p>
        </header>

        {/* ── Layout: Form + Sidebar ─────────────────────────────────────── */}
        <div className="reg-layout">

          {/* ═══ MAIN FORM ════════════════════════════════════════════════ */}
          <main className="reg-form-main">
            <form onSubmit={handleSubmit} noValidate id={`${formId}-form`}>

              {/* ── Section 1: Team & Captain ────────────────────────── */}
              <div className="form-section">
                <div className="form-section-head">
                  <div className="form-section-num">1</div>
                  <div>
                    <p className="form-section-title">Team &amp; Captain Details</p>
                    <p className="form-section-subtitle">
                      The captain will be the primary point of contact.
                    </p>
                  </div>
                </div>

                <div className="form-section-body">
                  <div className="form-grid">

                    {/* Team Name — full width */}
                    <div className="form-field form-grid-full">
                      <label
                        className="form-field-label"
                        htmlFor={`${formId}-teamName`}
                      >
                        Team Name *
                      </label>
                      <TextInput
                        id={`${formId}-teamName`}
                        value={form.teamName}
                        onChange={(v) => setField('teamName', v)}
                        placeholder="e.g. The Smashers"
                        maxLength={60}
                        icon={<Users size={15} />}
                        required
                      />
                    </div>

                    {/* Captain Name */}
                    <div className="form-field">
                      <label
                        className="form-field-label"
                        htmlFor={`${formId}-captainName`}
                      >
                        Captain Name *
                      </label>
                      <TextInput
                        id={`${formId}-captainName`}
                        value={form.captainName}
                        onChange={(v) => setField('captainName', v)}
                        placeholder="Full name"
                        maxLength={80}
                        icon={<User size={15} />}
                        required
                      />
                    </div>

                    {/* Contact Number */}
                    <div className="form-field">
                      <label
                        className="form-field-label"
                        htmlFor={`${formId}-contact`}
                      >
                        Contact Number *
                      </label>
                      <TextInput
                        id={`${formId}-contact`}
                        type="tel"
                        value={form.contactNumber}
                        onChange={(v) => setField('contactNumber', v.replace(/\D/g, ''))}
                        placeholder="10-digit mobile"
                        maxLength={10}
                        icon={<Phone size={15} />}
                        required
                        pattern="[0-9]{10}"
                      />
                    </div>

                    {/* Captain Gender */}
                    <div className="form-field">
                      <label
                        className="form-field-label"
                        htmlFor={`${formId}-captainGender`}
                      >
                        Captain Gender *
                      </label>
                      <SelectInput
                        id={`${formId}-captainGender`}
                        value={form.captainGender}
                        onChange={(v) => setField('captainGender', v as RegistrationFormData['captainGender'])}
                        options={['Male', 'Female']}
                        placeholder="Select Gender"
                        icon={<User size={15} />}
                      />
                    </div>

                    {/* Captain Year */}
                    <div className="form-field">
                      <label
                        className="form-field-label"
                        htmlFor={`${formId}-captainYear`}
                      >
                        Year of Study *
                      </label>
                      <SelectInput
                        id={`${formId}-captainYear`}
                        value={form.captainYear}
                        onChange={(v) => setField('captainYear', v)}
                        options={YEARS}
                        placeholder="Select Year"
                        icon={<BookOpen size={15} />}
                      />
                    </div>

                    {/* Captain Branch */}
                    <div className="form-field">
                      <label
                        className="form-field-label"
                        htmlFor={`${formId}-captainBranch`}
                      >
                        Branch *
                      </label>
                      <SelectInput
                        id={`${formId}-captainBranch`}
                        value={form.captainBranch}
                        onChange={(v) => setField('captainBranch', v)}
                        options={BRANCHES}
                        placeholder="Select Branch"
                        icon={<Hash size={15} />}
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* ── Section 2: Teammates ─────────────────────────────── */}
              <div className="form-section">
                <div className="form-section-head">
                  <div className="form-section-num">2</div>
                  <div>
                    <p className="form-section-title">Teammates</p>
                    <p className="form-section-subtitle">
                      Add {MIN_EXTRA}–{MAX_EXTRA} teammates (total 6–8 with captain). Min 3 boys &amp; 3 girls.
                    </p>
                  </div>
                </div>

                <div className="form-section-body">

                  {/* Teammate rows */}
                  <div
                    className="teammates-list"
                    role="list"
                    aria-label="Teammate entries"
                  >
                    {form.teammates.map((tm, idx) => (
                      <div
                        key={tm.id}
                        className="teammate-row"
                        role="listitem"
                        style={{ animationDelay: `${idx * 0.05}s` }}
                      >
                        {/* Name */}
                        <div className="form-field">
                          <span className="teammate-row-num">
                            MEMBER {idx + 2}
                          </span>
                          <div className="input-wrap">
                            <span className="input-icon"><User size={14} /></span>
                            <input
                              type="text"
                              className="form-input"
                              placeholder="Full name"
                              value={tm.name}
                              onChange={(e) => updateTeammate(tm.id, 'name', e.target.value)}
                              maxLength={80}
                              aria-label={`Member ${idx + 2} name`}
                            />
                          </div>
                        </div>

                        {/* Gender */}
                        <div className="form-field">
                          <label className="form-field-label" aria-label={`Member ${idx + 2} gender`}>
                            Gender
                          </label>
                          <div className="select-wrap">
                            <select
                              className="form-select no-icon"
                              value={tm.gender}
                              onChange={(e) =>
                                updateTeammate(tm.id, 'gender', e.target.value as Teammate['gender'])
                              }
                              aria-label={`Gender for member ${idx + 2}`}
                            >
                              <option value="">Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                            <span className="select-chevron">
                              <ChevronDown size={14} />
                            </span>
                          </div>
                        </div>

                        {/* Branch */}
                        <div className="form-field">
                          <label className="form-field-label" aria-label={`Member ${idx + 2} branch`}>
                            Branch
                          </label>
                          <div className="select-wrap">
                            <select
                              className="form-select no-icon"
                              value={tm.branch}
                              onChange={(e) => updateTeammate(tm.id, 'branch', e.target.value)}
                              aria-label={`Branch for member ${idx + 2}`}
                            >
                              <option value="">Branch</option>
                              {BRANCHES.map((b) => (
                                <option key={b} value={b}>{b}</option>
                              ))}
                            </select>
                            <span className="select-chevron">
                              <ChevronDown size={14} />
                            </span>
                          </div>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          className="btn-remove-tm"
                          onClick={() => removeTeammate(tm.id)}
                          disabled={form.teammates.length <= MIN_EXTRA}
                          aria-label={`Remove member ${idx + 2}`}
                          title={
                            form.teammates.length <= MIN_EXTRA
                              ? `Minimum ${MIN_EXTRA} teammates required`
                              : 'Remove this teammate'
                          }
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add teammate button */}
                  <button
                    type="button"
                    className="btn-add-teammate"
                    onClick={addTeammate}
                    disabled={form.teammates.length >= MAX_EXTRA}
                    aria-label="Add another teammate"
                  >
                    <Plus size={16} />
                    {form.teammates.length >= MAX_EXTRA
                      ? 'Maximum teammates reached (7)'
                      : `Add Teammate (${form.teammates.length}/${MAX_EXTRA})`
                    }
                  </button>

                </div>
              </div>

              {/* ── Section 3: Submit ────────────────────────────────── */}
              <div className="submit-section">

                {/* Notice box */}
                <div className="submit-notice">
                  <span className="submit-notice-icon">
                    <Info size={15} />
                  </span>
                  <p className="submit-notice-text">
                    By submitting, you confirm all details are accurate. The registration
                    fee of <strong>₹100</strong> is payable at the venue.
                    Ensure <strong>min. 3 Boys &amp; 3 Girls</strong> before submitting.
                  </p>
                </div>

                {/* Gender warning */}
                {!genderRuleMet && (form.captainGender || form.teammates.some((t) => t.gender)) && (
                  <div className="submit-notice" style={{ background: 'rgba(255,179,71,0.05)', borderColor: 'rgba(255,179,71,0.25)' }}>
                    <AlertTriangle size={15} style={{ color: '#FFB347', flexShrink: 0, marginTop: 1 }} />
                    <p className="submit-notice-text" style={{ color: 'rgba(255,179,71,0.8)' }}>
                      Gender rule not met: <strong style={{ color: '#FFB347' }}>
                        {genderTally.male} Boys, {genderTally.female} Girls
                      </strong> selected. Need at least 3 of each.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-submit-main"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                >
                  <span>
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </span>
                  {!isSubmitting && <CheckCircle size={20} />}
                </button>
              </div>

            </form>
          </main>

          {/* ═══ SIDEBAR ════════════════════════════════════════════════ */}
          <aside className="reg-sidebar" aria-label="Registration Info">

            {/* Team size meter */}
            <div className="sidebar-card">
              <p className="sidebar-card-title">
                <Users size={13} /> Team Size
              </p>
              <div className="team-meter">
                <div className="team-meter-bar-wrap" role="progressbar"
                  aria-valuenow={totalMembers} aria-valuemin={6} aria-valuemax={8}>
                  {Array.from({ length: 8 }, (_, i) => (
                    <div
                      key={i}
                      className={
                        `meter-slot
                        ${i === 0 ? 'captain' : ''}
                        ${i > 0 && i < totalMembers ? 'filled' : ''}
                        ${i >= totalMembers && i < 6 ? 'required' : ''}`
                      }
                      title={
                        i === 0 ? 'Captain' :
                        i < totalMembers ? `Member ${i + 1}` :
                        i < 6 ? 'Required slot' : 'Optional slot'
                      }
                    />
                  ))}
                </div>

                <div className="team-meter-count">
                  {totalMembers}<span> / 8</span>
                </div>

                <p className="team-meter-status">
                  {totalMembers < 6
                    ? <>Add <strong>{6 - totalMembers} more</strong> member(s) to meet minimum.</>
                    : totalMembers === 8
                    ? <><strong style={{ color: 'var(--orange)' }}>Max reached!</strong> Team is full.</>
                    : <><strong>{totalMembers} members</strong> — can add {8 - totalMembers} more.</>
                  }
                </p>
              </div>
            </div>

            {/* Gender split */}
            <div className="sidebar-card">
              <p className="sidebar-card-title">
                <Users size={13} /> Gender Split
              </p>
              <div className="gender-split">

                {/* Boys */}
                <div className="gender-row">
                  <span className="gender-label">Boys</span>
                  <div className="gender-bar-track">
                    <div
                      className="gender-bar-fill male"
                      style={{ width: `${Math.min((genderTally.male / 8) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="gender-count">{genderTally.male}</span>
                </div>

                {/* Girls */}
                <div className="gender-row">
                  <span className="gender-label">Girls</span>
                  <div className="gender-bar-track">
                    <div
                      className="gender-bar-fill female"
                      style={{ width: `${Math.min((genderTally.female / 8) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="gender-count">{genderTally.female}</span>
                </div>

                <p className={`gender-min-note ${genderRuleMet ? '' : 'warning'}`}>
                  {genderRuleMet
                    ? '✓ Gender requirement satisfied (3+3 minimum)'
                    : `⚠ Need ${Math.max(0, 3 - genderTally.male)} more boy(s) and ${Math.max(0, 3 - genderTally.female)} more girl(s)`
                  }
                </p>
              </div>
            </div>

            {/* Quick facts */}
            <div className="sidebar-card">
              <p className="sidebar-card-title">
                <Info size={13} /> Quick Facts
              </p>
              <ul className="quick-facts" role="list">
                {[
                  'Team size: 6 to 8 members (including captain).',
                  'Minimum 3 Boys AND 3 Girls required.',
                  'Registration fee: ₹100 per team.',
                  'Inter-college team knockout format.',
                  'All participating students must be currently enrolled.',
                ].map((fact, i) => (
                  <li key={i} className="quick-fact">
                    <span className="quick-fact-icon"><CheckCircle size={13} /></span>
                    {fact}
                  </li>
                ))}
              </ul>
            </div>

          </aside>
        </div>
      </div>

      {/* ── Success Overlay ────────────────────────────────────────────────── */}
      {showSuccess && (
        <div
          className="success-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Registration successful"
          onClick={(e) => {
            // Allow clicking backdrop to close
            if (e.target === e.currentTarget) {
              setShowSuccess(false);
              navigate('/');
            }
          }}
        >
          <div className="success-card">
            <div className="success-icon-ring">
              <CheckCircle size={42} strokeWidth={1.5} />
            </div>

            <h2 className="success-title">YOU'RE IN!</h2>

            <p className="success-message">
              Team <strong>{form.teamName}</strong> has been registered for{' '}
              <strong>SANGARSH BADMIN2K26</strong>.
              <br /><br />
              Contact your captain <strong>{form.captainName}</strong> for further
              updates. See you on the court!
            </p>

            <div className="success-actions">
              <button
                className="btn-success-home"
                onClick={() => { setShowSuccess(false); navigate('/'); }}
              >
                <Home size={16} /> Back to Home
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
