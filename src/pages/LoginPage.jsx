import React from 'react';
import './Auth.css';

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-form glass-card">
        
        {/* Title */}
        <h2>African Cinema Festival</h2>
        
        {/* The "Locked" Message */}
        <div style={{ padding: '2rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
          
          <h3 style={{ color: '#ffadad', marginBottom: '1rem' }}>Activation Required</h3>
          
          <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
            This system is currently <strong>inactive</strong>. 
            <br />
            Access has been temporarily restricted pending final setup.
          </p>
          
          {/* Your Contact Info */}
          <div className="contact-info" style={{ 
            background: 'rgba(255, 255, 255, 0.05)', 
            padding: '1.5rem', 
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
              To unlock the application, please contact the developer via WhatsApp:
            </p>
            
            <a 
              href="https://wa.me/212608301414" 
              target="_blank" 
              rel="noopener noreferrer"
              className="highlight" 
              style={{ 
                fontSize: '1.4rem', 
                color: '#25D366', /* WhatsApp Green */
                fontWeight: 'bold', 
                display: 'block',
                textDecoration: 'none',
                marginTop: '0.5rem'
              }}
            >
              📞 0608 30 14 14
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default LoginPage;