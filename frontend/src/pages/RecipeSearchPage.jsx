import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE from '../services/api';
import './RecipeSearchPage.css';

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
    } catch (err) { console.error(err); }
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
    } catch (err) { console.error(err); }
    setLoadingDetail(false);
  }

  function closeModal() {
    setSelectedRecipe(null);
    setRecipeDetail(null);
  }

  return (
    <div>
      <div className="header">
        <h1>🌿 NutriPlan</h1>
        <button onClick={() => navigate('/dashboard')}>← Dashboard</button>
      </div>

      <div className="recipes-container">
        <h2 style={{ marginBottom: '8px' }}>📖 Recipe Search</h2>
        <p style={{ color: '#666', marginBottom: '24px' }}>Search thousands of recipes with nutrition info</p>

        <form onSubmit={handleSearch} className="recipes-search-form">
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search recipes... (e.g. chicken, pasta, salad)"
            style={{ flex: 1 }} />
          <button type="submit">Search</button>
        </form>

        {loading && <p style={{ color: '#666' }}>Searching recipes... 🔍</p>}
        {!loading && searched && results.length === 0 && (
          <p style={{ color: '#666' }}>No recipes found. Try a different search!</p>
        )}

        <div className="recipes-grid">
          {results.map(recipe => (
            <div key={recipe.id} className="recipe-card" onClick={() => handleRecipeClick(recipe)}>
              {recipe.image && (
                <img src={recipe.image} alt={recipe.title} className="recipe-card-image" />
              )}
              <div className="recipe-card-body">
                <div className="recipe-card-title">{recipe.title}</div>
                <div className="recipe-card-meta">
                  ⏱ {recipe.readyInMinutes} mins | 🍽️ {recipe.servings} servings
                </div>
                <div className="recipe-card-nutrition">
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

      {selectedRecipe && (
        <div className="recipe-modal-overlay" onClick={closeModal}>
          <div className="recipe-modal" onClick={e => e.stopPropagation()}>
            <div className="recipe-modal-header">
              <h2 style={{ margin: 0 }}>{selectedRecipe.title}</h2>
              <button className="recipe-close-btn" onClick={closeModal}>✕ Close</button>
            </div>

            {selectedRecipe.image && (
              <img src={selectedRecipe.image} alt={selectedRecipe.title}
                className="recipe-modal-image" />
            )}

            <div className="recipe-modal-nutrition">
              <div className="recipe-nutrition-card">
                <div className="recipe-nutrition-icon">🔥</div>
                <div className="recipe-nutrition-value">{selectedRecipe.calories}</div>
                <div className="recipe-nutrition-label">calories</div>
              </div>
              <div className="recipe-nutrition-card">
                <div className="recipe-nutrition-icon">💪</div>
                <div className="recipe-nutrition-value">{selectedRecipe.protein}g</div>
                <div className="recipe-nutrition-label">protein</div>
              </div>
              <div className="recipe-nutrition-card">
                <div className="recipe-nutrition-icon">🍞</div>
                <div className="recipe-nutrition-value">{selectedRecipe.carbs}g</div>
                <div className="recipe-nutrition-label">carbs</div>
              </div>
              <div className="recipe-nutrition-card">
                <div className="recipe-nutrition-icon">🥑</div>
                <div className="recipe-nutrition-value">{selectedRecipe.fat}g</div>
                <div className="recipe-nutrition-label">fat</div>
              </div>
            </div>

            <p style={{ color: '#666', marginBottom: '16px' }}>
              ⏱ {selectedRecipe.readyInMinutes} mins | 🍽️ {selectedRecipe.servings} servings
            </p>

            {loadingDetail && <p>Loading recipe details... 🔍</p>}

            {recipeDetail && (
              <div>
                <h3 style={{ marginBottom: '12px' }}>Ingredients</h3>
                <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                  {recipeDetail.ingredients.map((ing, i) => (
                    <li key={i} style={{ marginBottom: '6px', fontSize: '14px' }}>{ing}</li>
                  ))}
                </ul>
                <h3 style={{ marginBottom: '12px' }}>Instructions</h3>
                <ol style={{ paddingLeft: '20px' }}>
                  {recipeDetail.instructions.map((step, i) => (
                    <li key={i} style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.6' }}>{step}</li>
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
