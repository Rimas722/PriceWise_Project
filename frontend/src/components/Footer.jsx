import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer style={{ 
      backgroundColor: '#1a252f', 
      color: '#ecf0f1', 
      padding: isMobile ? '40px 20px 20px 20px' : '50px 20px 20px 20px', 
      marginTop: 'auto' 
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row', 
        flexWrap: 'wrap', 
        justifyContent: 'space-between', 
        gap: '30px',
        textAlign: isMobile ? 'center' : 'left'
      }}>
        
        <div style={{ flex: '1' }}>
          <h2 style={{ color: '#3498db', margin: '0 0 15px 0', fontSize: '1.5rem' }}>🏠 PriceWise LK</h2>
          <p style={{ color: '#bdc3c7', lineHeight: '1.6', fontSize: '0.95rem', margin: isMobile ? '0 auto' : '0', maxWidth: isMobile ? '100%' : '300px' }}>
            Empowering Sri Lankans to make smarter daily grocery choices through community-driven price tracking.
          </p>
        </div>

        <div style={{ flex: '1' }}>
          <h3 style={headingStyle}>Quick Links</h3>
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/prices" style={linkStyle}>Compare Prices</Link>
          <Link to="/login" style={linkStyle}>Login / Register</Link>
        </div>

        <div style={{ flex: '1' }}>
          <h3 style={headingStyle}>Support</h3>
          <a href="/#about" style={linkStyle}>About Us</a>
          <a href="/#contact" style={linkStyle}>Contact</a>
          <Link to="/privacy" style={linkStyle}>Privacy Policy</Link>
          <Link to="/terms" style={linkStyle}>Terms of Service</Link>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #34495e', color: '#7f8c8d', fontSize: '0.9rem' }}>
        &copy; {new Date().getFullYear()} PriceWise LK. All rights reserved.
      </div>
    </footer>
  );
};

const headingStyle = { 
  fontSize: '1.2rem', 
  marginBottom: '20px', 
  color: '#ffffff',
  borderBottom: '2px solid #3498db', 
  display: 'inline-block', 
  paddingBottom: '5px' 
};

const linkStyle = { 
  color: '#bdc3c7', 
  textDecoration: 'none', 
  display: 'block', 
  marginBottom: '12px', 
  fontSize: '0.95rem',
  cursor: 'pointer',
  transition: '0.2s'
};

export default Footer;