import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Welcome to PriceWise 🇱🇰</h1>
        <p style={styles.subtitle}>
          The smartest way to compare grocery prices in Sri Lanka.
          <br />Find the cheapest Rice, Vegetables, and Essentials in your city.
        </p>

        <div style={styles.buttonContainer}>
          <Link to="/prices" style={{ ...styles.btn, ...styles.btnPrimary }}>
            🛒 I want to Buy (Compare Prices)
          </Link>

          <Link to="/register" style={{ ...styles.btn, ...styles.btnSecondary }}>
            🏪 I am a Shop Owner (Join Us)
          </Link>
        </div>
      </div>

      <div style={styles.features}>
        <div style={styles.card}>
          <h3>🔍 Live Comparison</h3>
          <p>Real-time prices from shops in Kandy, Colombo, and beyond.</p>
        </div>
        <div style={styles.card}>
          <h3>📉 Save Money</h3>
          <p>Find the lowest price for your daily essentials instantly.</p>
        </div>
        <div style={styles.card}>
          <h3>🤝 Community Driven</h3>
          <p>Shop owners update their own prices directly.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { fontFamily: 'Arial, sans-serif' },
  hero: {
    backgroundColor: '#282c34',
    color: 'white',
    padding: '80px 20px',
    textAlign: 'center',
  },
  title: { fontSize: '3rem', marginBottom: '10px' },
  subtitle: { fontSize: '1.2rem', marginBottom: '30px', color: '#ccc' },
  buttonContainer: { display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' },
  btn: {
    padding: '15px 30px',
    borderRadius: '30px',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: '0.3s',
  },
  btnPrimary: { backgroundColor: '#00d4ff', color: '#000' },
  btnSecondary: { backgroundColor: 'transparent', border: '2px solid white', color: 'white' },
  
  features: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    padding: '50px 20px',
    flexWrap: 'wrap',
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    width: '300px',
    textAlign: 'center',
  }
};

export default Home;