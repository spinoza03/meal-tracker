import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [mealLogs, setMealLogs] = useState([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    totalOverall: 0,
    breakfast: 0,
    lunch: 0,
    dinner: 0,
  });

  // Effect 1: Fetch all meal logs in real-time
  useEffect(() => {
    const mealLogRef = collection(db, 'meal_log');
    const unsubscribe = onSnapshot(mealLogRef, (snapshot) => {
      const logs = snapshot.docs.map(doc => doc.data());
      setMealLogs(logs);
    });
    return () => unsubscribe();
  }, []);

  // Effect 2: Calculate stats whenever the meal logs change
  useEffect(() => {
    const todayString = new Date().toISOString().split('T')[0];
    
    let totalToday = 0;
    let breakfast = 0;
    let lunch = 0;
    let dinner = 0;

    mealLogs.forEach(log => {
      // Calculate totals for today
      if (log.date === todayString) {
        totalToday++;
      }
      // Calculate totals by meal type
      if (log.mealType === 'Breakfast') breakfast++;
      if (log.mealType === 'Lunch') lunch++;
      if (log.mealType === 'Dinner') dinner++;
    });

    setStats({
      totalToday,
      totalOverall: mealLogs.length,
      breakfast,
      lunch,
      dinner,
    });

  }, [mealLogs]); // This effect re-runs whenever mealLogs is updated

  return (
    <div className="dashboard-container">
       <Link to="/" className="back-link">← Back to Admin</Link>
      <h2>Meal Analytics Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Meals Served Today</h3>
          <p>{stats.totalToday}</p>
        </div>
        <div className="stat-card">
          <h3>Total Meals Overall</h3>
          <p>{stats.totalOverall}</p>
        </div>
        <div className="stat-card">
          <h3>Total Breakfasts</h3>
          <p>{stats.breakfast}</p>
        </div>
        <div className="stat-card">
          <h3>Total Lunches</h3>
          <p>{stats.lunch}</p>
        </div>
        <div className="stat-card">
          <h3>Total Dinners</h3>
          <p>{stats.dinner}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;