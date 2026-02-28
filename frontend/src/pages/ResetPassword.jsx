import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const { data } = await axios.put(`http://localhost:5000/api/users/reset-password/${token}`, { password });
      setMessage(data.message);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. The link may be expired.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f6f7', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ width: '400px', padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '20px' }}>Create New Password</h2>
        
        {message && <div style={{ color: '#27ae60', backgroundColor: '#e8f8f5', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontWeight: 'bold' }}>{message}</div>}
        {error && <div style={{ color: '#e74c3c', backgroundColor: '#fadbd8', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        {!message && (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>Confirm Password</label>
              <input 
                type="password" 
                placeholder="Confirm new password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <button type="submit" style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
              Save New Password
            </button>
          </form>
        )}

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 'bold' }}>Go to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;