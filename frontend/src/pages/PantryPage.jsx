import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';
import './PantryPage.css';

function PantryPage() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const navigate = useNavigate();

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: 'Bearer ' + token };
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/'); return; }
    fetchItems();
  }, []);

  async function fetchItems() {
    const res = await axios.get(API_BASE + '/api/pantry/', { headers: getHeaders() });
    setItems(res.data);
  }

  async function addItem(e) {
    e.preventDefault();
    await axios.post(API_BASE + '/api/pantry/', {
      item_name: itemName,
      quantity: parseFloat(quantity),
      unit,
      expiry_date: expiryDate
    }, { headers: getHeaders() });
    setItemName('');
    setQuantity('');
    setUnit('');
    setExpiryDate('');
    fetchItems();
  }

  async function deleteItem(id) {
    await axios.delete(API_BASE + '/api/pantry/' + id, { headers: getHeaders() });
    fetchItems();
  }

  return (
    <div>
      <div className="header">
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>

      <div className="pantry-container">
        <h2 style={{ marginBottom: '8px' }}>My Pantry</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Track what you have at home</p>

        <form onSubmit={addItem} className="pantry-form">
          <h3 style={{ marginBottom: '16px' }}>Add New Item</h3>
          <div className="pantry-form-grid">
            <div>
              <label>Item Name</label>
              <input value={itemName} onChange={e => setItemName(e.target.value)} required />
            </div>
            <div>
              <label>Quantity</label>
              <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" />
            </div>
            <div>
              <label>Unit</label>
              <input value={unit} onChange={e => setUnit(e.target.value)} />
            </div>
            <div>
              <label>Expiry Date</label>
              <input value={expiryDate} onChange={e => setExpiryDate(e.target.value)} type="date" />
            </div>
          </div>
          <button type="submit">Add Item</button>
        </form>

        <h3 style={{ marginBottom: '16px' }}>My Items ({items.length})</h3>
        {items.length === 0 && <p style={{ color: '#666' }}>No items yet!</p>}
        {items.map(item => (
          <div key={item.id} className="pantry-item">
            <div>
              <div className="pantry-item-name">{item.item_name}</div>
              <div className="pantry-item-details">{item.quantity} {item.unit}</div>
              {item.expiry_date && (
                <div className="pantry-item-expiry">Expires: {item.expiry_date}</div>
              )}
            </div>
            <button className="pantry-delete-btn" onClick={() => deleteItem(item.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PantryPage;
