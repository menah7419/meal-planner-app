import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MealPlanPage.css';

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
    <div>
      <div className="header">
        <h1>🌿 NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="mealplan-container">
        <h2 style={{ marginBottom: '8px' }}>🍽️ My Meal Plan</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Click any cell to add a meal!</p>

        <div className="mealplan-table-wrapper">
          <table className="mealplan-table">
            <thead>
              <tr>
                <th>Meal</th>
                {DAYS.map(day => <th key={day}>{day}</th>)}
              </tr>
            </thead>
            <tbody>
              {MEALS.map(meal => (
                <tr key={meal}>
                  <td className="mealplan-meal-label">{meal}</td>
                  {DAYS.map(day => (
                    <td key={day}
                      className={plan[`${day}-${meal}`] ? 'mealplan-cell-filled' : ''}
                      onClick={() => handleCellClick(day, meal)}>
                      <div className="mealplan-cell">
                        {editing === `${day}-${meal}` ? (
                          <div onClick={e => e.stopPropagation()} style={{ width: '100%' }}>
                            <input className="mealplan-input" value={inputValue}
                              onChange={e => setInputValue(e.target.value)}
                              autoFocus
                              onKeyDown={e => e.key === 'Enter' && handleSave(day, meal)} />
                            <button className="mealplan-save-btn"
                              onClick={() => handleSave(day, meal)}>Save</button>
                          </div>
                        ) : (
                          <span className={plan[`${day}-${meal}`] ? 'mealplan-cell-text' : 'mealplan-cell-empty'}>
                            {plan[`${day}-${meal}`] || '+'}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default MealPlanPage;
