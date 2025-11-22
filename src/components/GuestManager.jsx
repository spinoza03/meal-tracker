import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './GuestManager.css';
import { db, auth } from '../firebase.js';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, onSnapshot, orderBy, query, doc, deleteDoc, updateDoc } from 'firebase/firestore';

function GuestManager() {
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guestType, setGuestType] = useState('Standard');
  
  // Data State
  const [guests, setGuests] = useState([]);
  
  // Editing State
  const [editingGuestId, setEditingGuestId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', guest_type: '' });

  // NEW: Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Fetch Guests
  useEffect(() => {
    const guestsCollectionRef = collection(db, 'guests');
    const q = query(guestsCollectionRef, orderBy('name'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const guestData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGuests(guestData);
    });
    return () => unsubscribe();
  }, []);

  // NEW: Filter Logic
  // We create a new variable 'filteredGuests' that holds the results of our search
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = 
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesFilter = filterType === 'All' || guest.guest_type === filterType;

    return matchesSearch && matchesFilter;
  });

  // Handlers
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

  const handleDirectPrint = (guestId) => {
    const printWindow = window.open(`/guest/${guestId}`, '_blank', 'width=600,height=800');
    printWindow.onload = function() {
      setTimeout(() => { printWindow.print(); }, 500);
    };
  };

  return (
    <div className="guest-manager-container glass-card">
      <h2>Guest Management</h2>

      {/* Add Guest Form */}
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

      {/* NEW: Search and Filter Bar */}
      <div className="search-bar-container">
        <input 
          type="text" 
          placeholder="🔍 Search by name or email..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select 
          value={filterType} 
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="All">All Types</option>
          <option value="Standard">Standard</option>
          <option value="VIP">VIP</option>
          <option value="Press">Press</option>
          <option value="Artist">Artist</option>
        </select>
      </div>

      <div className="guest-list">
        <h3>Guest List ({filteredGuests.length})</h3>
        
        {/* Use filteredGuests instead of guests */}
        {filteredGuests.length > 0 ? (
          filteredGuests.map((guest) => (
            <div key={guest.id}>
              {editingGuestId === guest.id ? (
                <form className="guest-item edit-form glass-card" onSubmit={handleUpdateSubmit}>
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
                <div className="guest-item glass-card">
                  <div>
                    <p><strong>Name:</strong> {guest.name}</p>
                    <p><strong>Email:</strong> {guest.email}</p>
                    <p><strong>Type:</strong> {guest.guest_type}</p>
                  </div>
                  <div className="action-buttons">
                    <button className="action-button print-button" onClick={() => handleDirectPrint(guest.id)} title="Print Badge">🖨️</button>
                    <Link to={`/guest/${guest.id}`} className="action-button qr-button">View QR</Link>
                    <button className="edit-button" onClick={() => handleEditClick(guest)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDelete(guest.id)}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p style={{textAlign: 'center', opacity: 0.6}}>No guests found matching your search.</p>
        )}
      </div>
    </div>
  );
}

export default GuestManager;