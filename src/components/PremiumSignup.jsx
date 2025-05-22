import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PremiumSignup({ trainerId }) {
  const [loading, setLoading] = useState(null); // null | 'premium' | 'featured'
  const [error, setError] = useState('');
  const [plan, setPlan] = useState('monthly'); // monthly or annual
  const navigate = useNavigate();

  if (!trainerId) {
    console.error('No trainerId provided to PremiumSignup component');
    return <div className="error-message">Trainer ID is required</div>;
  }

  const handleSubscribe = async (type) => {
    setLoading(type);
    setError('');
    
    // Get the appropriate price ID based on plan type and billing period
    let priceId;
    if (type === 'premium') {
      priceId = plan === 'monthly'
        ? import.meta.env.VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID
        : import.meta.env.VITE_STRIPE_PREMIUM_ANNUAL_PRICE_ID;
    } else if (type === 'featured') {
      priceId = plan === 'monthly'
        ? import.meta.env.VITE_STRIPE_FEATURED_MONTHLY_PRICE_ID
        : import.meta.env.VITE_STRIPE_FEATURED_ANNUAL_PRICE_ID;
    }

    if (!priceId) {
      setError(`Missing price ID for ${type} ${plan} plan`);
      setLoading(null);
      return;
    }

    try {
      console.log(`Creating checkout session for ${type} ${plan} plan (${priceId})`);
      
      const functionsUrl = import.meta.env.VITE_FUNCTIONS_URL;
      if (!functionsUrl) {
        throw new Error('VITE_FUNCTIONS_URL not defined in environment');
      }
      
      const res = await fetch(`${functionsUrl}/createCheckoutSession`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainerId,
          priceId,
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Checkout session creation failed:', errorText);
        throw new Error(`Failed to create checkout session: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL in response:', data);
        throw new Error('No checkout URL returned from server');
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err.message || 'An error occurred during subscription process');
      setLoading(null);
    }
  };

  const togglePlan = () => {
    setPlan(plan === 'monthly' ? 'annual' : 'monthly');
  };

  return (
    <div className="premium-signup-container" style={{ marginBottom: 16 }}>
      {/* Billing period toggle */}
      <div className="billing-toggle" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontWeight: plan === 'monthly' ? 'bold' : 'normal' }}>Monthly</span>
        <label className="switch" style={{ margin: '0 10px', position: 'relative', display: 'inline-block', width: '60px', height: '34px' }}>
          <input
            type="checkbox"
            checked={plan === 'annual'}
            onChange={togglePlan}
            style={{ opacity: 0, width: 0, height: 0 }}
          />
          <span className="slider" style={{
            position: 'absolute',
            cursor: 'pointer',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: plan === 'annual' ? '#2196F3' : '#ccc',
            borderRadius: '34px',
            transition: '0.4s'
          }}>
            <span style={{
              position: 'absolute',
              height: '26px',
              width: '26px',
              left: plan === 'annual' ? '30px' : '4px',
              bottom: '4px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: '0.4s'
            }}></span>
          </span>
        </label>
        <span style={{ fontWeight: plan === 'annual' ? 'bold' : 'normal' }}>Annual (Save 16%)</span>
      </div>

      {/* Subscription buttons */}
      <div className="premium-signup-buttons" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          type="button"
          className="premium-btn"
          onClick={() => handleSubscribe('premium')}
          disabled={loading !== null}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading !== null ? 'not-allowed' : 'pointer',
            opacity: loading !== null ? 0.7 : 1
          }}
        >
          {loading === 'premium' ? 'Redirecting...' : `Premium ${plan === 'monthly' ? '$20/month' : '$200/year'}`}
        </button>
        <button
          type="button"
          className="featured-btn"
          onClick={() => handleSubscribe('featured')}
          disabled={loading !== null}
          style={{
            padding: '10px 20px',
            backgroundColor: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading !== null ? 'not-allowed' : 'pointer',
            opacity: loading !== null ? 0.7 : 1
          }}
        >
          {loading === 'featured' ? 'Redirecting...' : `Featured ${plan === 'monthly' ? '$30/month' : '$300/year'}`}
        </button>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="premium-signup-error" style={{
          color: 'red',
          marginTop: 16,
          textAlign: 'center',
          padding: '8px',
          backgroundColor: '#ffebee',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      {/* Plans comparison */}
      <div className="plans-comparison" style={{ marginTop: 24, fontSize: '0.9em' }}>
        <h4 style={{ textAlign: 'center', marginBottom: 16 }}>Subscription Benefits</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div style={{ flex: 1, padding: '0 8px' }}>
            <h5 style={{ color: '#4CAF50' }}>Premium</h5>
            <ul style={{ paddingLeft: 20 }}>
              <li>Priority listing in search results</li>
              <li>Detailed profile statistics</li>
              <li>Custom profile badge</li>
            </ul>
          </div>
          <div style={{ flex: 1, padding: '0 8px' }}>
            <h5 style={{ color: '#ff9800' }}>Featured</h5>
            <ul style={{ paddingLeft: 20 }}>
              <li>All Premium benefits</li>
              <li>Featured section on homepage</li>
              <li>Highlighted in search results</li>
              <li>Social media promotion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
