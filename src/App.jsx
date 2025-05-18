import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TrainerListingViewer from './TrainerListingViewer';
import TrainerProfile from './TrainerProfile';
import SubmitTrainerForm from './SubmitTrainerForm';
import Layout from './components/Layout';
import AboutPage from './components/AboutPage';
import AdminDashboard from './components/AdminDashboard';
import './styles/Layout.css';

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <TrainerListingViewer />
          </Layout>
        }
      />
      <Route
        path="/trainers/:slug"
        element={
          <Layout>
            <TrainerProfile />
          </Layout>
        }
      />
      <Route
        path="/submit"
        element={
          <Layout>
            <SubmitTrainerForm />
          </Layout>
        }
      />
      {/* Additional routes */}
      <Route
        path="/about"
        element={
          <Layout>
            <AboutPage />
          </Layout>
        }
      />
      <Route
        path="/privacy"
        element={
          <Layout>
            <div className="container" style={{ padding: '2rem 0' }}>
              <h1>Privacy Policy</h1>
              <p>Last Updated: May 2025</p>
              <p>
                Dog Trainers Directory is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you visit our website.
              </p>
              {/* Privacy policy content would go here */}
            </div>
          </Layout>
        }
      />
      <Route
        path="/terms"
        element={
          <Layout>
            <div className="container" style={{ padding: '2rem 0' }}>
              <h1>Terms of Service</h1>
              <p>Last Updated: May 2025</p>
              <p>
                By accessing or using Dog Trainers Directory, you agree to be bound by these Terms of Service.
              </p>
              {/* Terms of service content would go here */}
            </div>
          </Layout>
        }
      />
      {/* Admin Route */}
      <Route
        path="/admin"
        element={
          <AdminDashboard />
        }
      />
      
      <Route
        path="*"
        element={
          <Layout>
            <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
              <h1>Page Not Found</h1>
              <p>The page you're looking for doesn't exist or has been moved.</p>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
}