import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false); 
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsMenuOpen(false); 
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo} onClick={closeMenu}>
          🏠 PriceWise
        </Link>

        {isMobile && (
          <button 
            style={styles.hamburgerBtn} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? '✖' : '☰'}
          </button>
        )}

        {!isMobile && (
          <>
            <div style={styles.navLinks}>
              <Link to="/prices" style={styles.link}>💰 Prices</Link>
              <Link to="/analytics" style={styles.link}>📊 Trends</Link>
              <a href="/#about" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>ℹ️ About Us</a>
              <a href="/#contact" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>✉️ Contact</a>
            </div>

            <div style={styles.userSection}>
              {userInfo ? (
                <>
                  {userInfo.role === 'admin' && <Link to="/admin" style={styles.dashboardBtn}>🛡️ Admin Panel</Link>}
                  {userInfo.role === 'shop_owner' && <Link to="/shop-dashboard" style={styles.dashboardBtn}>🏪 Shop Dashboard</Link>}
                  {userInfo.role === 'consumer' && <Link to="/dashboard" style={styles.dashboardBtn}>👤 Consumer Dashboard</Link>}
                  <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: '15px' }}>
                  <Link to="/login" style={styles.loginBtn}>Login</Link>
                  <Link to="/register" style={styles.registerBtn}>Register</Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {isMobile && isMenuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/prices" style={styles.mobileLink} onClick={closeMenu}>💰 Prices</Link>
          <Link to="/analytics" style={styles.mobileLink} onClick={closeMenu}>📊 Trends</Link>
          <a href="/#about" style={styles.mobileLink} onClick={closeMenu}>ℹ️ About Us</a>
          <a href="/#contact" style={styles.mobileLink} onClick={closeMenu}>✉️ Contact</a>
          
          <div style={{ width: '100%', height: '1px', backgroundColor: '#333', margin: '10px 0' }}></div>

          {userInfo ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              {userInfo.role === 'admin' && <Link to="/admin" style={{...styles.dashboardBtn, textAlign: 'center'}} onClick={closeMenu}>🛡️ Admin Panel</Link>}
              {userInfo.role === 'shop_owner' && <Link to="/shop-dashboard" style={{...styles.dashboardBtn, textAlign: 'center'}} onClick={closeMenu}>🏪 Shop Dashboard</Link>}
              {userInfo.role === 'consumer' && <Link to="/dashboard" style={{...styles.dashboardBtn, textAlign: 'center'}} onClick={closeMenu}>👤 Consumer Dashboard</Link>}
              <button onClick={handleLogout} style={{...styles.logoutBtn, padding: '10px', marginTop: '5px'}}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', width: '100%' }}>
              <Link to="/login" style={{...styles.loginBtn, textAlign: 'center'}} onClick={closeMenu}>Login</Link>
              <Link to="/register" style={{...styles.registerBtn, textAlign: 'center'}} onClick={closeMenu}>Register</Link>
            </div>
          )}
        </div>
      )}
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
    padding: '0 20px',
    position: 'relative', 
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
  },
  hamburgerBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'white',
    fontSize: '1.8rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px',
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%', 
    left: 0,
    width: '100%',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '20px',
    boxSizing: 'border-box',
    borderTop: '1px solid #333',
    boxShadow: '0 10px 10px rgba(0,0,0,0.2)',
    gap: '15px'
  },
  mobileLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1.2rem',
    width: '100%',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }
};

export default Navbar;