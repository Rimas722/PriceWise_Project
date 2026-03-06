import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#2c3e50' }}>

      <section style={{ backgroundColor: '#2c3e50', color: 'white', padding: isMobile ? '60px 20px' : '100px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: isMobile ? '2.2rem' : '3rem', color: '#3498db', marginBottom: '20px', lineHeight: '1.2' }}>
          Welcome to PriceWise LK
        </h1>
        <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', maxWidth: '600px', margin: '0 auto 40px auto', color: '#ecf0f1', lineHeight: '1.6' }}>
          The smartest way to compare grocery prices. Find the cheapest Rice, Vegetables, and Essentials in your city instantly.
        </p>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/prices" style={{ ...primaryBtn, width: isMobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>
            🛒 Start Comparing Prices
          </Link>
          {!userInfo && (
            <Link to="/register-shop" style={{ ...secondaryBtn, width: isMobile ? '100%' : 'auto', textAlign: 'center', boxSizing: 'border-box' }}>
              🏪 I am a Shop Owner
            </Link>
          )}
        </div>
      </section>

      <section style={{ backgroundColor: '#f1c40f', padding: '30px 20px', textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
          Spotted a great deal or a price change in the market?
        </h3>
        <p style={{ margin: '0 0 20px 0', color: '#34495e', fontSize: isMobile ? '0.9rem' : '1rem' }}>
          Help the community by updating the prices!
        </p>
        {userInfo ? (
           <Link to="/user-dashboard" style={{...primaryBtn, backgroundColor: '#2c3e50', border: 'none', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'}}>
             + Submit a New Price
           </Link>
        ) : (
           <Link to="/login" style={{...primaryBtn, backgroundColor: '#2c3e50', border: 'none', width: isMobile ? '100%' : 'auto', boxSizing: 'border-box'}}>
             🔐 Please Login to Add a Price
           </Link>
        )}
      </section>

      <section style={{ padding: isMobile ? '40px 20px' : '80px 20px', backgroundColor: '#f8f9fa' }}>
        <h2 style={{ textAlign: 'center', fontSize: isMobile ? '1.8rem' : '2rem', marginBottom: isMobile ? '30px' : '50px' }}>
          Why Use PriceWise?
        </h2>
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'center', gap: isMobile ? '20px' : '40px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={featureCard}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🔍</div>
            <h3 style={{ fontSize: '1.3rem' }}>Live Comparison</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>Check real-time prices from multiple shops in Kandy before you leave your house.</p>
          </div>
          <div style={featureCard}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>📉</div>
            <h3 style={{ fontSize: '1.3rem' }}>Save Money</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>Identify market trends and find the absolute best deals on daily essentials.</p>
          </div>
          <div style={featureCard}>
            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🤝</div>
            <h3 style={{ fontSize: '1.3rem' }}>Community Driven</h3>
            <p style={{ color: '#7f8c8d', fontSize: '0.95rem' }}>Powered by honest consumers and local shop owners working together.</p>
          </div>
        </div>
      </section>

      <section id="about" style={{ padding: isMobile ? '50px 20px' : '80px 20px', backgroundColor: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>ℹ️ About Us</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#3498db', margin: '0 auto 30px auto' }}></div>
          <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: '#555', lineHeight: '1.8', marginBottom: '20px' }}>
            PriceWise LK was created to solve a real-world problem: the daily fluctuation of essential grocery prices. 
            Often, consumers travel from shop to shop just to find fair pricing. Our mission is to digitize this process, 
            bringing transparency to the local market.
          </p>
          <p style={{ fontSize: isMobile ? '1rem' : '1.1rem', color: '#555', lineHeight: '1.8' }}>
            Whether you are a family trying to budget your monthly expenses, or a local grocer wanting to advertise your 
            competitive rates, PriceWise bridges the gap between buyers and sellers.
          </p>
        </div>
      </section>

      <section id="contact" style={{ padding: isMobile ? '50px 20px' : '80px 20px', backgroundColor: '#f8f9fa' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', color: '#2c3e50', marginBottom: '20px' }}>✉️ Contact Us</h2>
          <div style={{ width: '60px', height: '4px', backgroundColor: '#3498db', margin: '0 auto 30px auto' }}></div>
          <p style={{ color: '#7f8c8d', marginBottom: '40px', fontSize: isMobile ? '0.9rem' : '1rem' }}>
            Have questions, suggestions, or want to register a large supermarket chain? Send us a message!
          </p>
          
          <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', textAlign: 'left' }} onSubmit={(e) => { e.preventDefault(); alert('Message sent! We will get back to you soon.'); }}>
            <div>
              <label style={labelStyle}>Your Name</label>
              <input type="text" required style={inputStyle} placeholder="" />
            </div>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" required style={inputStyle} placeholder="" />
            </div>
            <div>
              <label style={labelStyle}>Message</label>
              <textarea required rows="5" style={inputStyle} placeholder="How can we help you?"></textarea>
            </div>
            <button type="submit" style={{ ...primaryBtn, width: '100%', marginTop: '10px', boxSizing: 'border-box' }}>
              Send Message
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

const primaryBtn = { display: 'inline-block', padding: '15px 30px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem', transition: '0.3s', border: '2px solid #3498db' };
const secondaryBtn = { display: 'inline-block', padding: '15px 30px', backgroundColor: 'transparent', color: 'white', textDecoration: 'none', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.1rem', transition: '0.3s', border: '2px solid white' };
const featureCard = { backgroundColor: 'white', padding: '40px 20px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', flex: '1', minWidth: '250px', textAlign: 'center', boxSizing: 'border-box' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#34495e', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '5px', boxSizing: 'border-box', fontFamily: 'inherit', fontSize: '1rem' };

export default Home;