import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); 

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [prices, setPrices] = useState([]);
  const [shops, setShops] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]); 

  const [editingProduct, setEditingProduct] = useState(null);
  const [newImage, setNewImage] = useState('');
  const [newName, setNewName] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [subCategory, setSubCategory] = useState(''); 
  const [uploading, setUploading] = useState(false);
  
  const [newCategory, setNewCategory] = useState('');
  const [subCategoryInputs, setSubCategoryInputs] = useState({});

  const [editingShop, setEditingShop] = useState(null);
  const [editShopName, setEditShopName] = useState('');
  const [editShopAddress, setEditShopAddress] = useState('');

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchAll = async () => {
    try {
      const prodRes = await axios.get('https://pricewise-project.onrender.com/api/products');
      const catRes = await axios.get('https://pricewise-project.onrender.com/api/categories');
      const priceRes = await axios.get('https://pricewise-project.onrender.com/api/prices/all', config);
      const shopRes = await axios.get('https://pricewise-project.onrender.com/api/shops/all', config);
      const reportRes = await axios.get('https://pricewise-project.onrender.com/api/reports', config);
      const userRes = await axios.get('https://pricewise-project.onrender.com/api/users', config); 
      
      setProducts(prodRes.data);
      setCategories(catRes.data);
      setPrices(priceRes.data);
      setShops(shopRes.data);
      setReports(reportRes.data);
      setUsers(userRes.data); 
    } catch (error) {
      console.error("Error fetching admin data", error);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleDeleteUser = async (id) => {
    if (window.confirm('🚨 WARNING: Are you sure you want to permanently delete this user?')) {
      try {
        await axios.delete(`https://pricewise-project.onrender.com/api/users/${id}`, config);
        alert('User Deleted Successfully');
        fetchAll(); 
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting user');
      }
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('https://pricewise-project.onrender.com/api/upload', formData, {
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
      await axios.put(`https://pricewise-project.onrender.com/api/products/${editingProduct._id}`, {
        image: newImage || editingProduct.image,
        name: newName || editingProduct.name,
        category: editCategory || editingProduct.category,
        subCategory: subCategory 
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
        await axios.delete(`https://pricewise-project.onrender.com/api/products/${id}`, config);
        alert('Product Deleted');
        fetchAll();
      } catch (error) {
        alert('Error deleting product');
      }
    }
  };

  const handleApproveShop = async (id) => {
    try {
      await axios.put(`https://pricewise-project.onrender.com/api/shops/${id}/approve`, {}, config);
      alert("Shop Approved!");
      fetchAll();
    } catch (error) {
      alert("Error approving shop");
    }
  };

  const handleUpdateShop = async () => {
    try {
      await axios.put(`https://pricewise-project.onrender.com/api/shops/${editingShop._id}`, {
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
        await axios.delete(`https://pricewise-project.onrender.com/api/shops/${id}`, config);
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
      await axios.post('https://pricewise-project.onrender.com/api/categories', { name: newCategory }, config);
      setNewCategory('');
      fetchAll();
    } catch (error) {
      alert('Category already exists or error');
    }
  };

  const handleAddSubCategory = async (categoryId) => {
    const subCatName = subCategoryInputs[categoryId];
    if (!subCatName) return;
    try {
      await axios.put(`https://pricewise-project.onrender.com/api/categories/${categoryId}/subcategory`, { subCategory: subCatName }, config);
      setSubCategoryInputs({ ...subCategoryInputs, [categoryId]: '' }); 
      fetchAll();
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding sub-category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      try {
        await axios.delete(`https://pricewise-project.onrender.com/api/categories/${id}`, config);
        fetchAll();
      } catch (error) {
        alert('Error deleting category');
      }
    }
  };

  const handleApprovePrice = async (id) => {
    await axios.put(`https://pricewise-project.onrender.com/api/prices/${id}/approve`, {}, config);
    fetchAll();
  };
  
  const handleDeletePrice = async (id) => {
    if(window.confirm("Delete this price listing?")) {
      await axios.delete(`https://pricewise-project.onrender.com/api/prices/${id}`, config);
      fetchAll();
    }
  };

  const handleDismissReport = async (id) => {
    try {
      await axios.delete(`https://pricewise-project.onrender.com/api/reports/${id}`, config);
      fetchAll();
    } catch (error) {
      alert("Error dismissing report");
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `https://pricewise-project.onrender.com${imagePath}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>

      <div style={{ 
        width: isMobile ? '100%' : '250px', 
        backgroundColor: '#2c3e50', 
        color: 'white', 
        padding: '20px', 
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column', 
        overflowX: isMobile ? 'auto' : 'visible',
        whiteSpace: isMobile ? 'nowrap' : 'normal',
        borderBottom: isMobile ? '2px solid #34495e' : 'none'
      }}>
        {!isMobile && <h2 style={{ textAlign: 'center', marginBottom: '40px' }}>🛡️ Admin</h2>}
        <nav style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', gap: '10px' }}>
          <button onClick={() => setActiveTab('users')} style={itemStyle(activeTab === 'users', isMobile)}>👥 Users</button>
          <button onClick={() => setActiveTab('prices')} style={itemStyle(activeTab === 'prices', isMobile)}>✅ Approvals</button>
          <button onClick={() => setActiveTab('shops')} style={itemStyle(activeTab === 'shops', isMobile)}>🏪 Shops</button>
          <button onClick={() => setActiveTab('products')} style={itemStyle(activeTab === 'products', isMobile)}>📦 Products</button>
          <button onClick={() => setActiveTab('categories')} style={itemStyle(activeTab === 'categories', isMobile)}>🏷️ Categories</button>
          <button onClick={() => setActiveTab('reports')} style={itemStyle(activeTab === 'reports', isMobile)}>🚩 Reports</button>
        </nav>
      </div>

      <div style={{ flex: 1, padding: isMobile ? '15px' : '40px', backgroundColor: '#f4f6f7', overflowY: 'auto', maxWidth: '100vw' }}>

        {activeTab === 'users' && (
          <div>
            <div style={{...headerFlexStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center'}}>
               <h1 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '1.5rem' : '2rem' }}>👥 Manage Users</h1>
            </div>
            <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <table style={tableStyle}>
                <thead><tr style={{background:'#ddd', textAlign: 'left'}}>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Name</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Email</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Role</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Points</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Action</th>
                </tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'15px', fontWeight: 'bold', whiteSpace:'nowrap'}}>{u.name}</td>
                      <td style={{padding:'15px', color: '#555'}}>{u.email}</td>
                      <td style={{padding:'15px'}}>
                        <span style={{ padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', fontWeight: 'bold', backgroundColor: u.role === 'admin' ? '#e74c3c' : u.role === 'shop_owner' ? '#f39c12' : '#3498db', color: 'white' }}>
                          {u.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td style={{padding:'15px'}}>{u.points || 0}</td>
                      <td style={{padding:'15px'}}>
                        {u.role !== 'admin' ? (
                          <button onClick={() => handleDeleteUser(u._id)} style={btnRed}>Delete</button>
                        ) : (
                          <span style={{ color: '#95a5a6', fontStyle: 'italic', fontSize: '0.9rem' }}>Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'prices' && (
          <div>
            <div style={{...headerFlexStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px'}}>
               <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem' }}>💰 Pending Approvals</h1>
               <a href="/add-price" style={{ ...btnBlue, textDecoration: 'none', width: isMobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>+ Add Live Price</a>
            </div>
            {prices.filter(p => p.status === 'pending').length === 0 ? <p style={{color: '#7f8c8d'}}>No pending prices waiting for approval.</p> : 
              <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
                <table style={tableStyle}>
                  <thead><tr style={{background:'#ddd', textAlign: 'left'}}>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Product</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Shop</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Price</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Proof</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Action</th>
                  </tr></thead>
                  <tbody>
                    {prices.filter(p => p.status === 'pending').map(p => (
                    <tr key={p._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'15px', fontWeight: 'bold', whiteSpace:'nowrap'}}>{p.product?.name}</td>
                      <td style={{padding:'15px', color: '#555', whiteSpace:'nowrap'}}>{p.shop?.shopName}</td>
                      <td style={{padding:'15px', color: '#27ae60', fontWeight: 'bold'}}>Rs. {p.price}</td>
                      <td style={{padding:'15px'}}>
                        {p.proofImage ? (
                          <a href={getImageUrl(p.proofImage)} target="_blank" rel="noopener noreferrer">
                            <img src={getImageUrl(p.proofImage)} alt="Proof" style={{ width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px' }} />
                          </a>
                        ) : <span style={{color: '#95a5a6', fontSize: '0.85rem'}}>No Photo</span>}
                      </td>
                      <td style={{padding:'15px', display:'flex', gap:'5px'}}>
                        <button onClick={() => handleApprovePrice(p._id)} style={btnGreen}>Approve</button>
                        <button onClick={() => handleDeletePrice(p._id)} style={btnRed}>Reject</button>
                      </td>
                    </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        )}

        {activeTab === 'shops' && (
          <div>
             <div style={{...headerFlexStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center'}}>
               <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem' }}>🏪 Manage Shops</h1>
             </div>
             <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
               <table style={tableStyle}>
                  <thead><tr style={{background:'#ddd', textAlign: 'left'}}>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Shop Name</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Owner</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Status</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Action</th>
                  </tr></thead>
                  <tbody>
                    {shops.map(shop => (
                      <tr key={shop._id} style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'15px', fontWeight:'bold', whiteSpace:'nowrap'}}>{shop.shopName}</td>
                        <td style={{padding:'15px', whiteSpace:'nowrap'}}>{shop.owner?.name}</td>
                        <td style={{padding:'15px'}}>{shop.status === 'approved' ? '✅ Active' : '⏳ Pending'}</td>
                        <td style={{padding:'15px', display:'flex', gap:'5px'}}>
                          {shop.status === 'pending' && <button onClick={() => handleApproveShop(shop._id)} style={btnGreen}>Approve</button>}
                          <button onClick={() => openShopEditModal(shop)} style={btnBlue}>Edit</button>
                          <button onClick={() => handleDeleteShop(shop._id)} style={btnRed}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
             </div>

             {editingShop && (
              <div style={modalStyle}>
                <div style={{...modalContentStyle, width: isMobile ? '90%' : '400px'}}>
                  <h3>Edit Shop Details</h3>
                  <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Shop Name:</label>
                  <input type="text" value={editShopName} onChange={(e) => setEditShopName(e.target.value)} style={inputFieldStyle} />
                  <label style={{display:'block', textAlign:'left', fontWeight:'bold', marginBottom:'5px'}}>Address:</label>
                  <input type="text" value={editShopAddress} onChange={(e) => setEditShopAddress(e.target.value)} style={inputFieldStyle} />
                  <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                    <button onClick={handleUpdateShop} style={{...btnGreen, flex: 1}}>Save</button>
                    <button onClick={() => setEditingShop(null)} style={{...btnRed, flex: 1}}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div style={{...headerFlexStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: '10px'}}>
               <h1 style={{ margin: 0, fontSize: isMobile ? '1.5rem' : '2rem' }}>📦 Manage Products</h1>
               <a href="/add-product" style={{ ...btnBlue, textDecoration: 'none', width: isMobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>+ Create New Product</a>
            </div>
            <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <table style={tableStyle}>
                <thead><tr style={{background:'#ddd', textAlign: 'left'}}>
                  <th style={{padding:'15px'}}>Image</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Name</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Category</th>
                  <th style={{padding:'15px', whiteSpace:'nowrap'}}>Action</th>
                </tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} style={{borderBottom:'1px solid #eee'}}>
                      <td style={{padding:'15px'}}><img src={getImageUrl(p.image) || 'https://placehold.co/50'} alt="" style={{width:'50px', height:'50px', objectFit:'cover', borderRadius:'5px'}} /></td>
                      <td style={{padding:'15px', fontWeight:'bold', whiteSpace:'nowrap'}}>{p.name}</td>
                      <td style={{padding:'15px', whiteSpace:'nowrap'}}>{p.category}</td>
                      <td style={{padding:'15px', display:'flex', gap:'5px'}}>
                        <button onClick={() => { setEditingProduct(p); setNewImage(p.image); setNewName(p.name); setEditCategory(p.category); setSubCategory(p.subCategory || ''); }} style={btnBlue}>Edit</button>
                        <button onClick={() => handleDeleteProduct(p._id)} style={btnRed}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {editingProduct && (
              <div style={modalStyle}>
                <div style={{...modalContentStyle, width: isMobile ? '90%' : '400px'}}>
                  <h3>Edit Product</h3>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={inputFieldStyle} />
                  <img src={getImageUrl(newImage) || getImageUrl(editingProduct.image) || 'https://placehold.co/100'} alt="" style={{width:'100px', height:'100px', objectFit:'cover', marginBottom:'10px', borderRadius:'5px'}} />
                  <input type="file" onChange={uploadFileHandler} style={{width:'100%', marginBottom: '15px'}}/>
                  <select value={editCategory} onChange={(e) => { setEditCategory(e.target.value); setSubCategory(''); }} style={inputFieldStyle}>
                    <option value="">-- Category --</option>
                    {categories.map(c => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                  <select value={subCategory} onChange={(e) => setSubCategory(e.target.value)} style={inputFieldStyle}>
                    <option value="">-- Sub-Category --</option>
                    {categories.find(c => c.name === editCategory)?.subCategories?.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                  </select>
                  <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                    <button onClick={handleUpdateProduct} style={{...btnGreen, flex:1}}>Save</button>
                    <button onClick={() => setEditingProduct(null)} style={{...btnRed, flex:1}}>Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'categories' && (
          <div>
            <div style={{...headerFlexStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center'}}>
               <h1 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '1.5rem' : '2rem' }}>🏷️ Manage Categories</h1>
            </div>
            <div style={{marginBottom:'20px', display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:'10px'}}>
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New Main Category" style={{padding:'12px', flex:1, borderRadius:'5px', border:'1px solid #ccc', boxSizing:'border-box'}} />
              <button onClick={handleAddCategory} style={{...btnBlue, width: isMobile ? '100%' : 'auto'}}>+ Add Category</button>
            </div>
            <div style={{background:'white', padding: isMobile ? '10px' : '20px', borderRadius:'10px', boxShadow:'0 2px 5px rgba(0,0,0,0.1)'}}>
              <ul style={{listStyle:'none', padding:0, margin: 0}}>
                {categories.map(c => (
                   <li key={c._id} style={{padding:'15px 10px', borderBottom:'1px solid #eee', display:'flex', flexDirection: 'column'}}>
                      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                        <span style={{fontWeight:'bold', fontSize:'1.1rem', color: '#2c3e50'}}>{c.name}</span>
                        <button onClick={() => handleDeleteCategory(c._id)} style={btnRed}>Delete</button>
                      </div>
                      <div style={{marginTop: '15px', paddingLeft: isMobile ? '5px' : '20px', borderLeft: '3px solid #3498db'}}>
                        <div style={{display:'flex', flexDirection: isMobile ? 'column' : 'row', gap:'10px', marginBottom: '10px'}}>
                          <input placeholder="Add Sub-Category" value={subCategoryInputs[c._id] || ''} onChange={(e) => setSubCategoryInputs({...subCategoryInputs, [c._id]: e.target.value})} style={{padding: '8px', borderRadius: '4px', border: '1px solid #bdc3c7', flex: 1, boxSizing:'border-box'}} />
                          <button onClick={() => handleAddSubCategory(c._id)} style={{...btnBlue, padding: '8px 15px'}}>Add Sub</button>
                        </div>
                        <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                          {c.subCategories?.map(sub => <span key={sub} style={{background: '#ecf0f1', padding: '5px 10px', borderRadius: '15px', fontSize: '0.85rem', border: '1px solid #bdc3c7'}}>{sub}</span>)}
                        </div>
                      </div>
                   </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            <div style={{...headerFlexStyle, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center'}}>
               <h1 style={{ margin: '0 0 10px 0', fontSize: isMobile ? '1.5rem' : '2rem' }}>🚩 Reported Items</h1>
            </div>
            {reports.length === 0 ? <p style={{color: '#7f8c8d'}}>No reports currently.</p> :
              <div style={{ overflowX: 'auto', borderRadius: '8px', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
                <table style={tableStyle}>
                  <thead><tr style={{background:'#d63031', color:'white', textAlign: 'left'}}>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Item</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Reason</th>
                    <th style={{padding:'15px', whiteSpace:'nowrap'}}>Action</th>
                  </tr></thead>
                  <tbody>
                    {reports.map(r => (
                      <tr key={r._id} style={{borderBottom:'1px solid #eee'}}>
                        <td style={{padding:'15px', whiteSpace:'nowrap'}}>
                          <strong>{r.price?.product?.name}</strong><br/>
                          <small>{r.price?.shop?.shopName}</small>
                        </td>
                        <td style={{padding:'15px', color:'red', fontWeight: 'bold'}}>{r.reason}</td>
                        <td style={{padding:'15px', display:'flex', gap:'5px'}}>
                           <button onClick={() => handleDeletePrice(r.price?._id)} style={btnRed}>Delete</button>
                           <button onClick={() => handleDismissReport(r._id)} style={{padding:'10px', background:'#95a5a6', color:'white', border:'none', borderRadius: '5px', fontWeight: 'bold'}}>Ignore</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            }
          </div>
        )}

      </div>
    </div>
  );
};

const itemStyle = (active, isMobile) => ({
  padding: '15px', 
  cursor: 'pointer', 
  background: active ? '#34495e' : 'transparent', 
  border: 'none', 
  color: 'white', 
  textAlign: isMobile ? 'center' : 'left', 
  fontSize: '1rem', 
  borderLeft: (!isMobile && active) ? '5px solid #3498db' : '5px solid transparent', 
  borderBottom: (isMobile && active) ? '5px solid #3498db' : '5px solid transparent',
  transition: '0.2s',
  whiteSpace: 'nowrap'
});

const headerFlexStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '10px', borderBottom: '2px solid #ecf0f1' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', background: 'white' };
const inputFieldStyle = { width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box' };
const btnGreen = { padding: '10px 20px', background: '#2ecc71', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', fontWeight:'bold' };
const btnRed = { padding: '10px 20px', background: '#e74c3c', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', fontWeight:'bold' };
const btnBlue = { padding: '10px 20px', background: '#3498db', color: 'white', border: 'none', borderRadius:'5px', cursor: 'pointer', fontWeight:'bold' };
const modalStyle = { position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000, padding: '20px', boxSizing:'border-box' };
const modalContentStyle = { background:'white', padding:'30px', borderRadius:'10px', textAlign:'center', boxShadow:'0 5px 15px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' };

export default AdminDashboard;