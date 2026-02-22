import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>

        <div style={styles.section}>
          <h2 style={styles.brand}>🏠 PriceWise LK</h2>
          <p style={styles.text}>
            Empowering Sri Lankans to make smarter daily grocery choices through community-driven data.
          </p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Quick Links</h3>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>Home</Link></li>
            <li><Link to="/prices" style={styles.link}>Compare Prices</Link></li>
            <li><Link to="/analytics" style={styles.link}>Market Trends</Link></li>
            <li><Link to="/register-shop" style={styles.link}>Add Your Shop</Link></li>
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.heading}>Support</h3>
          <ul style={styles.list}>
            <li><Link to="/about" style={styles.link}>About Us</Link></li>
            <li><Link to="/contact" style={styles.link}>Contact Us</Link></li>
            <li><Link to="#" style={styles.link}>Privacy Policy</Link></li>
            <li><Link to="#" style={styles.link}>Terms of Service</Link></li>
          </ul>
        </div>

      </div>
      
      <div style={styles.bottomBar}>
        <p style={{ margin: 0 }}>&copy; {new Date().getFullYear()} PriceWise LK. All rights reserved.</p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1a1a2e',
    color: '#ecf0f1',
    paddingTop: '50px',
    marginTop: 'auto',
    fontFamily: 'Arial, sans-serif'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '40px',
    padding: '0 20px',
    justifyContent: 'space-between',
    paddingBottom: '40px'
  },
  section: {
    flex: '1',
    minWidth: '250px'
  },
  brand: {
    color: '#00d4ff',
    marginBottom: '15px'
  },
  text: {
    lineHeight: '1.6',
    color: '#bdc3c7'
  },
  heading: {
    color: '#ffffff',
    marginBottom: '20px',
    fontSize: '1.2rem',
    borderBottom: '2px solid #00d4ff',
    display: 'inline-block',
    paddingBottom: '5px'
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  link: {
    color: '#bdc3c7',
    textDecoration: 'none',
    transition: 'color 0.3s'
  },
  bottomBar: {
    backgroundColor: '#0f0f1a',
    textAlign: 'center',
    padding: '20px',
    color: '#7f8c8d',
    fontSize: '0.9rem'
  }
};

export default Footer;