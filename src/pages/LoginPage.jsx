import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import './Auth.css';

function LoginPage() {
  // STATE: Controls if the app is "Locked" or "Unlocked"
  const [isLocked, setIsLocked] = useState(true); 
  const [unlockCode, setUnlockCode] = useState('');

  // Standard Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // 1. Function to check the Secret Code
  const handleCodeChange = (e) => {
    const code = e.target.value;
    setUnlockCode(code);
    
    // CHANGE THIS CODE to whatever secret password you want
    if (code === 'dev123') {
      setIsLocked(false); // Unlock the page instantly
    }
  };

  // 2. Standard Login Logic (Only runs when unlocked)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.role === 'admin') navigate('/admin');
        else if (userData.role === 'staff') navigate('/scanner');
        else navigate(`/guest/${user.uid}`);
      } else {
        navigate(`/guest/${user.uid}`);
      }
    } catch (err) {
      setError("Failed to log in. Please check your email and password.");
    }
  };

  // 3. RENDER: If Locked, show Maintenance Message
  if (isLocked) {
    return (
      <div className="auth-container">
        <div className="auth-form glass-card">
          <h2>African Cinema Festival</h2>
          <div style={{ padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔒</div>
            <h3 style={{ color: '#ffadad', marginBottom: '1rem' }}>Activation Required</h3>
            <p style={{ lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', marginBottom: '1.5rem' }}>
              This system is currently <strong>inactive</strong>. <br />
              Access is restricted pending final setup.
            </p>
            
            <div className="contact-info" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '0.5rem' }}>
                To unlock the application, please contact the developer:
              </p>
              <a href="https://wa.me/212608301414" className="highlight" style={{ fontSize: '1.4rem', color: '#25D366', fontWeight: 'bold', display: 'block', textDecoration: 'none', marginTop: '0.5rem' }}>
                📞 0608 30 14 14
              </a>
            </div>

            {/* HIDDEN INPUT FOR YOU */}
            <input 
              type="password" 
              placeholder="..." 
              value={unlockCode}
              onChange={handleCodeChange}
              style={{
                marginTop: '2rem',
                background: 'transparent',
                border: 'none',
                color: '#333', // Very dark so it's almost invisible on dark bg
                textAlign: 'center',
                outline: 'none',
                fontSize: '0.8rem'
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // 4. RENDER: If Unlocked, show Real Login Form
  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form glass-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;