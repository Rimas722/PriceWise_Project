import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

      <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '80px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', margin: '0 0 20px 0', color: '#00d4ff' }}>
          Welcome to PriceWise LK
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto 40px auto', color: '#bdc3c7' }}>
          The smartest way to compare grocery prices. Find the cheapest Rice, Vegetables, and Essentials in your city instantly.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/prices" style={{ backgroundColor: '#00d4ff', color: '#000', padding: '15px 30px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
            🛒 Start Comparing Prices
          </Link>
          <Link to="/register-shop" style={{ backgroundColor: 'transparent', color: 'white', border: '2px solid white', padding: '15px 30px', borderRadius: '30px', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
            🏪 I am a Shop Owner
          </Link>
        </div>
      </div>

      <div style={{ backgroundColor: '#f1c40f', padding: '20px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>Spotted a great deal or a price change in the market?</h3>
        <p style={{ margin: '0 0 15px 0', color: '#333' }}>Help the community by updating the prices!</p>
        <Link to="/login" style={{ display: 'inline-block', backgroundColor: '#2c3e50', color: 'white', padding: '10px 25px', borderRadius: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
          🔐 Please Login to Add a Price
        </Link>
      </div>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 20px', display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
        
        <div style={featureCardStyle}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🔍</h2>
          <h3 style={{ color: '#2c3e50' }}>Live Comparison</h3>
          <p style={{ color: '#666' }}>Real-time prices from local verified shops, updated daily.</p>
        </div>

        <div style={featureCardStyle}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>📉</h2>
          <h3 style={{ color: '#2c3e50' }}>Save Money</h3>
          <p style={{ color: '#666' }}>Find the lowest price for your daily essentials instantly and cut grocery bills.</p>
        </div>

        <div style={featureCardStyle}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>🤝</h2>
          <h3 style={{ color: '#2c3e50' }}>Community Driven</h3>
          <p style={{ color: '#666' }}>Consumers and shop owners work together to keep prices accurate.</p>
        </div>

      </div>
    </div>
  );
};

const featureCardStyle = {
  flex: '1',
  minWidth: '250px',
  backgroundColor: 'white',
  padding: '30px',
  borderRadius: '10px',
  textAlign: 'center',
  boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
  borderTop: '5px solid #3498db'
};

export default Home;