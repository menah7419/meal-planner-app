import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    setUsername(localStorage.getItem('username'));
  }, []);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/');
  }

  return (
    <div>
      <div className="header">
        <h1>🌿 NutriPlan</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <div className="dashboard-container">
        <h2 className="dashboard-welcome">Welcome back, {username}! 👋</h2>
        <p className="dashboard-subtitle">What would you like to do today?</p>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate('/meal-plan')}>
            <div className="dashboard-card-icon">🍽️</div>
            <h3 className="dashboard-card-title">Meal Plan</h3>
            <p className="dashboard-card-desc">Plan your meals for the week</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/pantry')}>
            <div className="dashboard-card-icon">🛒</div>
            <h3 className="dashboard-card-title">Pantry</h3>
            <p className="dashboard-card-desc">Track your pantry inventory</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/recipes')}>
            <div className="dashboard-card-icon">📖</div>
            <h3 className="dashboard-card-title">Recipes</h3>
            <p className="dashboard-card-desc">Search for new recipes</p>
          </div>
          <div className="dashboard-card" onClick={() => navigate('/community')}>
            <div className="dashboard-card-icon">👥</div>
            <h3 className="dashboard-card-title">Community</h3>
            <p className="dashboard-card-desc">Share and discover meal plans</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
