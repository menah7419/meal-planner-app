import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PantryPage from './pages/PantryPage';
import MealPlanPage from './pages/MealPlanPage';
import CommunityPage from './pages/CommunityPage';
import RecipeSearchPage from './pages/RecipeSearchPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/recipes" element={<RecipeSearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
