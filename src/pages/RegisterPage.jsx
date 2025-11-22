import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.js';

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created in Auth:", user.uid);

      // 2. Create a document in the 'users' collection with their role
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        email: user.email,
        role: 'guest'
      });
      console.log("User document created in 'users' collection");

      // 3. Create a document in the 'guests' collection
      // We use the same UID as the document ID for easy lookup
      const guestDocRef = doc(db, 'guests', user.uid);
      await setDoc(guestDocRef, {
        name: name,
        email: user.email,
        guest_type: 'Standard',
        auth_uid: user.uid // Link to the auth user
      });
      console.log("Guest document created in 'guests' collection");

      // 4. Redirect the user to their personal QR code page
      navigate(`/guest/${user.uid}`);

    } catch (err) {
      setError(err.message);
      console.error("Error during registration:", err);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form glass-card">
        <h2>Guest Registration</h2>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Full Name"
          required
        />
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
        <button type="submit">Register and Get My QR Code</button>
        <p>Already an Admin/Staff? <Link to="/login">Login Here</Link></p>
      </form>
    </div>
  );
}

export default RegisterPage;