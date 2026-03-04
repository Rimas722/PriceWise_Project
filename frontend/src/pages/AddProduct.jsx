import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState(''); 
  const [unit, setUnit] = useState('kg');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false); 
  
  const [categories, setCategories] = useState([]); 
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('https://pricewise-project.onrender.com/api/categories');
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories', error);
      }
    };
    fetchCategories();
  }, []);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; 
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      const { data } = await axios.post('https://pricewise-project.onrender.com/api/upload', formData, config);
      
      setImage(data);
      setUploading(false);
      alert("Image Uploaded!");
      
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Error uploading image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || userInfo.role !== 'admin') {
      alert("Admins only!");
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

      await axios.post(
        'https://pricewise-project.onrender.com/api/products',
        { 
          name, 
          category, 
          subCategory: subCategory || 'General',
          unit, 
          image 
        }, 
        config
      );

      alert('Product Added Successfully!');
      navigate('/admin'); 

    } catch (error) {
      alert('Error adding product');
    }
  };

  const selectedCatObj = categories.find(c => c.name === category);
  const availableSubCategories = selectedCatObj?.subCategories || [];

  return (
    <div style={{ backgroundColor: '#f4f6f7', minHeight: '100vh', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: isMobile ? '20px 10px' : '50px 20px', fontFamily: 'Arial, sans-serif' }}>
      
      <div style={{ maxWidth: '500px', width: '100%', margin: isMobile ? '0' : '0 auto', padding: isMobile ? '20px' : '30px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', boxSizing: 'border-box' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px', fontSize: isMobile ? '1.5rem' : '2rem' }}>📦 Add New Product</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <input 
            type="text" 
            placeholder="Product Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} 
            required 
          />

          <select 
            value={category} 
            onChange={(e) => {
              setCategory(e.target.value);
              setSubCategory(''); 
            }} 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }} 
            required
          >
            <option value="">-- Select Category --</option>
            {categories.map(c => (
              <option key={c._id} value={c.name}>{c.name}</option>
            ))}
          </select>
          
          {availableSubCategories.length > 0 && (
            <select 
              value={subCategory} 
              onChange={(e) => setSubCategory(e.target.value)} 
              style={{ padding: '12px', backgroundColor: '#ebf5fb', border: '1px solid #3498db', color: '#2980b9', borderRadius: '5px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}
            >
              <option value="">-- General / No Sub-Category --</option>
              {availableSubCategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
          )}

          <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '1rem', width: '100%', boxSizing: 'border-box' }}>
            <option value="kg">Per Kg</option>
            <option value="packet">Per Packet</option>
            <option value="item">Per Item</option>
            <option value="l">Per Liter</option>
          </select>

          <div style={{ border: '1px dashed #ccc', padding: '15px', borderRadius: '5px', backgroundColor: '#f8f9fa', boxSizing: 'border-box' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px', color: '#34495e' }}>Product Image:</label>
              <input 
                type="text" 
                placeholder="Image URL" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                disabled 
                style={{ width: '100%', padding: '10px', marginBottom: '10px', backgroundColor: '#eee', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
              />
              <input 
                type="file" 
                onChange={uploadFileHandler} 
                style={{ width: '100%', boxSizing: 'border-box' }}
              />
              {uploading && <p style={{color:'#3498db', marginTop: '10px', fontWeight: 'bold'}}>⏳ Uploading to Cloud...</p>}
          </div>

          <button type="submit" style={{ padding: isMobile ? '12px' : '15px', backgroundColor: '#8e44ad', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px', fontSize: isMobile ? '1rem' : '1.1rem', marginTop: '10px', width: '100%', boxSizing: 'border-box' }}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;