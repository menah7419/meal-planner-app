import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import PantryPage from './pages/PantryPage';
import MealPlanPage from './pages/MealPlanPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pantry" element={<PantryPage />} />
        <Route path="/meal-plan" element={<MealPlanPage />} />
        <Route path="/recipes" element={<h1>Recipes Coming Soon</h1>} />
        <Route path="/community" element={<h1>Community Coming Soon</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
