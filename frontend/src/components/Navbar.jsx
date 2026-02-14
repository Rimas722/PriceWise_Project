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
    <nav style={styles.nav}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>🏠 PriceWise</Link>
      </div>

      <div style={styles.menu}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/prices" style={styles.link}>Prices</Link>

        {userInfo ? (
          <>
            <Link to="/add-price" style={styles.addBtn}>+ Add Price</Link>
            <Link to="/my-listings" style={styles.link}>My Listings</Link>
            
            <span style={styles.userText}>👤 {userInfo.name}</span>
            <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#333',
    color: 'white',
    alignItems: 'center',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  menu: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.1rem',
  },

  addBtn: {
    backgroundColor: '#ffc107', 
    color: 'black',
    textDecoration: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    marginRight: '15px',
  },
  userText: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  logoutBtn: {
    backgroundColor: 'red',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
  }
};

export default Navbar;