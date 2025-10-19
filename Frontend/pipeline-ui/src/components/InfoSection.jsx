import React from 'react';
import { motion } from 'framer-motion';

const InfoSection = () => {
  const imageStyle = {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  };

  return (
    <div style={{ backgroundColor: '#f1f1f1', padding: '4rem 2rem' }}>
      {/* Section 1 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h2 style={{ textAlign: 'center', fontSize: '2rem', color: '#000000', fontWeight: 'bold' }}>Why Choose Us?</h2>
        <p style={{ maxWidth: '800px', margin: '1rem auto', fontSize: '1.2rem', color: '#111111' }}>
          Our pipeline monitoring solution uses cutting-edge sensors, AI, and real-time analytics to detect and prevent leaks, ensuring safety and reducing environmental impact.
        </p>
      </motion.div>

      {/* Section 2 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        style={{ marginTop: '4rem', textAlign: 'center' }}
      >
        <h2 style={{ fontSize: '2rem', color: '#000000', fontWeight: 'bold' }}>Advanced AI Integration</h2>
        <p style={{ maxWidth: '800px', margin: '1rem auto', fontSize: '1.2rem', color: '#111111' }}>
          With machine learning and predictive modeling, our system adapts in real time to pipeline behavior and external environmental changes.
        </p>
      </motion.div>

      {/* Section 3 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        style={{ marginTop: '4rem', textAlign: 'center' }}
      >
        <h2 style={{ fontSize: '2rem', color: '#000000', fontWeight: 'bold' }}>Built for Real-World Use</h2>
        <p style={{ maxWidth: '800px', margin: '1rem auto', fontSize: '1.2rem', color: '#111111' }}>
          Rugged sensor integration, weather-proof systems, and a responsive dashboard make our solution ideal for industries across oil, gas, and water.
        </p>
      </motion.div>

      {/* Image Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          marginTop: '4rem',
          justifyContent: 'center'
        }}
      >
        <img
          src="/dasboard1.jpg"
          alt="pipeline 1"
          style={{ ...imageStyle, maxWidth: '500px' }}
        />
        <img
          src="/dasboard2.jpg"
          alt="pipeline 2"
          style={{ ...imageStyle, maxWidth: '500px' }}
        />
      </motion.div>
    </div>
  );
};

export default InfoSection;
