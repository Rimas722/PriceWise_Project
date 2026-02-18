import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('shops');

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prices, setPrices] = useState([]);
  const [shops, setShops] = useState([]);
  const [reports, setReports] = useState([]);

  const [editingProduct, setEditingProduct] = useState(null);
  const [newImage, setNewImage] = useState('');
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const [editingShop, setEditingShop] = useState(null);
  const [editShopName, setEditShopName] = useState('');
  const [editShopAddress, setEditShopAddress] = useState('');

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

  const fetchAll = async () => {
    try {
      const prodRes = await axios.get('http://localhost:5000/api/products');
      const catRes = await axios.get('http://localhost:5000/api/categories');
      const priceRes = await axios.get('http://localhost:5000/api/prices/all', config);
      const shopRes = await axios.get('http://localhost:5000/api/shops/all', config);
      const reportRes = await axios.get('http://localhost:5000/api/reports', config);
      
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setPrices(priceRes.data);
      setShops(shopRes.data);
      setReports(reportRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setNewImage(data);
      setUploading(false);
    } catch (error) {
      alert('Upload failed');
      setUploading(false);
    }
  };


  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, {
        image: newImage || editingProduct.image,
        name: newName || editingProduct.name
      }, config);
      alert('Product Updated!');
      setEditingProduct(null);
      fetchAll();
    } catch (error) {
      alert('Error updating product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('WARNING: Deleting this product will remove it from all price listings. Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`, config);
        alert('Product Deleted');
        fetchAll();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleApproveShop = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/shops/${id}/approve`, {}, config);
      alert("Shop Approved!");
      fetchAll();
    } catch (error) {
      alert("Error approving shop");
    }
  };

  const handleUpdateShop = async () => {
    try {
      await axios.put(`http://localhost:5000/api/shops/${editingShop._id}`, {
        shopName: editShopName,
        address: editShopAddress
      }, config);
      alert("Shop Updated!");
      setEditingShop(null);
      fetchAll();
    } catch (error) {
      alert("Error updating shop");
    }
  };

  const handleDeleteShop = async (id) => {
    if (window.confirm('WARNING: Deleting this shop will DELETE ALL PRICES associated with it. Are you sure?')) {
      try {
        await axios.delete(`http://localhost:5000/api/shops/${id}`, config);
        alert('Shop Deleted');
        fetchAll();
      } catch (error) {
        alert('Error deleting shop');
      }
    }
  };

  const openShopEditModal = (shop) => {
    setEditingShop(shop);
    setEditShopName(shop.shopName);
    setEditShopAddress(shop.address);
  };

  const handleAddCategory = async () => {
    if (!newCategory) return;
    try {
      await axios.post('http://localhost:5000/api/categories', { name: newCategory }, config);
      setNewCategory('');
      fetchAll();
    } catch (error) {
      alert('Category already exists or error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
        fetchAll();
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  const handleApprovePrice = async (id) => {
    await axios.put(`http://localhost:5000/api/prices/${id}/approve`, {}, config);
    fetchAll();
  };
  
  const handleDeletePrice = async (id) => {
    if(window.confirm("Delete this price listing?")) {
      await axios.delete(`http://localhost:5000/api/prices/${id}`, config);
      fetchAll();
    }
  };

  const handleDismissReport = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reports/${id}`, config);
      fetchAll();
    } catch (error) {
      alert("Error dismissing report");
    }
  };


  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>🛡️ Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('prices')} style={itemStyle(activeTab === 'prices')}>✅ Price Approvals</button>
          <button onClick={() => setActiveTab('shops')} style={itemStyle(activeTab === 'shops')}>🏪 Manage Shops</button>
          <button onClick={() => setActiveTab('products')} style={itemStyle(activeTab === 'products')}>📦 Manage Products</button>
          <button onClick={() => setActiveTab('categories')} style={itemStyle(activeTab === 'categories')}>🏷️ Manage Categories</button>
          <button onClick={() => setActiveTab('reports')} style={itemStyle(activeTab === 'reports')}>🚩 View Reports</button>
        </nav>
      </div>

      <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f6f7', overflowY: 'auto' }}>
        
        {/* TAB 1: PRICE APPROVALS */}
        {activeTab === 'prices' && (
          <div>
            <h1>💰 Pending Price Approvals</h1>
            {prices.filter(p => p.status === 'pending').length === 0 ? <p>No pending prices.</p> : 
              <table style={tableStyle}>
                <thead><tr style={{background:'#ddd'}}><th>Product</th><th>Shop</th><th>Price</th><th>Action</th></tr></thead>
                <tbody>
                  {prices.filter(p => p.status === 'pending').map(p => (
                    <tr key={p._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px'}}>{p.product?.name}</td>
                      <td style={{padding:'10px'}}>{p.shop?.shopName}</td>
                      <td style={{padding:'10px'}}>Rs. {p.price}</td>
                      <td style={{padding:'10px'}}>
                        <button onClick={() => handleApprovePrice(p._id)} style={btnGreen}>Approve</button>
                        <button onClick={() => handleDeletePrice(p._id)} style={btnRed}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
          </div>
        )}

        {/* TAB 2: MANAGE SHOPS*/}
        {activeTab === 'shops' && (
          <div>
             <h1>🏪 Manage Shops</h1>
             <table style={tableStyle}>
                <thead><tr style={{background:'#ddd'}}><th>Shop Name</th><th>Address</th><th>Owner</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {shops.map(shop => (
                    <tr key={shop._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px', fontWeight:'bold'}}>{shop.shopName}</td>
                      <td style={{padding:'10px', color:'#555'}}>{shop.address}</td>
                      <td style={{padding:'10px'}}>{shop.owner?.name}</td>
                      <td style={{padding:'10px'}}>{shop.status === 'approved' ? '✅ Active' : '⏳ Pending'}</td>
                      <td style={{padding:'10px'}}>
                        {shop.status === 'pending' && (
                          <button onClick={() => handleApproveShop(shop._id)} style={{...btnGreen, marginRight:'10px'}}>Approve</button>
                        )}
                        <button onClick={() => openShopEditModal(shop)} style={{...btnBlue, marginRight:'10px'}}>Edit</button>
                        <button onClick={() => handleDeleteShop(shop._id)} style={btnRed}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>

             {/* SHOP EDIT MODAL */}
             {editingShop && (
              <div style={modalStyle}>
                <div style={{background:'white', padding:'30px', borderRadius:'10px', width:'400px', textAlign:'center', boxShadow:'0 5px 15px rgba(0,0,0,0.3)'}}>
                  <h3>Edit Shop Details</h3>
                  
                  <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Shop Name:</label>
                  <input 
                    type="text" 
                    value={editShopName} 
                    onChange={(e) => setEditShopName(e.target.value)} 
                    style={{width:'100%', padding:'10px', marginBottom:'20px', border:'1px solid #ccc', borderRadius:'5px'}}
                  />

                  <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Address:</label>
                  <input 
                    type="text" 
                    value={editShopAddress} 
                    onChange={(e) => setEditShopAddress(e.target.value)} 
                    style={{width:'100%', padding:'10px', marginBottom:'20px', border:'1px solid #ccc', borderRadius:'5px'}}
                  />
                  
                  <div style={{marginTop:'30px', display:'flex', justifyContent:'center', gap:'10px'}}>
                    <button onClick={handleUpdateShop} style={btnGreen}>Save Changes</button>
                    <button onClick={() => setEditingShop(null)} style={btnRed}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MANAGE PRODUCTS */}
        {activeTab === 'products' && (
          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
               <h1>📦 Manage Products</h1>
               <a href="/add-product" style={btnBlue}>+ Create New Product</a>
            </div>
            <table style={tableStyle}>
              <thead><tr style={{background:'#ddd'}}><th>Image</th><th>Name</th><th>Category</th><th>Action</th></tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id} style={{borderBottom:'1px solid #eee'}}>
                    <td style={{padding:'10px'}}>
                      <img src={p.image || 'https://placehold.co/50'} alt="" style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px'}} />
                    </td>
                    <td style={{padding:'10px', fontWeight:'bold'}}>{p.name}</td>
                    <td style={{padding:'10px'}}>{p.category}</td>
                    <td style={{padding:'10px'}}>
                      <button onClick={() => { setEditingProduct(p); setNewImage(p.image); setNewName(p.name); }} style={btnBlue}>Edit</button>
                      <button onClick={() => handleDeleteProduct(p._id)} style={{...btnRed, marginLeft:'10px'}}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* EDIT PRODUCT MODAL */}
            {editingProduct && (
              <div style={modalStyle}>
                <div style={{background:'white', padding:'30px', borderRadius:'10px', width:'400px', textAlign:'center', boxShadow:'0 5px 15px rgba(0,0,0,0.3)'}}>
                  <h3>Edit Product</h3>
                  
                  <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Product Name:</label>
                  <input 
                    type="text" 
                    value={newName} 
                    onChange={(e) => setNewName(e.target.value)} 
                    style={{width:'100%', padding:'10px', marginBottom:'20px', border:'1px solid #ccc', borderRadius:'5px'}}
                  />

                  <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Product Image:</label>
                  <img src={newImage || editingProduct.image || 'https://placehold.co/100'} alt="" style={{width:'100px', height:'100px', objectFit:'cover', marginBottom:'10px', borderRadius:'5px', border:'1px solid #ddd'}} />
                  <br/>
                  <input type="file" onChange={uploadFileHandler} style={{marginTop:'10px'}}/>
                  {uploading && <p style={{color:'blue'}}>Uploading to Cloud...</p>}
                  
                  <div style={{marginTop:'30px', display:'flex', justifyContent:'center', gap:'10px'}}>
                    <button onClick={handleUpdateProduct} style={btnGreen}>Save Changes</button>
                    <button onClick={() => setEditingProduct(null)} style={btnRed}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MANAGE CATEGORIES */}
        {activeTab === 'categories' && (
          <div>
            <h1>🏷️ Manage Categories</h1>
            <div style={{marginBottom:'20px', display:'flex', gap:'10px'}}>
              <input 
                value={newCategory} 
                onChange={(e) => setNewCategory(e.target.value)} 
                placeholder="New Category Name" 
                style={{padding:'10px', width:'300px', borderRadius:'5px', border:'1px solid #ccc'}}
              />
              <button onClick={handleAddCategory} style={btnBlue}>+ Add Category</button>
            </div>
            <div style={{background:'white', padding:'20px', borderRadius:'10px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
              <ul style={{listStyle:'none', padding:0}}>
                {categories.map(c => (
                   <li key={c._id} style={{padding:'10px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                      <span style={{fontWeight:'bold', fontSize:'1.1rem'}}>{c.name}</span>
                      <button onClick={() => handleDeleteCategory(c._id)} style={btnRed}>Delete</button>
                   </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <h1>🚩 Reported Items</h1>
            {reports.length === 0 ? <p>No reports currently.</p> :
              <table style={tableStyle}>
                <thead><tr style={{background:'#d63031', color:'white'}}><th>Item</th><th>Reason</th><th>Reported By</th><th>Action</th></tr></thead>
                <tbody>
                  {reports.map(r => (
                    <tr key={r._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'10px'}}>
                        {r.price?.product?.name} (Rs. {r.price?.price})<br/>
                        <small>{r.price?.shop?.shopName}</small>
                      </td>
                      <td style={{padding:'10px', color:'red'}}>{r.reason}</td>
                      <td style={{padding:'10px'}}>{r.reportedBy?.name}</td>
                      <td style={{padding:'10px'}}>
                         <button onClick={() => handleDeletePrice(r.price?._id)} style={{...btnRed, marginRight:'10px'}}>Delete Price</button>
                         <button onClick={() => handleDismissReport(r._id)} style={{padding:'5px 10px', background:'gray', color:'white', border:'none', cursor:'pointer'}}>Ignore</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            }
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
  borderLeft: active ? '5px solid #3498db' : '5px solid transparent',
  transition: '0.2s'
});

const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white', boxShadow:'0 2px 10px rgba(0,0,0,0.1)', borderRadius:'8px', overflow:'hidden' };
const btnGreen = { padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', fontWeight:'bold' };
const btnRed = { padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', fontWeight:'bold' };
const btnBlue = { padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', fontWeight:'bold' };
const modalStyle = { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000 };

export default AdminDashboard;