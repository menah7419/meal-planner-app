import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

function Dashboard() {
  const [username, setUsername] = useState('');
  const [expiringItems, setExpiringItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }
    setUsername(localStorage.getItem('username'));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={handleLogout} style={{ padding: '8px 16px' }}>Logout</button>
      </div>
      <h2>Welcome back, {username}! 👋</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>🍽️ Meal Plan</h3>
          <p>Plan your meals for the week</p>
          <button onClick={() => navigate('/meal-plan')} style={{ padding: '8px 16px' }}>View Meal Plan</button>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>🛒 Pantry</h3>
          <p>Track your pantry inventory</p>
          <button onClick={() => navigate('/pantry')} style={{ padding: '8px 16px' }}>View Pantry</button>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>📖 Recipes</h3>
          <p>Search for new recipes</p>
          <button onClick={() => navigate('/recipes')} style={{ padding: '8px 16px' }}>Search Recipes</button>
        </div>
        <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
          <h3>👥 Community</h3>
          <p>Share and discover meal plans</p>
          <button onClick={() => navigate('/community')} style={{ padding: '8px 16px' }}>View Community</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
