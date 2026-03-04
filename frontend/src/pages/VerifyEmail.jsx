import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams(); 
  const [message, setMessage] = useState('Verifying your email...');
  const [success, setSuccess] = useState(false);
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const verifyUser = async () => {
      try {
        const { data } = await axios.get(`https://pricewise-project.onrender.com/api/users/verify/${token}`);
        setMessage(data.message);
        setSuccess(true);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Verification failed. The link may be expired or already used.');
        setSuccess(false);
      }
    };
    verifyUser();
  }, [token]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
      <h2 style={{ color: success ? '#27ae60' : '#e74c3c' }}>
        {success ? '✅ Success!' : '❌ Link Expired or Already Used'}
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#2c3e50', marginBottom: '30px' }}>{message}</p>
      
      <Link to="/login" style={{ padding: '10px 20px', background: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
        Go to Login
      </Link>
    </div>
  );
};

export default VerifyEmail;