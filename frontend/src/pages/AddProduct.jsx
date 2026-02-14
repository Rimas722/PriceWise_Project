import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('kg');
  const [image, setImage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || userInfo.role !== 'admin') {
      alert("Admins only!");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      await axios.post(
        'http://localhost:5000/api/products',
        { name, category, unit, image },
        config
      );

      alert('Product Added Successfully!');
      navigate('/'); 

    } catch (error) {
      alert('Error adding product');
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center' }}>📦 Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <input 
          type="text" placeholder="Product Name" 
          value={name} onChange={(e) => setName(e.target.value)} 
          style={{ padding: '10px' }} required 
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          style={{ padding: '10px' }} 
          required
        >
          <option value="">-- Select Category --</option>
          <option value="Rice">Rice</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Meat">Meat</option>
          <option value="Dairy">Dairy</option>
          <option value="Spices">Spices</option>
          <option value="Other">Other</option>
        </select>


        <select value={unit} onChange={(e) => setUnit(e.target.value)} style={{ padding: '10px' }}>
          <option value="kg">Per Kg</option>
          <option value="l">Per Liter</option>
          <option value="packet">Per Packet</option>
          <option value="item">Per Item</option>
        </select>

        <input 
          type="text" placeholder="Image URL (Optional)" 
          value={image} onChange={(e) => setImage(e.target.value)} 
          style={{ padding: '10px' }} 
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: 'purple', color: 'white', border: 'none', cursor: 'pointer' }}>
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;