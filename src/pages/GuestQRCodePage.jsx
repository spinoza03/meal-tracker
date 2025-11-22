import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';
import QRCode from 'react-qr-code';
import './GuestQRCodePage.css';
import { useAuth } from '../context/AuthContext'; // Import the useAuth hook

function GuestQRCodePage() {
  const { id } = useParams(); // Gets the guest's ID from the URL
  const { currentUser } = useAuth(); // Gets the currently logged-in user
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This function fetches the specific guest's data from Firestore
    const fetchGuest = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'guests', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuest(docSnap.data());
        } else {
          console.log("No such guest!");
        }
      } catch (error) {
        console.error("Error fetching guest:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!guest) {
    return <h2>Guest not found.</h2>;
  }

  return (
    <div className="qr-page-container">
      {/* THIS IS THE FIX:
        This link will only be displayed if...
        1. A user is currently logged in (currentUser exists)
        2. AND the logged-in user's ID is NOT the same as the ID of the guest on this page.
        This means only an Admin or Staff member viewing another guest's page will see it.
      */}
      {currentUser && currentUser.uid !== id && (
        <Link to="/admin" className="back-link">← Back to Admin</Link>
      )}

      <h1>Scan Pass</h1>
      <h2>{guest.name}</h2>
      <p>{guest.guest_type}</p>
      <div className="qr-code-wrapper">
        <QRCode value={id} />
      </div>
    </div>
  );
}

export default GuestQRCodePage;