import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import db, { storage } from './firebase';
import './styles/SubmitTrainerForm.css';

// This component requires Firebase Storage to be set up for image uploads
// Import storage from your firebase.js file

export default function SubmitTrainerForm() {
  const [formData, setFormData] = useState({
    name: '',
    suburb: '',
    specialties: [],
    bio: '',
    email: '',
    phone: '',
    website: '',
  });
  
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle specialty tags
  const handleAddSpecialty = () => {
    if (!specialtyInput.trim() || formData.specialties.includes(specialtyInput.trim())) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      specialties: [...prev.specialties, specialtyInput.trim()]
    }));
    
    setSpecialtyInput('');
  };
  
  const handleRemoveSpecialty = (specialty) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }));
  };
  
  // Handle photo upload
  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (max 1MB)
      if (selectedFile.size > 1024 * 1024) {
        setError('Photo must be less than 1MB');
        return;
      }
      
      // Check file type
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(selectedFile.type)) {
        setError('Photo must be in JPEG, PNG, or WebP format');
        return;
      }
      
      setPhoto(selectedFile);
      setError('');
    }
  };
  
  // Generate a slug from trainer name
  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Remove consecutive hyphens
  };
  
  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    
    if (!formData.suburb.trim()) {
      setError('Suburb is required');
      return false;
    }
    
    if (formData.specialties.length === 0) {
      setError('At least one specialty is required');
      return false;
    }
    
    if (!formData.bio.trim() || formData.bio.length < 50) {
      setError('Bio is required and should be at least 50 characters');
      return false;
    }
    
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Valid email address is required');
      return false;
    }
    
    return true;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError('');
    
    try {
      // Prepare trainer data
      const trainerData = {
        ...formData,
        slug: generateSlug(formData.name),
        memberSince: new Date(),
        rating: 0,
        premium: false, // Will be upgraded when payment is processed
        approved: false, // Requires admin approval
        createdAt: new Date(),
      };
      
      // If photo is included, upload it
      if (photo) {
        try {
          const storageRef = ref(storage, `trainer-photos/${trainerData.slug}-${Date.now()}`);
          await uploadBytes(storageRef, photo);
          const photoUrl = await getDownloadURL(storageRef);
          trainerData.photo = photoUrl;
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          // Continue with submission even if image upload fails
        }
      }
      
      // Save to "submissions" collection instead of directly to "trainers"
      // This allows for admin approval before listing goes live
      await addDoc(collection(db, "submissions"), trainerData);
      
      setSuccess(true);
      setFormData({
        name: '',
        suburb: '',
        specialties: [],
        bio: '',
        email: '',
        phone: '',
        website: '',
      });
      setPhoto(null);
      
    } catch (err) {
      console.error("Error submitting trainer:", err);
      setError('An error occurred while submitting your listing. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (success) {
    return (
      <div className="submission-success">
        <div className="success-icon">✓</div>
        <h2>Listing Submitted Successfully!</h2>
        <p>
          Thank you for submitting your trainer profile. Our team will review your listing 
          and it will appear in the directory once approved.
        </p>
        <p>
          You'll receive a confirmation email at {formData.email} with next steps.
        </p>
        <button 
          className="new-submission-button"
          onClick={() => setSuccess(false)}
        >
          Submit Another Listing
        </button>
      </div>
    );
  }
  
  return (
    <div className="submit-trainer-container">
      <div className="form-header">
        <h1>List Your Dog Training Services</h1>
        <p className="form-subtitle">
          Join Melbourne's premium directory of specialized dog trainers and reach owners of reactive and anxious dogs.
        </p>
      </div>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="trainer-submission-form">
        <div className="form-section">
          <h2>Trainer Information</h2>
          
          <div className="form-group">
            <label htmlFor="name">Business Name *</label>
            <input 
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Pawsitive Steps Training"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="suburb">Suburb *</label>
            <input 
              type="text"
              id="suburb"
              name="suburb"
              value={formData.suburb}
              onChange={handleChange}
              placeholder="e.g., Brunswick"
              required
            />
          </div>
          
          <div className="form-group">
            <label>Specialties *</label>
            <div className="specialty-input-container">
              <input 
                type="text"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                placeholder="e.g., Leash Reactivity"
              />
              <button 
                type="button" 
                onClick={handleAddSpecialty}
                className="add-specialty-button"
              >
                Add
              </button>
            </div>
            
            {formData.specialties.length > 0 && (
              <div className="specialties-tags">
                {formData.specialties.map(specialty => (
                  <div key={specialty} className="specialty-tag">
                    {specialty}
                    <button 
                      type="button"
                      onClick={() => handleRemoveSpecialty(specialty)}
                      className="remove-tag"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="bio">Bio *</label>
            <textarea 
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe your services, experience, and approach to dog training..."
              rows="6"
              required
            />
            <div className="character-count">
              {formData.bio.length} / 500 characters
              {formData.bio.length < 50 && (
                <span className="character-warning"> (minimum 50 characters)</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="photo">Profile Photo</label>
            <input 
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
              accept="image/jpeg, image/png, image/webp"
            />
            <div className="file-help-text">
              Max size: 1MB. Formats: JPEG, PNG, WebP
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input 
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g., 04XX XXX XXX"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="website">Website</label>
            <input 
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
        
        <div className="form-section pricing">
          <h2>Listing Options</h2>
          
          <div className="pricing-options">
            <div className="pricing-option">
              <input 
                type="radio" 
                id="free-tier" 
                name="tier" 
                value="free" 
                defaultChecked 
              />
              <label htmlFor="free-tier" className="pricing-label">
                <div className="pricing-title">Free Listing</div>
                <div className="pricing-price">$0</div>
                <ul className="pricing-features">
                  <li>Basic directory listing</li>
                  <li>Name, suburb, and specialties</li>
                  <li>Standard position in search results</li>
                </ul>
              </label>
            </div>
            
            <div className="pricing-option highlighted">
              <input 
                type="radio" 
                id="premium-tier" 
                name="tier" 
                value="premium" 
              />
              <label htmlFor="premium-tier" className="pricing-label">
                <div className="pricing-title">Premium Listing</div>
                <div className="pricing-price">$20/month</div>
                <div className="most-popular">MOST POPULAR</div>
                <ul className="pricing-features">
                  <li>Enhanced directory profile</li>
                  <li>Profile photo and extended bio</li>
                  <li>Priority placement in search results</li>
                  <li>Premium badge on your listing</li>
                  <li>"Similar Trainers" feature</li>
                </ul>
              </label>
            </div>
          </div>
          
          <div className="pricing-note">
            Payment will be processed after your listing is approved. 
            Premium listings include a 7-day free trial.
          </div>
        </div>
        
        <div className="form-agreement">
          <input 
            type="checkbox"
            id="agreement"
            name="agreement"
            required
          />
          <label htmlFor="agreement">
            I confirm that the information provided is accurate and I agree to the 
            <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and 
            <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}