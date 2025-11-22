import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Link } from 'react-router-dom';
import './ScannerPage.css';

function ScannerPage() {
  const [scannedGuestId, setScannedGuestId] = useState('');
  const [scannedGuestData, setScannedGuestData] = useState(null);
  const [message, setMessage] = useState('Please scan a guest QR code.');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!scannedGuestId) return;

    const fetchGuest = async () => {
      setLoading(true);
      setScannedGuestData(null);
      setMessage('Searching for guest...');
      try {
        const docRef = doc(db, 'guests', scannedGuestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setScannedGuestData({ id: docSnap.id, ...docSnap.data() });
          setMessage(`Guest Found: ${docSnap.data().name}`);
        } else {
          setScannedGuestData(null);
          setMessage('Error: Invalid QR Code. Guest not found.');
        }
      } catch (error) {
        console.error("Error fetching guest:", error);
        setMessage('An error occurred while fetching guest data.');
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [scannedGuestId]);

  // NEW: This is the final logic for redeeming a meal.
  const handleMealRedemption = async (mealType) => {
    if (!scannedGuestData) {
      setMessage('No guest scanned!');
      return;
    }

    setLoading(true);
    setMessage(`Checking for ${mealType}...`);

    try {
      // Get today's date in YYYY-MM-DD format
      const todayString = new Date().toISOString().split('T')[0];

      // Query the meal_log to see if this guest already had this meal today
      const mealLogRef = collection(db, 'meal_log');
      const q = query(mealLogRef,
        where("guestId", "==", scannedGuestData.id),
        where("mealType", "==", mealType),
        where("date", "==", todayString)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If the query returns any documents, it means the meal was already claimed.
        setMessage(`${mealType} already redeemed today for ${scannedGuestData.name}.`);
      } else {
        // If the query is empty, we can add the new meal log.
        const newLogEntry = {
          guestId: scannedGuestData.id,
          guestName: scannedGuestData.name,
          mealType: mealType,
          date: todayString,
          timestamp: new Date()
        };
        await addDoc(mealLogRef, newLogEntry);
        setMessage(`${mealType} successfully redeemed for ${scannedGuestData.name}!`);
      }
    } catch (error) {
      console.error("Error redeeming meal:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-container">
      <Link to="/" className="back-link">← Back to Admin</Link>
      <h2>Staff Scanner</h2>
      <div className="reader-wrapper">
        <Scanner
          onScan={(result) => setScannedGuestId(result[0].rawValue)}
          onError={(error) => console.log(error?.message)}
          components={{ audio: false, video: true }}
          options={{ delayBetweenScanAttempts: 1000, delayBetweenScanSuccess: 2000 }}
        />
      </div>
      <div className="scan-result">
        <h3>Scan Status</h3>
        <p className={`message ${scannedGuestData && !message.includes('Error') ? 'success' : 'error'}`}>{message}</p>

        {scannedGuestData && (
          <div className="guest-details">
            <h4>{scannedGuestData.name}</h4>
            <p><strong>Type:</strong> {scannedGuestData.guest_type}</p>
            <div className="meal-buttons">
              <button onClick={() => handleMealRedemption('Breakfast')} disabled={loading}>Breakfast</button>
              <button onClick={() => handleMealRedemption('Lunch')} disabled={loading}>Lunch</button>
              <button onClick={() => handleMealRedemption('Dinner')} disabled={loading}>Dinner</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerPage;