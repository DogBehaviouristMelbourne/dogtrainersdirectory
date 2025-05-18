import React from 'react';
import '../styles/AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Dog Trainers Directory</h1>
        <p className="tagline">
          Melbourne's Premium Network of Specialized Dog Trainers
        </p>
      </div>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Dog Trainers Directory was created to bridge the gap between Melbourne dog owners 
          and qualified trainers who specialize in behavioral issues, particularly for reactive 
          and anxious dogs.
        </p>
        <p>
          We understand that finding the right trainer for your dog's specific needs can be 
          challenging. Our directory connects you with professionals who have the expertise 
          to address complex behavioral challenges through positive, science-based methods.
        </p>
      </section>

      <section className="about-section">
        <h2>What Makes Us Different</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Specialized Focus</h3>
            <p>
              We specifically highlight trainers with expertise in reactive and anxious dogs, 
              making it easier to find the right help for your specific situation.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✓</div>
            <h3>Verified Professionals</h3>
            <p>
              All trainers in our directory are verified for credentials and experience 
              before being listed.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📍</div>
            <h3>Location-Based</h3>
            <p>
              Find qualified trainers in your specific Melbourne suburb or who service 
              your local area.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Transparent Reviews</h3>
            <p>
              Read genuine feedback from other dog owners to help make an informed decision.
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Dog Trainers Directory was founded in 2025 by a Melbourne dog owner who 
          struggled to find appropriate help for their reactive rescue dog. After spending 
          countless hours researching trainers and behavioral specialists, they created 
          this platform to make the journey easier for other dog owners facing similar challenges.
        </p>
        <p>
          What started as a simple list has grown into Melbourne's most comprehensive 
          directory of specialized dog trainers, with a focus on positive reinforcement 
          methods and modern behavioral science.
        </p>
      </section>

      <section className="about-section cta-section">
        <h2>Are You a Dog Trainer?</h2>
        <p>
          If you're a qualified dog trainer specializing in behavioral issues, we'd love 
          to have you in our directory.
        </p>
        <div className="cta-buttons">
          <a href="/submit" className="cta-button primary">Join Our Directory</a>
          <a href="#" className="cta-button secondary">Learn More</a>
        </div>
      </section>
    </div>
  );
}