import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Layout.css';

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            <h1>Dog Trainers Directory</h1>
            <span className="tagline">Melbourne's Premium Dog Behaviourist Network</span>
          </Link>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/submit" className="nav-link highlight">List Your Services</Link>
          </nav>
        </div>
      </header>
      
      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Dog Trainers Directory</h3>
              <p>Connecting Melbourne dog owners with verified trainers specializing in reactive and anxious dogs.</p>
            </div>
            
            <div className="footer-section">
              <h3>Quick Links</h3>
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About</Link>
              <Link to="/submit" className="footer-link">List Your Services</Link>
              <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
            
            <div className="footer-section">
              <h3>Contact</h3>
              <p>Melbourne, Victoria</p>
              <p>hello@dogtrainersdirectory.com.au</p>
            </div>
          </div>
          
          <div className="copyright">
            <p>&copy; {new Date().getFullYear()} Dog Trainers Directory. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}