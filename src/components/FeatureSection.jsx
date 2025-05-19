import React from 'react';
import '../styles/FeatureSection.css';

export default function FeatureSection() {
  return (
    <section className="feature-section">
      <div className="feature-container">
        <h2>Why Choose Our Directory?</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Verified Professionals</h3>
            <p>All trainers are thoroughly vetted to ensure they use positive reinforcement methods and have relevant qualifications.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
            </div>
            <h3>Anxiety & Reactivity Specialists</h3>
            <p>Find trainers who specialize in working with reactive and anxious dogs using science-based methods.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                <line x1="16" y1="8" x2="2" y2="22"></line>
                <line x1="17.5" y1="15" x2="9" y2="15"></line>
              </svg>
            </div>
            <h3>Specific to Your Needs</h3>
            <p>Filter trainers by suburb and specialty to find the perfect match for your dog's unique needs.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <h3>Detailed Profiles</h3>
            <p>View trainer profiles with photos, qualifications, specialties, and verified reviews from other dog owners.</p>
          </div>
        </div>
      </div>
      
      <div className="testimonial-section">
        <div className="testimonial-container">
          <h2>What Dog Owners Say</h2>
          
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>"Finding a trainer who understands reactive dogs was a game-changer for us. Our Australian Shepherd has made incredible progress!"</p>
            </div>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <span>JM</span>
              </div>
              <div className="testimonial-info">
                <p className="author-name">Jessica M.</p>
                <p className="author-details">Australian Shepherd owner, Fitzroy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}