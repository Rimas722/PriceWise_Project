import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSending, setIsSending] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSending(true);

    emailjs.sendForm(
      'service_9dxrrba', 
      'template_ka0cvlr', 
      form.current, 
      'SO1CmiQYlXPt0dUjT'
    )
    .then((result) => {
        alert("Message sent! We will get back to you shortly.");
        setIsSending(false);
        e.target.reset(); 
    }, (error) => {
        alert("Failed to send the message. Please try again.");
        console.error("EmailJS Error:", error.text);
        setIsSending(false);
    });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50', fontSize: '2.5rem', marginBottom: '10px' }}>Get in Touch</h1>
      <p style={{ textAlign: 'center', color: '#777', marginBottom: '40px' }}>Have a question or spotted a bug? Let us know!</p>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>

        <div style={{ flex: 1, minWidth: '300px', backgroundColor: '#2c3e50', color: 'white', padding: '30px', borderRadius: '10px' }}>
          <h3>Reach Out Directly</h3>
          <p>📍 <strong>Address:</strong> Kandy, Sri Lanka</p>
          <p>📧 <strong>Email:</strong> mohamedrimas722@gmail.com</p>
          <p>📞 <strong>Phone:</strong> +94 77 822 5249</p>
          <hr style={{ borderColor: '#34495e', margin: '20px 0' }} />
          <p style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>Our support team is available Monday to Friday, 9 AM to 5 PM.</p>
        </div>

        <div style={{ flex: 1, minWidth: '300px', backgroundColor: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>

          <form ref={form} onSubmit={sendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

            <input type="text" name="user_name" placeholder="Your Name" required style={inputStyle} />

            <input type="email" name="user_email" placeholder="Your Email" required style={inputStyle} />

            <textarea name="message" placeholder="How can we help you?" rows="5" required style={{...inputStyle, resize: 'vertical'}}></textarea>
            
            <button type="submit" disabled={isSending} style={{ backgroundColor: isSending ? '#95a5a6' : '#3498db', color: 'white', padding: '12px', border: 'none', borderRadius: '5px', cursor: isSending ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', boxSizing: 'border-box'
};

export default Contact;