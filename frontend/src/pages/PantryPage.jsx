import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

function PantryPage() {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (!token) { navigate('/'); return; }
    fetchItems();
  }, []);

  async function fetchItems() {
    const res = await axios.get(`${API_BASE}/api/pantry/`, { headers });
    setItems(res.data);
  }

  async function addItem(e) {
    e.preventDefault();
    await axios.post(`${API_BASE}/api/pantry/`, {
      item_name: itemName,
      quantity: parseFloat(quantity),
      unit,
      expiry_date: expiryDate
    }, { headers });
    setItemName('');
    setQuantity('');
    setUnit('');
    setExpiryDate('');
    fetchItems();
  }

  async function deleteItem(id) {
    await axios.delete(`${API_BASE}/api/pantry/${id}`, { headers });
    fetchItems();
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>← Dashboard</button>
      </div>
      <h2>🛒 My Pantry</h2>

      <form onSubmit={addItem} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Add New Item</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label>Item Name</label><br/>
            <input value={itemName} onChange={e => setItemName(e.target.value)}
              style={{ width: '100%', padding: '8px' }} required />
          </div>
          <div>
            <label>Quantity</label><br/>
            <input value={quantity} onChange={e => setQuantity(e.target.value)}
              type="number" style={{ width: '100%', padding: '8px' }} />
          </div>
          <div>
            <label>Unit (e.g. kg, cups)</label><br/>
            <input value={unit} onChange={e => setUnit(e.target.value)}
              style={{ width: '100%', padding: '8px' }} />
          </div>
          <div>
            <label>Expiry Date</label><br/>
            <input value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
              type="date" style={{ width: '100%', padding: '8px' }} />
          </div>
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px' }}>Add Item</button>
      </form>

      <h3>My Items ({items.length})</h3>
      {items.length === 0 && <p>No items yet — add some above!</p>}
      {items.map(item => (
        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', border: '1px solid #ddd', borderRadius: '8px',
          padding: '12px', marginBottom: '10px' }}>
          <div>
            <strong>{item.item_name}</strong>
            <span style={{ marginLeft: '10px', color: '#666' }}>
              {item.quantity} {item.unit}
            </span>
            {item.expiry_date && (
              <span style={{ marginLeft: '10px', color: '#e74c3c' }}>
                Expires: {item.expiry_date}
              </span>
            )}
          </div>
          <button onClick={() => deleteItem(item.id)}
            style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default PantryPage;
