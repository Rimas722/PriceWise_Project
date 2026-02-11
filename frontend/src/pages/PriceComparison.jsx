import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PriceComparison = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/prices');
        setPrices(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching prices:", err);
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) return <h2 style={{textAlign:'center', marginTop:'50px'}}>Loading Prices...</h2>;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>💰 Price Comparison</h1>
      
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Shop</th>
            <th style={styles.th}>Price (LKR)</th>
            <th style={styles.th}>Unit</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item) => (
            <tr key={item._id} style={styles.row}>
              <td style={styles.td}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                   <span style={{fontSize:'1.5rem'}}>📦</span> 
                   {item.product?.name || "Unknown Product"}
                </div>
              </td>
              <td style={styles.td}>{item.shop?.shopName || "Unknown Shop"}</td>
              <td style={styles.price}>Rs. {item.price}</td>
              <td style={styles.td}>{item.product?.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '30px auto', padding: '20px' },
  header: { textAlign: 'center', marginBottom: '30px', color: '#333' },
  table: { width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  headerRow: { backgroundColor: '#007bff', color: 'white' },
  th: { padding: '15px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  td: { padding: '15px', borderBottom: '1px solid #eee', color: '#555' },
  row: { backgroundColor: 'white' },
  price: { padding: '15px', borderBottom: '1px solid #eee', fontWeight: 'bold', color: '#28a745' }
};

export default PriceComparison;