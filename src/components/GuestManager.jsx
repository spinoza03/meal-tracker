import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GuestManager.css';
import { db, auth } from '../firebase.js';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';

function GuestManager() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guestType, setGuestType] = useState('Standard');
  const [guests, setGuests] = useState([]);
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', guest_type: '' });
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const guestsCollectionRef = collection(db, 'guests');
    const q = query(guestsCollectionRef, orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guestData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuests(guestData);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'guests'), { name, email, guest_type: guestType });
      setName('');
      setEmail('');
      setGuestType('Standard');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this guest?")) {
      try {
        await deleteDoc(doc(db, "guests", id));
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    }
  };

  const handleEditClick = (guest) => {
    setEditingGuestId(guest.id);
    setEditFormData({ name: guest.name, email: guest.email, guest_type: guest.guest_type });
  };

  const handleCancelClick = () => setEditingGuestId(null);

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "guests", editingGuestId), editFormData);
      setEditingGuestId(null);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="guest-manager-container">
      <div className="nav-links">
        <Link to="/scanner" className="scanner-link">GO TO STAFF SCANNER →</Link>
        <Link to="/dashboard" className="dashboard-link">VIEW DASHBOARD 📊</Link>
      </div>
      
      {currentUser && (
        <div className="header-bar">
          <p>Welcome, {currentUser.email}</p>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}

      <h2>Guest Management</h2>
      <form className="guest-form" onSubmit={handleSubmit}>
        <h3>Add New Guest</h3>
        <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <select required value={guestType} onChange={(e) => setGuestType(e.target.value)}>
          <option value="Standard">Standard</option>
          <option value="VIP">VIP</option>
          <option value="Press">Press</option>
          <option value="Artist">Artist</option>
        </select>
        <button type="submit">Add Guest</button>
      </form>

      <div className="guest-list">
        <h3>Guest List</h3>
        {guests.map((guest) => (
          <div key={guest.id}>
            {editingGuestId === guest.id ? (
              <form className="guest-item edit-form" onSubmit={handleUpdateSubmit}>
                <input type="text" name="name" value={editFormData.name} onChange={handleEditFormChange} required />
                <input type="email" name="email" value={editFormData.email} onChange={handleEditFormChange} required />
                <select name="guest_type" value={editFormData.guest_type} onChange={handleEditFormChange} required>
                  <option value="Standard">Standard</option>
                  <option value="VIP">VIP</option>
                  <option value="Press">Press</option>
                  <option value="Artist">Artist</option>
                </select>
                <div className='edit-buttons'>
                   <button type="submit" className="save-button">Save</button>
                   <button type="button" onClick={handleCancelClick} className="cancel-button">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="guest-item">
                <div>
                  <p><strong>Name:</strong> {guest.name}</p>
                  <p><strong>Email:</strong> {guest.email}</p>
                  <p><strong>Type:</strong> {guest.guest_type}</p>
                </div>
                <div className="action-buttons">
                  <Link to={`/guest/${guest.id}`} className="action-button qr-button">View QR</Link>
                  <button className="edit-button" onClick={() => handleEditClick(guest)}>Edit</button>
                  <button className="delete-button" onClick={() => handleDelete(guest.id)}>Delete</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuestManager;