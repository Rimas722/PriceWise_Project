import React from 'react';

const ShopCard = ({ shop }) => {
  return (
    <div style={styles.card}>
      <div style={styles.imagePlaceholder}>
        <span>🏪</span>
      </div>
      <div style={styles.content}>
        <h3 style={styles.title}>{shop.shopName}</h3>
        <p style={styles.text}>📍 {shop.address}</p>
        <p style={styles.text}>📞 {shop.phoneNumber}</p>
        <button style={styles.button}>View Prices</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
  },
  imagePlaceholder: {
    height: '120px',
    backgroundColor: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '3rem',
  },
  content: {
    padding: '15px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '1.2rem',
    color: '#333',
  },
  text: {
    margin: '5px 0',
    color: '#666',
    fontSize: '0.9rem',
  },
  button: {
    marginTop: '10px',
    width: '100%',
    padding: '8px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default ShopCard;