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
      const config = { headers: { 'Content-Type': 'application/json' } };

      const { data } = await axios.post(
        'http://localhost:5000/api/users',
        { name, email, password, role },
        config
      );

      localStorage.setItem('userInfo', JSON.stringify(data));
      alert("Registration Successful!");
      navigate('/'); 

    } catch (err) {
      setError(err.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={{textAlign: 'center', marginBottom: '20px'}}>📝 Create Account</h2>
        {error && <div style={styles.error}>{error}</div>}
        
        <form onSubmit={handleRegister}>
          <div style={styles.inputGroup}>
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label>Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={styles.input} required />
          </div>

          <div style={styles.inputGroup}>
            <label>I am a:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.input}>
              <option value="consumer">Consumer (I want to buy)</option>
              <option value="shop_owner">Shop Owner (I want to sell)</option>
            </select>
          </div>

          <button type="submit" style={styles.button}>Register</button>
        </form>

        <p style={{marginTop: '15px', textAlign: 'center'}}>
          Already have an account? <Link to="/login" style={{color: 'blue'}}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', justifyContent: 'center', marginTop: '50px' },
  formCard: { width: '400px', padding: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', borderRadius: '10px', backgroundColor: 'white' },
  inputGroup: { marginBottom: '15px' },
  input: { width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' },
  button: { width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' },
  error: { color: 'red', marginBottom: '10px', textAlign: 'center' }
};

export default Register;