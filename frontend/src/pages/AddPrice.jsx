import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPrice = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();

  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]); 
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data: prodData } = await axios.get('https://pricewise-project.onrender.com/api/products');
        const { data: shopData } = await axios.get('https://pricewise-project.onrender.com/api/shops');
        
        setProducts(prodData);

        if (userInfo?.role === 'shop_owner') {
          const myShop = shopData.find(s => 
            s.owner === userInfo._id || (s.owner && s.owner._id === userInfo._id)
          );

          if (myShop) {
            setShops([myShop]); 
            setSelectedShop(myShop._id); 
          } else {
            setShops([]); 
          }
        } else {
          setShops(shopData.filter(s => s.status === 'approved'));
        }
        
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching data", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, userInfo]); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedShop) {
      return alert("Error: No shop selected. If you just registered a shop, an Admin must approve it first.");
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, 
        },
      };

      await axios.post(
        'https://pricewise-project.onrender.com/api/prices',
        {
          shop: selectedShop,
          product: selectedProduct,
          price: Number(price), 
        },
        config
      );

      alert('✅ Price Submitted Successfully!');
      navigate('/prices');

    } catch (error) {
      console.error(error);
      alert('Error submitting price. Please try again.');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}>⏳ Loading form...</div>;
  }

  return (
    <div style={{ ...styles.pageWrapper, padding: isMobile ? '20px 10px' : '50px 20px' }}>
      <div style={{ ...styles.container, padding: isMobile ? '20px' : '30px', width: isMobile ? '100%' : '500px', margin: isMobile ? '0' : '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom:'20px', color: '#2c3e50', fontSize: isMobile ? '1.5rem' : '2rem' }}>💰 Add New Price</h2>
        <form onSubmit={handleSubmit} style={styles.form}>

          <div style={styles.group}>
            <label style={styles.label}>Shop:</label>
            
            {userInfo?.role === 'shop_owner' ? (
              <div style={styles.lockedBox}>
                🏪 {shops.length > 0 ? shops[0].shopName : '⚠️ Shop not found or pending admin approval'}
              </div>
            ) : (
              <select 
                required 
                value={selectedShop} 
                onChange={(e) => setSelectedShop(e.target.value)} 
                style={styles.input}
              >
                <option value="">-- Choose a Shop --</option>
                {shops.map((s) => (
                  <option key={s._id} value={s._id}>{s.shopName}</option>
                ))}
              </select>
            )}
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Select Product:</label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={styles.input} required>
              <option value="">-- Choose a Product --</option>
              {products.map(product => (
                <option key={product._id} value={product._id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Price (Rs.):</label>
            <input 
              type="number" 
              min="1" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              style={styles.input} 
              placeholder="e.g. 250"
              required 
            />
          </div>

          <button type="submit" style={{ ...styles.button, padding: isMobile ? '12px' : '15px', fontSize: isMobile ? '1rem' : '1.1rem' }}>
            Submit Price
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: { backgroundColor: '#f4f6f7', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' },
  container: { maxWidth: '500px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: 'white', fontFamily: 'Arial, sans-serif', boxSizing: 'border-box' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  group: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontWeight: 'bold', color: '#34495e' },
  input: { padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' },
  lockedBox: { padding: '12px', backgroundColor: '#e9ecef', border: '1px solid #ccc', borderRadius: '5px', color: '#2c3e50', fontWeight: 'bold', fontSize: '1rem', boxSizing: 'border-box' },
  button: { backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px', transition: '0.2s', width: '100%', boxSizing: 'border-box' }
};

export default AddPrice;