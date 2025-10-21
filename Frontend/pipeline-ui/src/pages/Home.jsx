import React from 'react';
import './Page.css';
import InfoSection from '../components/InfoSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div>
      {/* Fullscreen Landing Image Section */}
      <div className="landing-image">
        <img 
          src="/pipeline-landing.jpg" 
          alt="Pipeline Landing" 
          style={{ 
            width: "100%", 
            height: "75vh",   // full viewport height
            objectFit: "cover" 
          }} 
        />
      </div>

      {/* Info Section */}
      <InfoSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
