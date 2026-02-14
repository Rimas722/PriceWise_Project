import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddPrice = () => {
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]); 
  const [selectedShop, setSelectedShop] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const shopRes = await axios.get('http://localhost:5000/api/shops');
        const productRes = await axios.get('http://localhost:5000/api/products'); 
        
        setShops(shopRes.data);
        setProducts(productRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      alert("Please login first!");
      return;
    }

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`, 
        },
      };

      await axios.post(
        'http://localhost:5000/api/prices',
        {
          shop: selectedShop,
          product: selectedProduct,
          price: price,
        },
        config
      );

      alert('Price Submitted Successfully!');
      navigate('/prices');

    } catch (error) {
      console.error(error);
      alert('Error submitting price. Are you logged in?');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={{ textAlign: 'center', marginBottom:'20px' }}>💰 Add New Price</h2>
      <form onSubmit={handleSubmit} style={styles.form}>

        <div style={styles.group}>
          <label>Select Shop:</label>
          <select value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)} style={styles.input} required>
            <option value="">-- Choose a Shop --</option>
            {shops.map(shop => (
              <option key={shop._id} value={shop._id}>{shop.shopName}</option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label>Select Product:</label>
          <select value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={styles.input} required>
            <option value="">-- Choose a Product --</option>
            {products.map(product => (
              <option key={product._id} value={product._id}>
                {product.name} ({product.unit})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.group}>
          <label>Price (LKR):</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} style={styles.input} required />
        </div>

        <button type="submit" style={styles.button}>Submit Price</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: '500px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)', borderRadius: '8px', backgroundColor: 'white' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  group: { display: 'flex', flexDirection: 'column', gap: '5px' },
  input: { padding: '10px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize:'16px' }
};

export default AddPrice;