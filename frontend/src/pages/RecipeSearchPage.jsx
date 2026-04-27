import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

function RecipeSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  function getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      const res = await axios.get(`${API_BASE}/api/recipes/search?q=${query}`, {
        headers: getHeaders()
      });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px' }}>← Dashboard</button>
      </div>
      <h2>📖 Recipe Search</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for recipes... (e.g. chicken, pasta, salad)"
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Search</button>
      </form>

      {loading && <p>Searching recipes... 🔍</p>}

      {!loading && searched && results.length === 0 && (
        <p>No recipes found. Try a different search!</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {results.map(recipe => (
          <div key={recipe.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
            {recipe.image && (
              <img src={recipe.image} alt={recipe.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
            )}
            <div style={{ padding: '12px' }}>
              <h4 style={{ margin: '0 0 8px 0' }}>{recipe.title}</h4>
              <p style={{ margin: '0 0 8px 0', color: '#666', fontSize: '14px' }}>
                ⏱ {recipe.readyInMinutes} mins | 🍽️ {recipe.servings} servings
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '13px' }}>
                <span>🔥 {recipe.calories} cal</span>
                <span>💪 {recipe.protein}g protein</span>
                <span>🍞 {recipe.carbs}g carbs</span>
                <span>🥑 {recipe.fat}g fat</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeSearchPage;
