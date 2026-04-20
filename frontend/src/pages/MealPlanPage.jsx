import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

function MealPlanPage() {
  const [plan, setPlan] = useState({});
  const [editing, setEditing] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/'); return; }
  }, []);

  function handleCellClick(day, meal) {
    setEditing(`${day}-${meal}`);
    setInputValue(plan[`${day}-${meal}`] || '');
  }

  function handleSave(day, meal) {
    setPlan({ ...plan, [`${day}-${meal}`]: inputValue });
    setEditing(null);
    setInputValue('');
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>← Dashboard</button>
      </div>
      <h2>🍽️ My Meal Plan</h2>
      <p>Click any cell to add a meal!</p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ddd', padding: '10px', background: '#f2f2f2' }}>Meal</th>
              {DAYS.map(day => (
                <th key={day} style={{ border: '1px solid #ddd', padding: '10px', background: '#f2f2f2' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MEALS.map(meal => (
              <tr key={meal}>
                <td style={{ border: '1px solid #ddd', padding: '10px', fontWeight: 'bold', background: '#f9f9f9' }}>{meal}</td>
                {DAYS.map(day => (
                  <td key={day} onClick={() => handleCellClick(day, meal)}
                    style={{ border: '1px solid #ddd', padding: '10px', cursor: 'pointer',
                      minWidth: '100px', background: plan[`${day}-${meal}`] ? '#e8f5e9' : 'white' }}>
                    {editing === `${day}-${meal}` ? (
                      <div>
                        <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                          style={{ width: '90%', padding: '4px' }} autoFocus />
                        <button onClick={() => handleSave(day, meal)} style={{ marginTop: '4px', padding: '2px 8px' }}>Save</button>
                      </div>
                    ) : (
                      <span>{plan[`${day}-${meal}`] || '+'}</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MealPlanPage;
