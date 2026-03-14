/**
 * LandingPage.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Full landing page for SANGARSH BADMIN2K26
 * Sections: Nav → Hero → Ticker → Details → Feature Banner → Committee → CTA → Footer
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight, Users, IndianRupee, Trophy, Zap, Shield,
  Info, ChevronRight, Star, MapPin,
} from 'lucide-react';
import type { CommitteeMember } from '../types';
import '../styles/LandingPage.css';

// ─── Data ─────────────────────────────────────────────────────────────────────

/** Tournament detail cards */
const DETAILS = [
  {
    icon: <Users size={22} />,
    label: 'Team Composition',
    value: <>6 – <span className="accent">8</span></>,
    unit: 'PLAYERS',
    desc: 'Min 3 Boys & 3 Girls strictly required per team. Mixed gender format.',
  },
  {
    icon: <IndianRupee size={22} />,
    label: 'Registration Fee',
    value: <>₹<span className="accent">100</span></>,
    unit: 'PER TEAM',
    desc: 'One-time flat fee for the full team. Payable at the time of registration.',
  },
  {
    icon: <Trophy size={22} />,
    label: 'Event Type',
    value: <><span className="accent">INTER</span></>,
    unit: 'COLLEGE',
    desc: 'Open to all eligible students from participating colleges. Team event format.',
  },
];

/** Organizing committee */
const COMMITTEE: CommitteeMember[] = [
  { role: 'Sports Incharge',          name: 'AK Kaniraja',      initial: 'AK', color: '#FF5C1A' },
  { role: 'College PTI',              name: 'Yuvraj Singh',     initial: 'YS', color: '#C8F135' },
  { role: 'General Sports Secretary', name: 'Shivam Sharma',    initial: 'SS', color: '#FF5C1A' },
  { role: 'Tournament Manager',       name: 'Ashutosh Paliwal', initial: 'AP', color: '#C8F135' },
];

/** Ticker items — duplicated for seamless loop */
const TICKER_ITEMS = [
  'SANGARSH BADMIN2K26',
  'REGISTER YOUR TEAM NOW',
  'MIXED TEAM EVENT',
  '₹100 ENTRY FEE',
  'MIN 3 BOYS + 3 GIRLS',
  'INTER-COLLEGE CHAMPIONSHIP',
];

