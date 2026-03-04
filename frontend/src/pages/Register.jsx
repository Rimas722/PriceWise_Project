import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'https://pricewise-project.onrender.com/api/users',
        { name, email, password, role },
        config
      );

      alert(data.message || 'Registration successful! Please check your email to verify your account.');

      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.message || 'Error registering account. Email might be in use.');
      console.error(err);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRole('consumer');
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{textAlign: 'center', marginBottom: '10px', color: '#2c3e50'}}>📝 Create Account</h2>
        <p style={{textAlign: 'center', color: '#7f8c8d', marginBottom: '20px'}}>Join PriceWise LK today</p>
        
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              placeholder="Enter your full name"
              required 
            />
          </div>

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
              placeholder="Create a password"
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>I am a:</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              style={styles.input}
            >
              <option value="consumer">Consumer (I want to compare prices)</option>
              <option value="shop_owner">Shop Owner (I want to list my prices)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="submit" style={styles.primaryButton}>Register</button>
            <button type="button" onClick={handleReset} style={styles.secondaryButton}>Clear</button>
          </div>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center', fontSize: '0.9rem', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}>
            Login Here
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
    fontFamily: 'Arial, sans-serif',
    padding: '40px 0'
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
    fontSize: '1rem',
    backgroundColor: '#fff'
  },
  primaryButton: { 
    flex: 2, 
    padding: '12px', 
    backgroundColor: '#2ecc71', 
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

export default Register;