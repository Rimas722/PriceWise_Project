import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🏠 PriceWise
        </Link>

        <div style={styles.navLinks}>
          <Link to="/prices" style={styles.link}>💰 Prices</Link>
          <Link to="/analytics" style={styles.link}>📊 Trends</Link>
          <Link to="/about" style={styles.link}>ℹ️ About Us</Link>
          <Link to="/contact" style={styles.link}>✉️ Contact</Link>
        </div>

        <div style={styles.userSection}>
          {userInfo ? (
            <>
              {userInfo.role === 'admin' && (
                <Link to="/admin" style={styles.dashboardBtn}>🛡️ Admin Panel</Link>
              )}

              {userInfo.role === 'shop_owner' && (
                <Link to="/shop-dashboard" style={styles.dashboardBtn}>🏪 Shop Dashboard</Link>
              )}

              {userInfo.role === 'consumer' && (
                <Link to="/dashboard" style={styles.dashboardBtn}>👤 Consumer Dashboard</Link>
              )}

              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to="/login" style={styles.loginBtn}>Login</Link>
              <Link to="/register" style={styles.registerBtn}>Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#1a1a2e',
    padding: '15px 0',
    color: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px'
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#00d4ff',
    textDecoration: 'none',
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  link: {
    color: '#ccc',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: '0.3s',
  },
  dashboardBtn: {
    backgroundColor: '#e94560',
    color: 'white',
    padding: '8px 15px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  loginBtn: {
    backgroundColor: 'transparent',
    color: '#00d4ff',
    border: '2px solid #00d4ff',
    padding: '6px 20px',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  registerBtn: {
    backgroundColor: '#00d4ff',
    color: '#000',
    border: '2px solid #00d4ff',
    padding: '6px 20px',
    borderRadius: '20px',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: '0.3s'
  },
  logoutBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #ccc',
    color: '#ccc',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Navbar;