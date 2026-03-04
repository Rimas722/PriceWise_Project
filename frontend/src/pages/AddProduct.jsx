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
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center' }}>📦 Add New Product</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" 
          placeholder="Product Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          style={{ padding: '10px' }} 
          required 
        />

        <select 
          value={category} 
          onChange={(e) => {
            setCategory(e.target.value);
            setSubCategory(''); 
          }} 
          style={{ padding: '10px' }} 
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map(c => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
=
        {availableSubCategories.length > 0 && (
          <select 
            value={subCategory} 
            onChange={(e) => setSubCategory(e.target.value)} 
            style={{ padding: '10px', backgroundColor: '#ebf5fb', border: '1px solid #3498db', color: '#2980b9' }}
          >
            <option value="">-- General / No Sub-Category --</option>
            {availableSubCategories.map(sub => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        )}

        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '10px' }}>
          <option value="kg">Per Kg</option>
          <option value="packet">Per Packet</option>
          <option value="item">Per Item</option>
          <option value="l">Per Liter</option>
        </select>

        <div style={{ border: '1px dashed #ccc', padding: '10px', borderRadius: '5px' }}>
            <label>Product Image:</label>
            <input 
              type="text" 
              placeholder="Image URL" 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
              disabled 
              style={{ width: '100%', padding: '5px', marginBottom: '10px', backgroundColor: '#eee', boxSizing: 'border-box' }} 
            />
            <input 
              type="file" 
              onChange={uploadFileHandler} 
            />
            {uploading && <p style={{color:'blue'}}>Uploading to Cloud...</p>}
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: 'purple', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px' }}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;