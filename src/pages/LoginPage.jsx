import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import './Auth.css'; // We'll reuse the CSS from the register page

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Sign in the user with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Get the user's role from the 'users' collection in Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        // 3. Redirect based on the role
        if (userData.role === 'admin') {
          navigate('/admin');
        } else if (userData.role === 'staff') {
          navigate('/scanner');
        } else {
          // It's a guest or has no role, redirect them to their QR page
          navigate(`/guest/${user.uid}`);
        }
      } else {
        setError("No role assigned to this user.");
      }
    } catch (err) {
      setError("Failed to log in. Please check your email and password.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form glass-card">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        <p>Are you a guest? <Link to="/register">Register Here</Link></p>
      </form>
    </div>
  );
}

export default LoginPage;