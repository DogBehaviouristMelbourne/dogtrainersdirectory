import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import db from './firebase';
import './styles/TrainerListing.css';
import HeroBanner from './components/HeroBanner';
import FeatureSection from './components/FeatureSection';

// SEO JSON-LD structured data for trainers directory
const DirectoryJsonLd = () => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Dog Trainers Directory",
              "description": "Melbourne's premium directory of dog trainers specializing in reactive and anxious dogs."
            }
          ],
          "url": window.location.href
        })
      }}
    />
  );
};

export default function TrainerListingViewer() {
  const [trainers, setTrainers] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // "all", "suburb", "specialty"

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "trainers"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setTrainers(data);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  // Get unique suburbs and specialties for filter options
  const suburbs = [...new Set(trainers.map(t => t.suburb).filter(Boolean))];
  const specialties = [...new Set(trainers.flatMap(t => t.specialties || []))];

  const filtered = trainers.filter(t => {
    if (!filter) return true;
    
    const filterLower = filter.toLowerCase();
    
    if (filterType === "suburb") {
      return t.suburb?.toLowerCase().includes(filterLower);
    } else if (filterType === "specialty") {
      return t.specialties?.some(s => s.toLowerCase().includes(filterLower));
    } else {
      return (
        t.suburb?.toLowerCase().includes(filterLower) ||
        t.specialties?.some(s => s.toLowerCase().includes(filterLower)) ||
        t.name.toLowerCase().includes(filterLower)
      );
    }
  });

  return (
    <>
      <DirectoryJsonLd />
      
      <HeroBanner />
      
      <FeatureSection />
      
      <div className="trainer-directory" id="directory-search">
        <div className="directory-header">
          <h2>Melbourne Dog Trainers Directory</h2>
          <p className="directory-subtitle">
            Find specialized trainers for reactive and anxious dogs in your suburb
          </p>
          
          <div className="search-container">
            <div className="filter-controls">
              <div className="filter-tabs">
                <button
                  className={`filter-tab ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterType('all')}
                >
                  All
                </button>
                <button
                  className={`filter-tab ${filterType === 'suburb' ? 'active' : ''}`}
                  onClick={() => setFilterType('suburb')}
                >
                  By Suburb
                </button>
                <button
                  className={`filter-tab ${filterType === 'specialty' ? 'active' : ''}`}
                  onClick={() => setFilterType('specialty')}
                >
                  By Specialty
                </button>
              </div>
              
              <input
                type="text"
                placeholder={`Search ${filterType === 'suburb' ? 'suburbs' : filterType === 'specialty' ? 'specialties' : 'all trainers'}...`}
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="search-input"
              />
            </div>
            
            {filterType === 'suburb' && filter === '' && (
              <div className="quick-filters">
                {suburbs.slice(0, 8).map(suburb => (
                  <button
                    key={suburb}
                    className="quick-filter-btn"
                    onClick={() => setFilter(suburb)}
                  >
                    {suburb}
                  </button>
                ))}
              </div>
            )}
            
            {filterType === 'specialty' && filter === '' && (
              <div className="quick-filters">
                {specialties.slice(0, 8).map(specialty => (
                  <button
                    key={specialty}
                    className="quick-filter-btn"
                    onClick={() => setFilter(specialty)}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Finding the best trainers in Melbourne...</p>
          </div>
        ) : (
          <>
            <p className="results-count">
              {filtered.length} trainer{filtered.length !== 1 ? 's' : ''} found
            </p>
            
            <div className="trainers-grid">
              {filtered.map(trainer => (
                <Link
                  key={trainer.id}
                  to={`/trainers/${trainer.slug}`}
                  className="trainer-card-link"
                >
                  <div className="trainer-card">
                    {trainer.premium && (
                      <span className="premium-badge">Premium</span>
                    )}
                    <h2 className="trainer-name">{trainer.name}</h2>
                    <div className="trainer-location">
                      <span className="location-icon">📍</span> {trainer.suburb}
                    </div>
                    
                    <div className="trainer-rating">
                      {'★'.repeat(Math.floor(trainer.rating || 0))}
                      {trainer.rating && trainer.rating % 1 >= 0.5 ? '½' : ''}
                      {'☆'.repeat(5 - Math.ceil(trainer.rating || 0))}
                      <span className="rating-value">{trainer.rating ? trainer.rating.toFixed(1) : '0.0'}</span>
                    </div>
                    
                    <div className="trainer-specialties">
                      {trainer.specialties?.map(specialty => (
                        <span key={specialty} className="specialty-tag">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <p className="trainer-bio">
                      {trainer.bio && (
                        trainer.bio.length > 120
                        ? `${trainer.bio.substring(0, 120)}...`
                        : trainer.bio
                      )}
                    </p>
                    
                    <span className="view-profile">View Profile →</span>
                  </div>
                </Link>
              ))}
            </div>
            
            {filtered.length === 0 && !loading && (
              <div className="no-results">
                <h3>No trainers match your search.</h3>
                <p>Try adjusting your filters or search for a different specialty.</p>
                <button
                  className="reset-button"
                  onClick={() => {
                    setFilter('');
                    setFilterType('all');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
