import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ShopOwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [myShop, setMyShop] = useState(null);
  const [myPrices, setMyPrices] = useState([]);

  const [shopName, setShopName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhone] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchData = async () => {
    try {
      const shopRes = await axios.get('http://localhost:5000/api/shops/myshop', config);
      setMyShop(shopRes.data);
      setShopName(shopRes.data.shopName);
      setAddress(shopRes.data.address);
      setPhone(shopRes.data.phoneNumber);

      const priceRes = await axios.get('http://localhost:5000/api/prices/my-prices', config);
      setMyPrices(priceRes.data);

    } catch (error) {
      console.error("Error fetching dashboard data", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateShop = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/shops/myshop', {
        shopName, address, phoneNumber
      }, config);
      alert('Shop Details Updated!');
      fetchData();
    } catch (error) {
      alert('Error updating shop');
    }
  };

  const handleDeletePrice = async (id) => {
    if (window.confirm('Remove this item from your shop?')) {
      try {
        await axios.delete(`http://localhost:5000/api/prices/${id}`, config);
        fetchData(); 
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  if (!myShop) return <div style={{padding:'50px', textAlign:'center'}}><h2>⏳ Loading your shop...</h2><p>(If this takes too long, you might not have registered a shop yet!)</p><Link to="/register-shop">Register Shop</Link></div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🏪 My Shop</h2>
        <div style={{ marginBottom: '20px', textAlign:'center', fontSize:'0.9rem', color:'#bdc3c7' }}>
           Hello, {userInfo.name}
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('inventory')} style={itemStyle(activeTab === 'inventory')}>📦 My Inventory</button>
          <button onClick={() => setActiveTab('settings')} style={itemStyle(activeTab === 'settings')}>⚙️ Shop Settings</button>
        </nav>
      </div>

      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f6f7' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0 }}>{myShop.shopName}</h1>
            <p style={{ color: '#7f8c8d' }}>📍 {myShop.address} | 📞 {myShop.phoneNumber}</p>
            <div style={{marginTop:'5px'}}>
               Status: {myShop.status === 'approved' ? <span style={{color:'green', fontWeight:'bold'}}>✅ Approved</span> : <span style={{color:'orange', fontWeight:'bold'}}>⏳ Pending Admin Approval</span>}
            </div>
          </div>
          <Link to="/add-price" style={{ backgroundColor: '#2ecc71', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
            + Add New Item
          </Link>
        </div>

        {activeTab === 'inventory' && (
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h3>📦 Current Listings</h3>
            {myPrices.length === 0 ? <p>You haven't added any items yet.</p> : (
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ecf0f1', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Product</th>
                    <th style={{ padding: '10px' }}>Your Price</th>
                    <th style={{ padding: '10px' }}>Status</th>
                    <th style={{ padding: '10px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {myPrices.map((price) => (
                    <tr key={price._id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '10px', display:'flex', alignItems:'center', gap:'10px' }}>
                         <img src={price.product?.image || 'https://placehold.co/40'} alt="" style={{width:'40px', height:'40px', borderRadius:'5px'}}/>
                         {price.product?.name}
                      </td>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: 'green' }}>Rs. {price.price}</td>
                      <td style={{ padding: '10px' }}>
                        {price.status === 'approved' ? '✅ Live' : '⏳ Review'}
                      </td>
                      <td style={{ padding: '10px' }}>
                        <button onClick={() => handleDeletePrice(price._id)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', maxWidth: '500px' }}>
            <h3>⚙️ Edit Shop Details</h3>
            <form onSubmit={handleUpdateShop} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <label>Shop Name</label>
              <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '5px' }} />

              <label>Address</label>
              <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '5px' }} />

              <label>Phone Number</label>
              <input type="text" value={phoneNumber} onChange={(e) => setPhone(e.target.value)} style={{ padding: '10px', border: '1px solid #bdc3c7', borderRadius: '5px' }} />

              <button type="submit" style={{ backgroundColor: '#3498db', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                Save Changes
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

const itemStyle = (active) => ({
  padding: '15px', 
  cursor: 'pointer', 
  background: active ? '#34495e' : 'transparent', 
  border: 'none', 
  color: 'white', 
  textAlign: 'left', 
  fontSize: '1rem',
  borderLeft: active ? '5px solid #2ecc71' : '5px solid transparent',
  width: '100%'
});

export default ShopOwnerDashboard;