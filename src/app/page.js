'use client';

import { useState, useCallback } from 'react';
import fetchRecipes from '@/api/fetchRecipes';
import Loading from '@/components/Loading';
import RecipeCard from '@/components/RecipeCard';
import { askLLM } from '@/hooks/useAI';
import AIRecipeContent from '@/components/AIResponse';

const Home = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAIRecipe, setIsAIRecipe] = useState(false);

  // Fetch recipes from API
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setIsAIRecipe(false);

    try {
      const results = await fetchRecipes(query);
      if (results.length === 0) {
        setError('No recipes found. Try a different search.');
      }
      setRecipes(results);
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      setError('Failed to fetch recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Ask AI to generate a recipe
  const handleAskAI = useCallback(async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setIsAIRecipe(true);

    try {
      const prompt = `Generate a detailed cooking recipe for "${query}". 
      For each ingredient, list:
      1. Quantity used
      2. Estimated calories before cooking
      3. Estimated calories after cooking 
      
      Then provide step-by-step cooking instructions. Keep the response clear and well-structured.`;
      
      const aiResult = await askLLM(prompt);
      console.log(aiResult);

      setRecipes([
        {
          recipe: {
            label: `AI Recipe: ${query}`,
            description: aiResult,
          },
        },
      ]);
    } catch (err) {
      console.error('AI error:', err);
      setError('AI failed to generate a recipe.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="relative min-h-screen text-black flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      {/* Background Overlay for Opacity Effect */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      {/* Content Wrapper (z-index to stay above the background) */}
      <div className="relative container mx-auto p-8 bg-white bg-opacity-90 rounded-xl shadow-lg z-10">
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">Recipe Finder</h1>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a recipe..."
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search recipes"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition active:scale-95"
            aria-label="Search button"
          >
            Search
          </button>
          <button
            onClick={handleAskAI}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition active:scale-95"
            aria-label="Ask AI button"
          >
            Ask AI
          </button>
        </div>

        {/* Loading Spinner */}
        {loading && <Loading />}

        {/* Error Message */}
        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        {/* Recipe Results */}
        {!loading && recipes.length > 0 && !isAIRecipe && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe, index) => (
              <RecipeCard key={index} recipe={recipe.recipe} />
            ))}
          </div>
        )}

        {/* AI-Generated Recipe Display */}
        {!loading && isAIRecipe && recipes.length > 0 && (
          <div className="w-full bg-purple-50 p-6 rounded-lg mt-8">
            <AIRecipeContent recipe={recipes[0].recipe} />
          </div>
        )}

        {/* Static Recipe Cards (Show if no results found) */}
        {!loading && recipes.length === 0 && !error && !isAIRecipe && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{ img: '/whole.jpg', title: 'Mouth-Watering Biryani', desc: 'Aromatic spices, basmati rice, and marinated meat or veggies.' },
              { img: '/pizza.jpg', title: 'Mood Lifter: Pizza', desc: 'Crispy delight with melted cheese, rich sauce, and tasty toppings.' },
              { img: '/burger.jpg', title: 'Hungry? Go for a Burger!', desc: 'Juicy patty, fresh lettuce, tomato, cheese, and soft bun.' }].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition">
                  <img src={item.img} alt={item.title} className="w-full h-40 object-cover rounded-lg mb-4" />
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
