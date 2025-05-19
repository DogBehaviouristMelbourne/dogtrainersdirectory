import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HeroBanner.css';

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Find The Perfect Dog Trainer in Melbourne</h1>
        <p>Specialized help for reactive & anxious dogs from verified professionals</p>
        <div className="hero-cta">
          <Link to="/submit" className="cta-button primary">List Your Services</Link>
          <a href="#directory-search" className="cta-button secondary">Find a Trainer</a>
        </div>
        
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">20+</span>
            <span className="stat-label">Verified Trainers</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Melbourne Suburbs</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Focus on Positive Methods</span>
          </div>
        </div>
      </div>
      
      <div className="hero-scroll-indicator">
        <a href="#directory-search" aria-label="Scroll down to search">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </section>
  );
}