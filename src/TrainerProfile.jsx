import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import db from './firebase';
import MapLocation from './components/MapLocation';
import './styles/TrainerProfile.css';

// SEO JSON-LD structured data for trainer profile
const TrainerJsonLd = ({ trainer }) => {
  if (!trainer) return null;
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": trainer.name,
          "description": trainer.bio,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": trainer.suburb,
            "addressRegion": "VIC",
            "addressCountry": "AU"
          },
          "telephone": trainer.phone || "",
          "url": window.location.href,
          "image": trainer.photo || "",
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": trainer.rating,
            "reviewCount": trainer.reviewCount || 5
          },
          "makesOffer": trainer.specialties?.map(specialty => ({
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": specialty
            }
          }))
        })
      }}
    />
  );
};

export default function TrainerProfile() {
  const { slug } = useParams();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarTrainers, setSimilarTrainers] = useState([]);
  
  useEffect(() => {
    const fetchTrainer = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to get trainer from Firestore by slug
        const trainersRef = collection(db, "trainers");
        const q = query(trainersRef, where("slug", "==", slug), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const trainerData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          };
          setTrainer(trainerData);
          
          // Fetch similar trainers (same suburb or overlapping specialties)
          if (trainerData.specialties?.length > 0 || trainerData.suburb) {
            let similarQuery;
            
            if (trainerData.specialties?.length > 0) {
              // Find trainers with at least one matching specialty
              similarQuery = query(
                trainersRef,
                where("specialties", "array-contains-any", trainerData.specialties),
                limit(3)
              );
            } else {
              // Fall back to suburb match
              similarQuery = query(
                trainersRef,
                where("suburb", "==", trainerData.suburb),
                limit(3)
              );
            }
            
            const similarSnapshot = await getDocs(similarQuery);
            const similarData = similarSnapshot.docs
              .map(doc => ({ id: doc.id, ...doc.data() }))
              .filter(t => t.id !== trainerData.id); // Exclude current trainer
              
            setSimilarTrainers(similarData);
          }
        } else {
          setError("Trainer not found");
        }
      } catch (err) {
        console.error("Error fetching trainer:", err);
        setError("An error occurred while loading this trainer profile.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrainer();
  }, [slug]);

  if (loading) {
    return (
      <div className="trainer-profile loading-state">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading trainer profile...</p>
        </div>
      </div>
    );
  }
  
  if (error || !trainer) {
    return (
      <div className="trainer-profile error-state">
        <div className="profile-error">
          <h2>Trainer not found</h2>
          <p>{error || "The trainer you're looking for doesn't exist or has been removed."}</p>
          <Link to="/" className="back-link">← Back to directory</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <TrainerJsonLd trainer={trainer} />
      
      <div className="trainer-profile">
        <Link to="/" className="back-link">← Back to directory</Link>
        
        <div className="profile-header">
          {trainer.premium && (
            <span className="premium-badge">Premium Trainer</span>
          )}
          
          <h1 className="trainer-name">{trainer.name}</h1>
          
          <div className="trainer-meta">
            <div className="trainer-location">
              <span className="meta-icon">📍</span> {trainer.suburb}
            </div>
            
            <div className="trainer-rating">
              <span className="meta-icon">★</span>
              {trainer.rating ? trainer.rating.toFixed(1) : '0.0'}
              <span className="rating-count">({trainer.reviewCount || 5} reviews)</span>
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-main">
            {trainer.photo && (
              <div className="profile-image">
                <img src={trainer.photo} alt={trainer.name} loading="lazy" />
              </div>
            )}
            
            <div className="profile-section">
              <h2 className="section-title">About</h2>
              <p className="trainer-bio">{trainer.bio}</p>
            </div>
            
            <div className="profile-section">
              <h2 className="section-title">Specialties</h2>
              <div className="specialties-list">
                {trainer.specialties?.map(specialty => (
                  <div className="specialty-item" key={specialty}>
                    <span className="specialty-name">{specialty}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {trainer.services && trainer.services.length > 0 && (
              <div className="profile-section">
                <h2 className="section-title">Services Offered</h2>
                <ul className="services-list">
                  {trainer.services.map(service => (
                    <li key={service.name || 'service'} className="service-item">
                      <div className="service-name">{service.name}</div>
                      {service.price && (
                        <div className="service-price">{service.price}</div>
                      )}
                      {service.description && (
                        <div className="service-description">{service.description}</div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {trainer.qualifications && (
              <div className="profile-section">
                <h2 className="section-title">Qualifications</h2>
                <ul className="qualifications-list">
                  {trainer.qualifications.map((qual, index) => (
                    <li key={index} className="qualification-item">{qual}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="profile-sidebar">
            <div className="contact-card">
              <h3 className="card-title">Contact Information</h3>
              
              {trainer.phone && (
                <div className="contact-item">
                  <span className="contact-label">Phone</span>
                  <a href={`tel:${trainer.phone}`} className="contact-value">
                    {trainer.phone}
                  </a>
                </div>
              )}
              
              {trainer.email && (
                <div className="contact-item">
                  <span className="contact-label">Email</span>
                  <a href={`mailto:${trainer.email}`} className="contact-value">
                    {trainer.email}
                  </a>
                </div>
              )}
              
              {trainer.website && (
                <div className="contact-item">
                  <span className="contact-label">Website</span>
                  <a
                    href={trainer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-value"
                  >
                    Visit Website →
                  </a>
                </div>
              )}
              
              <div className="contact-actions">
                <a
                  href={`mailto:${trainer.email || 'contact@example.com'}?subject=Inquiry from Dog Trainers Directory`}
                  className="contact-button primary"
                >
                  Contact Now
                </a>
                
                {trainer.bookingLink && (
                  <a
                    href={trainer.bookingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-button secondary"
                  >
                    Book a Session
                  </a>
                )}
              </div>
            </div>
            
            {/* Map Location */}
            <div className="sidebar-section map-section">
              <h3 className="section-title">Location</h3>
              <MapLocation suburb={trainer.suburb} />
            </div>
            
            {trainer.serviceAreas && (
              <div className="sidebar-section">
                <h3 className="section-title">Service Areas</h3>
                <div className="service-areas">
                  {trainer.serviceAreas.map(area => (
                    <span key={area} className="service-area">{area}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {similarTrainers.length > 0 && (
          <div className="similar-trainers">
            <h2 className="section-title">Similar Trainers</h2>
            <div className="similar-trainers-grid">
              {similarTrainers.map(similar => (
                <Link
                  key={similar.id}
                  to={`/trainers/${similar.slug}`}
                  className="similar-trainer-card"
                >
                  <h3 className="similar-trainer-name">{similar.name}</h3>
                  <p className="similar-trainer-location">{similar.suburb}</p>
                  <div className="similar-trainer-specialties">
                    {similar.specialties?.slice(0, 2).map(spec => (
                      <span key={spec} className="specialty-tag small">{spec}</span>
                    ))}
                    {(similar.specialties?.length || 0) > 2 && (
                      <span className="more-specialties">+{similar.specialties.length - 2} more</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
