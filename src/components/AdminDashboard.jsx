import React, { useState, useEffect } from 'react';
import {
  collection, getDocs, doc, updateDoc, deleteDoc,
  query, where, addDoc, serverTimestamp
} from 'firebase/firestore';
import db, { auth } from '../firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import '../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submissions, setSubmissions] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('submissions');
  
  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      if (user) {
        fetchData();
      }
    });
    
    return () => unsubscribe();
  }, []);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch pending submissions
      const submissionsQuery = query(collection(db, "submissions"), where("approved", "==", false));
      const submissionsSnapshot = await getDocs(submissionsQuery);
      const submissionsData = submissionsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setSubmissions(submissionsData);
      
      // Fetch approved trainers
      const trainersQuery = query(collection(db, "trainers"));
      const trainersSnapshot = await getDocs(trainersQuery);
      const trainersData = trainersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrainers(trainersData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Successful login will trigger onAuthStateChanged
    } catch (error) {
      setError("Invalid login credentials");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  const approveSubmission = async (submission) => {
    try {
      setLoading(true);
      
      // Add the submission to trainers collection
      const trainerData = {
        ...submission,
        approved: true,
        approvedAt: serverTimestamp(),
        approvedBy: user.email,
        createdAt: serverTimestamp()
      };
      
      delete trainerData.id; // Remove submission document ID
      
      // Add to trainers collection
      await addDoc(collection(db, "trainers"), trainerData);
      
      // Delete from submissions (or mark as approved)
      await updateDoc(doc(db, "submissions", submission.id), {
        approved: true,
        approvedAt: serverTimestamp(),
        approvedBy: user.email
      });
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error("Error approving submission:", error);
      setError("Failed to approve trainer");
    } finally {
      setLoading(false);
    }
  };
  
  const rejectSubmission = async (submissionId) => {
    try {
      setLoading(true);
      
      // Delete the submission
      await deleteDoc(doc(db, "submissions", submissionId));
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error("Error rejecting submission:", error);
      setError("Failed to reject submission");
    } finally {
      setLoading(false);
    }
  };
  
  const togglePremium = async (trainerId, isPremium) => {
    try {
      setLoading(true);
      
      await updateDoc(doc(db, "trainers", trainerId), {
        premium: !isPremium,
        updatedAt: serverTimestamp()
      });
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error("Error updating premium status:", error);
      setError("Failed to update premium status");
    } finally {
      setLoading(false);
    }
  };
  
  // Login form
  if (!user) {
    return (
      <div className="admin-login-container">
        <div className="admin-login-card">
          <h1>Admin Login</h1>
          {error && <div className="admin-error">{error}</div>}
          
          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="admin-button primary"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
          
          <p className="admin-note">
            This area is restricted to authorized administrators only.
          </p>
        </div>
      </div>
    );
  }
  
  // Admin dashboard
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-controls">
          <span className="admin-user">Logged in as: {user.email}</span>
          <button 
            className="admin-button secondary"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'submissions' ? 'active' : ''}`}
          onClick={() => setActiveTab('submissions')}
        >
          Pending Submissions ({submissions.length})
        </button>
        <button 
          className={`admin-tab ${activeTab === 'trainers' ? 'active' : ''}`}
          onClick={() => setActiveTab('trainers')}
        >
          Approved Trainers ({trainers.length})
        </button>
      </div>
      
      {loading ? (
        <div className="admin-loading">Loading...</div>
      ) : (
        <>
          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div className="admin-section">
              <h2>Pending Submissions</h2>
              
              {submissions.length === 0 ? (
                <p>No pending submissions found.</p>
              ) : (
                <div className="admin-submissions">
                  {submissions.map(submission => (
                    <div key={submission.id} className="admin-card">
                      <div className="admin-card-header">
                        <h3>{submission.name}</h3>
                        <div className="submission-meta">
                          Submitted: {submission.createdAt?.toDate().toLocaleDateString() || 'Unknown date'}
                        </div>
                      </div>
                      
                      <div className="admin-card-content">
                        <div className="submission-details">
                          <div className="detail-row">
                            <span className="detail-label">Suburb:</span>
                            <span>{submission.suburb}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Email:</span>
                            <span>{submission.email}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Phone:</span>
                            <span>{submission.phone || 'Not provided'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Specialties:</span>
                            <span>{submission.specialties?.join(', ') || 'None'}</span>
                          </div>
                        </div>
                        
                        <div className="submission-bio">
                          <h4>Bio:</h4>
                          <p>{submission.bio}</p>
                        </div>
                        
                        {submission.photo && (
                          <div className="submission-photo">
                            <img src={submission.photo} alt={submission.name} />
                          </div>
                        )}
                      </div>
                      
                      <div className="admin-card-actions">
                        <button 
                          className="admin-button success"
                          onClick={() => approveSubmission(submission)}
                        >
                          Approve
                        </button>
                        <button 
                          className="admin-button danger"
                          onClick={() => rejectSubmission(submission.id)}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Trainers Tab */}
          {activeTab === 'trainers' && (
            <div className="admin-section">
              <h2>Approved Trainers</h2>
              
              {trainers.length === 0 ? (
                <p>No approved trainers found.</p>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Suburb</th>
                      <th>Email</th>
                      <th>Premium</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map(trainer => (
                      <tr key={trainer.id}>
                        <td>{trainer.name}</td>
                        <td>{trainer.suburb}</td>
                        <td>{trainer.email}</td>
                        <td>
                          <span className={`status-badge ${trainer.premium ? 'premium' : 'standard'}`}>
                            {trainer.premium ? 'Premium' : 'Standard'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <button 
                              className={`admin-button ${trainer.premium ? 'warning' : 'success'} small`}
                              onClick={() => togglePremium(trainer.id, trainer.premium)}
                            >
                              {trainer.premium ? 'Remove Premium' : 'Make Premium'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}