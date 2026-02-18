import React from 'react';

const Support = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#007bff' }}>📞 Help & Support</h1>
      
      <div style={{ marginTop: '40px' }}>
        <h3>❓ Frequently Asked Questions (FAQ)</h3>
        
        <div style={styles.faqItem}>
          <strong>Q: How do I report a fake price?</strong>
          <p>A: Click the Red Flag (🚩) icon next to the price in the table.</p>
        </div>

        <div style={styles.faqItem}>
          <strong>Q: Can I add my own shop?</strong>
          <p>A: Yes! If you are a shop owner, register an account and click "New Shop" in the menu.</p>
        </div>

        <div style={styles.faqItem}>
          <strong>Q: Is this service free?</strong>
          <p>A: Yes, PriceWise is 100% free for consumers.</p>
        </div>
      </div>

      <div style={{ marginTop: '40px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px' }}>
        <h3>📧 Contact Us</h3>
        <p>Have issues? Email our support team:</p>
        <p style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>support@pricewise.lk</p>
        <p>Or call us: +94 77 123 4567</p>
      </div>
    </div>
  );
};

const styles = {
  faqItem: { marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }
};

export default Support;