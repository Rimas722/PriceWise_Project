import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ShopCard from '../components/ShopCard';

const Home = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/shops');
        setShops(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch shops. Is the backend running?');
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  if (loading) return <h2 style={{textAlign: 'center', marginTop: '50px'}}>Loading Shops...</h2>;
  if (error) return <h2 style={{textAlign: 'center', color: 'red', marginTop: '50px'}}>{error}</h2>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Find Best Prices in Kandy 🇱🇰</h1>
        <p>Compare prices for Rice, Vegetables, and Groceries near you.</p>
      </header>

      <div style={styles.grid}>
        {shops.map((shop) => (
          <ShopCard key={shop._id} shop={shop} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
    gap: '20px',
  }
};

export default Home;