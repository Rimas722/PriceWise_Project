import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', backgroundColor: '#f4f6f7' }}>
      <div style={{ width: '400px', padding: '40px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '10px' }}>Forgot Password</h2>
        <p style={{ textAlign: 'center', color: '#7f8c8d', marginBottom: '20px', fontSize: '0.9rem' }}>
          Enter your email address and we will send you a link to reset your password.
        </p>

        {message && <div style={{ color: '#27ae60', backgroundColor: '#e8f8f5', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{message}</div>}
        {error && <div style={{ color: '#e74c3c', backgroundColor: '#fadbd8', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="Enter your registered email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ padding: '12px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ padding: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
            Send Reset Link
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontSize: '0.9rem' }}>Back to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;