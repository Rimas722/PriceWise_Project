import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ShopProfile = () => {
  const { id } = useParams(); 
  const [shop, setShop] = useState(null);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        const { data } = await axios.get(`https://pricewise-project.onrender.com/api/shops/${id}`);
        setShop(data.shop);
        setPrices(data.prices);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchShopData();
  }, [id]);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>Loading...</div>;
  if (!shop) return <div style={{textAlign:'center', marginTop:'50px'}}>Shop not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{margin: 0}}>{shop.shopName}</h1>
        <p style={{color: '#666', marginTop: '5px'}}>📍 {shop.address}</p>
        <p>📞 {shop.phoneNumber}</p>
      </div>

      <h3 style={{marginTop: '30px'}}>📦 Available Items</h3>
      
      <table style={styles.table}>
        <thead>
          <tr style={{backgroundColor: '#eee'}}>
            <th style={styles.th}>Product</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {prices.length > 0 ? (
            prices.map((item) => (
              <tr key={item._id} style={{borderBottom: '1px solid #ddd'}}>
                <td style={styles.td}>
                   <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                     <img src={item.product?.image} alt="" style={{width:'40px', height:'40px', borderRadius:'5px'}}/>
                     {item.product?.name}
                   </div>
                </td>
                <td style={{...styles.td, color: 'green', fontWeight: 'bold'}}>
                  Rs. {item.price}
                </td>
                <td style={styles.td}>
                  {new Date(item.updatedAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="3" style={styles.td}>No items listed yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '30px auto', padding: '20px' },
  header: { textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '10px' },
  th: { padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' },
  td: { padding: '12px' }
};

export default ShopProfile;