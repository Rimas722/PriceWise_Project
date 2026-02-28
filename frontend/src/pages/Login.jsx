import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      
      console.log("Login Success:", data);

      if (data.role === 'admin') {
        navigate('/admin');             
      } else if (data.role === 'shop_owner') {
        navigate('/shop-dashboard');    
      } else {
        navigate('/prices');            
      }

    } catch (err) {
      setError('Invalid Email or Password');
      console.error(err);
    }
  };

  const handleReset = () => {
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{textAlign: 'center', marginBottom: '10px', color: '#2c3e50'}}>🔑 Login</h2>
        <p style={{textAlign: 'center', color: '#7f8c8d', marginBottom: '20px'}}>Welcome back to PriceWise LK</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email"
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="Enter your password"
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={styles.primaryButton}>Sign In</button>
            <button type="button" onClick={handleReset} style={styles.secondaryButton}>Clear</button>
          </div>

          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#e74c3c', textDecoration: 'none', fontSize: '0.9rem' }}>Forgot Password?</Link>
          </div>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>
            Register Here
          </Link>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#f4f6f7',
    fontFamily: 'Arial, sans-serif'
  },
  formCard: { 
    width: '400px', 
    padding: '40px', 
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)', 
    borderRadius: '12px', 
    backgroundColor: 'white' 
  },
  inputGroup: { 
    marginBottom: '15px' 
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#333',
    fontSize: '0.9rem'
  },
  input: { 
    width: '100%', 
    padding: '12px', 
    borderRadius: '6px', 
    border: '1px solid #ccc',
    boxSizing: 'border-box',
    fontSize: '1rem'
  },
  primaryButton: { 
    flex: 2, 
    padding: '12px', 
    backgroundColor: '#2c3e50', 
    color: 'white', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.2s'
  },
  secondaryButton: { 
    flex: 1, 
    padding: '12px', 
    backgroundColor: '#ecf0f1', 
    color: '#2c3e50', 
    border: '1px solid #bdc3c7', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: '1rem',
    fontWeight: 'bold'
  },
  error: { 
    color: '#e74c3c', 
    backgroundColor: '#fadbd8',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px', 
    textAlign: 'center',
    fontSize: '0.9rem'
  }
};

export default Login;