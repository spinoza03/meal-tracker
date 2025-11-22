import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import QRCode from 'react-qr-code';
import { useAuth } from '../context/AuthContext';
import './GuestQRCodePage.css';

// Make sure your logo file name matches this import!
import logo from '../assets/logo.png'; 

function GuestQRCodePage() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuest = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'guests', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuest(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching guest:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuest();
  }, [id]);

  // NEW: The function that triggers the browser's print dialog
  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="qr-page-container">Loading your pass...</div>;
  if (!guest) return <div className="qr-page-container">Guest Pass Not Found</div>;

  return (
    <div className="qr-page-container">
      
      {/* The Glass Card - This is what we want to print */}
      <div className="ticket-card">
        
        <img src={logo} alt="Festival Logo" className="logo-img" />
        
        <h1 className="guest-name">{guest.name}</h1>
        
        <span className={`guest-badge badge-${guest.guest_type || 'Standard'}`}>
          {guest.guest_type || 'Standard'} Guest
        </span>

        <div className="qr-frame">
          <QRCode 
            value={id} 
            size={200}
            fgColor="#1a1a1a"
          />
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.8rem', opacity: 0.7 }}>
          Present this QR code at the entrance.
        </p>

      </div>

      {/* NEW: Print Button */}
      <button onClick={handlePrint} className="print-btn">
        🖨️ Print Badge
      </button>

      {/* Admin Back Link */}
      {currentUser && currentUser.uid !== id && (
        <Link to="/admin" className="back-link">
          ← Back to Dashboard
        </Link>
      )}
    </div>
  );
}

export default GuestQRCodePage;