// ─── Component ────────────────────────────────────────────────────────────────
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // ── Intersection Observer for reveal animations ────────────────────────────
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.12 }
    );

    // Observe all .reveal elements
    document.querySelectorAll('.reveal').forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="page-enter">

      {/* ── Navigation ───────────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="nav-wordmark">
          <span className="nav-wordmark-main">SANGARSH</span>
          <span className="nav-wordmark-year">2K26</span>
        </div>
        <button className="nav-register-btn" onClick={() => navigate('/register')}>
          Register Now <ArrowRight size={15} />
        </button>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="hero" aria-label="Hero Banner">

        {/* Background image */}
        <div className="hero-bg">
          <img
            src="https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=1600&q=80&auto=format&fit=crop"
            alt="High-intensity badminton match in action"
            loading="eager"
            fetchPriority="high"
          />
        </div>

        {/* Diagonal stripe overlay */}
        <div className="hero-stripe" aria-hidden="true" />

        {/* Content block */}
        <div className="hero-inner">

          {/* Event pill */}
          <div className="hero-label">
            <span className="hero-label-dot" />
            Inter-College Badminton · 2026
          </div>

          {/* Main headline — split into 3 lines for typographic impact */}
          <h1 className="hero-title">
            <span className="hero-title-line1">SMASH YOUR</span>
            <span className="hero-title-line2">WAY TO</span>
            <span className="hero-title-line3">GLORY</span>
          </h1>

          {/* Tournament name */}
          <p className="hero-tourney-name">
            at&nbsp;&nbsp;<strong>SANGARSH BADMIN2K26</strong>
          </p>

          {/* CTA buttons */}
          <div className="hero-ctas">
            <button
              className="hero-cta-primary"
              onClick={() => navigate('/register')}
              aria-label="Register your team for the tournament"
            >
              <span>Register Your Team</span>
              <ArrowRight size={20} />
            </button>

            <button
              className="hero-cta-secondary"
              onClick={() => document.getElementById('details')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Info size={14} />
              View Tournament Info
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll-hint" aria-hidden="true">
          <span>Scroll</span>
          <div className="hero-scroll-line" />
        </div>
      </section>

      {/* ── Ticker Banner ────────────────────────────────────────────────── */}
      <div className="ticker" aria-hidden="true" role="presentation">
        <div className="ticker-track">
          {/* Double the items for seamless loop */}
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">
              {item}
              <span className="ticker-sep" />
            </span>
          ))}
        </div>
      </div>

      {/* ── Tournament Details ────────────────────────────────────────────── */}
      <section id="details" className="details-section section-pad">
        <div className="container details-inner">

          {/* Section header */}
          <div className="section-title-block reveal">
            <div className="section-overline">
              <Zap size={13} /> Tournament Rules
            </div>
            <h2 className="section-title">
              Know the<br /><em>Game Plan</em>
            </h2>
          </div>

          {/* Cards */}
          <div className="details-cards">
            {DETAILS.map((d, i) => (
              <div
                key={i}
                className="detail-card reveal"
                style={{ animationDelay: `${i * 0.1}s`, transitionDelay: `${i * 0.12}s` }}
              >
                {/* Ghost number for visual texture */}
                <span className="detail-card-number" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="detail-card-icon-wrap">{d.icon}</div>
                <div className="detail-card-label">{d.label}</div>

                <div className="detail-card-value">
                  {d.value}
                  {' '}
                  <span style={{ fontSize: '0.9rem', color: 'var(--fog)', fontFamily: 'var(--font-heading)', letterSpacing: '0.15em' }}>
                    {d.unit}
                  </span>
                </div>

                <p className="detail-card-desc">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature Banner (key stats) ───────────────────────────────────── */}
      <div className="feature-banner reveal" aria-label="Key Tournament Stats">
        <div className="feature-banner-text">
          <h2>One Court.<br />One Champion.</h2>
          <p>Show up. Smash it. Own the court.</p>
        </div>

        <div className="feature-stats">
          <div className="feature-stat">
            <div className="feature-stat-val">8</div>
            <div className="feature-stat-lbl">Max Members</div>
          </div>
          <div className="feature-stat">
            <div className="feature-stat-val">3+3</div>
            <div className="feature-stat-lbl">Gender Rule</div>
          </div>
          <div className="feature-stat">
            <div className="feature-stat-val">₹100</div>
            <div className="feature-stat-lbl">Entry Fee</div>
          </div>
        </div>
      </div>

      {/* ── Organizing Committee ─────────────────────────────────────────── */}
      <section id="committee" className="committee-section section-pad">
        <div className="container">

          {/* Section header */}
          <div className="section-title-block reveal">
            <div className="section-overline">
              <Star size={13} /> Organizing Committee
            </div>
            <h2 className="section-title">
              The <em>Team</em><br />Behind the Game
            </h2>
          </div>

          {/* Grid */}
          <div className="committee-grid">
            {COMMITTEE.map((member, i) => (
              <div
                key={i}
                className="committee-card reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Avatar with initial */}
                <div
                  className="committee-avatar"
                  style={{ background: member.color }}
                  aria-hidden="true"
                >
                  {member.initial}
                </div>

                <div className="committee-info">
                  <p className="committee-role">{member.role}</p>
                  <h3 className="committee-name">{member.name}</h3>
                  <div className="committee-tag">
                    <Shield size={11} /> SANGARSH 2K26
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="final-cta section-pad">
        <div className="container final-cta-inner">
          <span className="final-cta-eyebrow">Don't Wait — Limited Slots</span>

          <h2 className="final-cta-title">
            REGISTER<br /><em>TODAY</em>
          </h2>

          <p className="final-cta-sub">
            Build your squad of 6–8. Remember — minimum 3 boys and 3 girls.
            Entry fee is just <strong style={{ color: 'var(--orange)' }}>₹100</strong> per team.
          </p>

          <div className="final-cta-actions">
            <button className="btn-primary-lg" onClick={() => navigate('/register')}>
              <span>Register Your Team</span>
              <ChevronRight size={22} />
            </button>
            <button
              className="btn-outline"
              onClick={() => document.getElementById('committee')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <MapPin size={15} /> Meet the Organizers
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="footer-brand">
          SANGARSH <span>2K26</span>
        </div>
        <p className="footer-copy">
          Organized by the Sports Department &nbsp;·&nbsp; All Rights Reserved
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
