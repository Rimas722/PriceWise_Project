import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [proofImage, setProofImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const navigate = useNavigate();
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const { data: favData } = await axios.get('http://localhost:5000/api/users/favorites', config);
        setFavorites(favData.filter(item => item && item.product));
        
        const { data: prodData } = await axios.get('http://localhost:5000/api/products');
        const { data: shopData } = await axios.get('http://localhost:5000/api/shops'); 
        
        setProducts(prodData);
        setShops(shopData.filter(shop => shop.status === 'approved')); 

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const removeFavorite = async (priceId) => {
    try {
      await axios.post('http://localhost:5000/api/users/favorites', { priceId }, config);
      setFavorites(favorites.filter(item => item._id !== priceId));
    } catch (error) {
      alert("Error removing item.");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProofImage(data);
      setUploading(false);
    } catch (error) {
      alert('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  const handleSubmitPrice = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !selectedShop || !newPrice) {
      return alert('Please fill in the Product, Shop, and Price.');
    }

    try {
      await axios.post('http://localhost:5000/api/prices', {
        product: selectedProduct,
        shop: selectedShop,
        price: Number(newPrice),
        proofImage: proofImage 
      }, config);
      
      alert('🎉 Thank you! Your price submission is now Pending Admin Approval.');
      
      setShowModal(false);
      setSelectedProduct('');
      setSelectedShop('');
      setNewPrice('');
      setProofImage('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error submitting price. You might not be authorized.');
    }
  };

  if (loading) return <div style={{textAlign: 'center', marginTop: '50px'}}>⏳ Loading your Dashboard...</div>;

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', padding: '40px 20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ backgroundColor: '#2c3e50', color: 'white', padding: '30px', borderRadius: '10px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0' }}>👋 Hello, {userInfo.name}</h1>
            <p style={{ margin: 0, color: '#bdc3c7' }}>Welcome to your Consumer Dashboard.</p>
          </div>
          <button onClick={() => setShowModal(true)} style={btnPrimary}>
            + Submit a New Price
          </button>
        </div>

        <h2 style={{ color: '#2c3e50', borderBottom: '2px solid #3498db', paddingBottom: '10px', display: 'inline-block' }}>
          ❤️ My Watchlist
        </h2>

        {favorites.length === 0 ? (
          <div style={{ backgroundColor: 'white', padding: '40px', textAlign: 'center', borderRadius: '10px', marginTop: '20px' }}>
            <h3 style={{ color: '#7f8c8d' }}>Your Watchlist is empty.</h3>
            <Link to="/prices" style={{ display: 'inline-block', marginTop: '15px', backgroundColor: '#3498db', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>
              Browse Prices
            </Link>
          </div>
        ) : (
          <div style={gridStyle}>
            {favorites.map((item) => (
              <div key={item._id} style={cardStyle}>
                <img src={item.product?.image || 'https://placehold.co/300x200'} alt={item.product?.name} style={imageStyle} />
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>{item.product?.name}</h3>
                  <div style={{ color: '#7f8c8d', fontSize: '0.9rem', marginBottom: '15px' }}>
                    🏪 <strong>{item.shop?.shopName}</strong>
                  </div>
                  <div style={{ marginTop: 'auto', fontSize: '1.5rem', fontWeight: 'bold', color: '#27ae60' }}>
                    Rs. {item.price}
                  </div>
                </div>
                <button onClick={() => removeFavorite(item._id)} style={removeBtnStyle}>❌ Remove</button>
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div style={modalOverlayStyle}>
            <div style={modalContentStyle}>
              <h2 style={{ marginTop: 0, color: '#2c3e50' }}>📸 Report a Price</h2>
              <p style={{ color: '#7f8c8d', marginBottom: '20px', fontSize: '0.9rem' }}>
                Help the community by submitting a new price. An Admin will verify your submission.
              </p>

              <form onSubmit={handleSubmitPrice} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <div>
                  <label style={labelStyle}>Select Product:</label>
                  <select required value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} style={inputStyle}>
                    <option value="">-- Choose Product --</option>
                    {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Select Shop:</label>
                  <select required value={selectedShop} onChange={(e) => setSelectedShop(e.target.value)} style={inputStyle}>
                    <option value="">-- Choose Shop --</option>
                    {shops.map(s => <option key={s._id} value={s._id}>{s.shopName} - {s.address}</option>)}
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Price Found (Rs.):</label>
                  <input required type="number" min="1" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="e.g. 250" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Upload Photo Proof (Receipt/Tag):</label>
                  <input type="file" onChange={uploadFileHandler} style={{ width: '100%', padding: '5px' }} />
                  {uploading && <p style={{ color: '#3498db', fontSize: '0.9rem', margin: '5px 0 0 0' }}>⏳ Uploading image...</p>}
                  {proofImage && <img src={proofImage} alt="Proof" style={{ width: '100px', marginTop: '10px', borderRadius: '5px' }} />}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button type="submit" disabled={uploading} style={{ ...btnPrimary, flex: 1, opacity: uploading ? 0.7 : 1 }}>
                    Submit to Admin
                  </button>
                  <button type="button" onClick={() => setShowModal(false)} style={btnCancel}>
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const gridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' };
const cardStyle = { backgroundColor: 'white', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' };
const imageStyle = { width: '100%', height: '180px', objectFit: 'cover', borderBottom: '1px solid #f1f2f6' };
const removeBtnStyle = { width: '100%', padding: '12px', border: 'none', backgroundColor: '#ffeaa7', color: '#d35400', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' };

const btnPrimary = { backgroundColor: '#3498db', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' };
const btnCancel = { backgroundColor: '#e74c3c', color: 'white', padding: '12px 20px', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem', flex: 1 };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' };
const modalContentStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#34495e', fontSize: '0.95rem' };
const inputStyle = { width: '100%', padding: '10px', border: '1px solid #bdc3c7', borderRadius: '5px', fontSize: '1rem' };

export default UserDashboard;