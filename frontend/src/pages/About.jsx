import React from 'react';

const About = () => {
  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif', lineHeight: '1.6' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '2.5rem' }}>About PriceWise LK</h1>
      <p style={{ fontSize: '1.2rem', color: '#555', textAlign: 'center', marginBottom: '40px' }}>
        Empowering Sri Lankans to make smarter daily grocery choices.
      </p>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#3498db' }}>Our Mission</h2>
        <p>
          In a constantly changing economy, finding the best prices for everyday essentials shouldn't be a struggle. 
          PriceWise LK was built to bring transparency to the grocery market by crowdsourcing real-time prices from various shops across the country.
        </p>

        <h2 style={{ color: '#3498db', marginTop: '30px' }}>How It Works</h2>
        <ul style={{ paddingLeft: '20px' }}>
          <li style={{ marginBottom: '10px' }}><strong>Shop Owners:</strong> Can list their verified prices to attract more customers to their physical stores.</li>
          <li style={{ marginBottom: '10px' }}><strong>Consumers:</strong> Can search, compare, and even report new prices they find in the market to help others.</li>
        </ul>

        <h2 style={{ color: '#3498db', marginTop: '30px' }}>Community First</h2>
        <p>
          This platform relies on the power of community. Every price you add or update helps another family save money. 
          Together, we are making shopping easier and more transparent for everyone.
        </p>
      </div>
    </div>
  );
};

export default About;   