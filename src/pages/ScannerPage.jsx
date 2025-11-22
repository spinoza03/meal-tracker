import React, { useState, useEffect } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { doc, getDoc, collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast'; // Import the toast function
import './ScannerPage.css';

function ScannerPage() {
  const [scannedGuestId, setScannedGuestId] = useState('');
  const [scannedGuestData, setScannedGuestData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Sound effect for successful scan (Optional but nice)
  const playSuccessSound = () => {
    // You can add a real sound file later if you want
  };

  useEffect(() => {
    if (!scannedGuestId) return;

    const fetchGuest = async () => {
      setLoading(true);
      setScannedGuestData(null);
      
      // Show a loading toast while searching
      const loadingToast = toast.loading('Searching for guest...');

      try {
        const docRef = doc(db, 'guests', scannedGuestId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setScannedGuestData({ id: docSnap.id, ...docSnap.data() });
          toast.success(`Guest Found: ${docSnap.data().name}`, { id: loadingToast });
        } else {
          setScannedGuestData(null);
          toast.error('Invalid QR Code. Guest not found.', { id: loadingToast });
        }
      } catch (error) {
        console.error("Error fetching guest:", error);
        toast.error('Connection Error. Please try again.', { id: loadingToast });
      } finally {
        setLoading(false);
      }
    };

    fetchGuest();
  }, [scannedGuestId]);

  const handleMealRedemption = async (mealType) => {
    if (!scannedGuestData) {
      toast.error('No guest scanned!');
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading(`Checking ${mealType} status...`);

    try {
      const todayString = new Date().toISOString().split('T')[0];
      const mealLogRef = collection(db, 'meal_log');
      const q = query(mealLogRef,
        where("guestId", "==", scannedGuestData.id),
        where("mealType", "==", mealType),
        where("date", "==", todayString)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // ERROR: Meal already eaten
        toast.error(`${mealType} ALREADY REDEEMED today!`, {
          id: loadingToast,
          duration: 4000, // Stay visible longer
          icon: '⚠️',
          style: {
            background: '#ff4d4d',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
      } else {
        // SUCCESS: Redeem meal
        await addDoc(mealLogRef, {
          guestId: scannedGuestData.id,
          guestName: scannedGuestData.name,
          mealType: mealType,
          date: todayString,
          timestamp: new Date()
        });
        
        toast.success(`${mealType} Redeemed Successfully!`, {
          id: loadingToast,
          duration: 3000,
          style: {
            background: '#28a745',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
        playSuccessSound();
      }
    } catch (error) {
      console.error("Error redeeming meal:", error);
      toast.error("System Error. Try again.", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-container glass-card" style={{ marginTop: '2rem' }}>
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
        {/* We removed the text message area because Toasts handle it now */}
        
        {!scannedGuestData && !loading && (
          <p style={{opacity: 0.5, marginTop: '1rem'}}>Ready to scan...</p>
        )}

        {scannedGuestData && (
          <div className="guest-details" style={{ animation: 'fadeIn 0.5s' }}>
            <h2 style={{ color: '#4d88ff', marginBottom: '0.5rem' }}>{scannedGuestData.name}</h2>
            <span className={`guest-badge badge-${scannedGuestData.guest_type || 'Standard'}`}>
              {scannedGuestData.guest_type || 'Standard'}
            </span>
            
            <div className="meal-buttons">
              <button className="meal-btn" onClick={() => handleMealRedemption('Breakfast')} disabled={loading}>
                🍳 Breakfast
              </button>
              <button className="meal-btn" onClick={() => handleMealRedemption('Lunch')} disabled={loading}>
                tg🥘 Lunch
              </button>
              <button className="meal-btn" onClick={() => handleMealRedemption('Dinner')} disabled={loading}>
                🍽️ Dinner
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScannerPage;