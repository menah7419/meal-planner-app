import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';

function RecipeSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeDetail, setRecipeDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
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

  async function handleRecipeClick(recipe) {
    setSelectedRecipe(recipe);
    setLoadingDetail(true);
    try {
      const res = await axios.get(`${API_BASE}/api/recipes/detail/${recipe.id}`, {
        headers: getHeaders()
      });
      setRecipeDetail(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoadingDetail(false);
  }

  function closeModal() {
    setSelectedRecipe(null);
    setRecipeDetail(null);
  }

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>
      <h2>📖 Recipe Search</h2>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for recipes... (e.g. chicken, pasta, salad)"
          style={{ flex: 1 }}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Searching recipes... 🔍</p>}

      {!loading && searched && results.length === 0 && (
        <p>No recipes found. Try a different search!</p>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {results.map(recipe => (
          <div key={recipe.id}
            onClick={() => handleRecipeClick(recipe)}
            style={{ border: '1px solid #C8E6C9', borderRadius: '8px', overflow: 'hidden',
              cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s',
              backgroundColor: 'white' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
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

      {selectedRecipe && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={closeModal}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', maxWidth: '700px',
            width: '100%', maxHeight: '85vh', overflowY: 'auto', padding: '24px' }}
            onClick={e => e.stopPropagation()}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>{selectedRecipe.title}</h2>
              <button onClick={closeModal} style={{ background: '#e74c3c', padding: '6px 12px' }}>✕ Close</button>
            </div>

            {selectedRecipe.image && (
              <img src={selectedRecipe.image} alt={selectedRecipe.title}
                style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px' }}>🔥</div>
                <div style={{ fontWeight: 'bold' }}>{selectedRecipe.calories}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>calories</div>
              </div>
              <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px' }}>💪</div>
                <div style={{ fontWeight: 'bold' }}>{selectedRecipe.protein}g</div>
                <div style={{ fontSize: '12px', color: '#666' }}>protein</div>
              </div>
              <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px' }}>🍞</div>
                <div style={{ fontWeight: 'bold' }}>{selectedRecipe.carbs}g</div>
                <div style={{ fontSize: '12px', color: '#666' }}>carbs</div>
              </div>
              <div style={{ background: '#E8F5E9', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '20px' }}>🥑</div>
                <div style={{ fontWeight: 'bold' }}>{selectedRecipe.fat}g</div>
                <div style={{ fontSize: '12px', color: '#666' }}>fat</div>
              </div>
            </div>

            <p style={{ color: '#666', marginBottom: '16px' }}>
              ⏱ {selectedRecipe.readyInMinutes} mins | 🍽️ {selectedRecipe.servings} servings
            </p>

            {loadingDetail && <p>Loading recipe details... 🔍</p>}

            {recipeDetail && (
              <div>
                <h3>Ingredients</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                  {recipeDetail.ingredients.map((ing, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{ing}</li>
                  ))}
                </ul>

                <h3>Instructions</h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {recipeDetail.instructions.map((step, i) => (
                    <li key={i} style={{ marginBottom: '8px', lineHeight: '1.6' }}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeSearchPage;
