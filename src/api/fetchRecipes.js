// src/api/fetchRecipes.js

const fetchRecipes = async (query) => {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
        query
      )}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }

    const data = await response.json();

    return data.meals || [];
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return [];
  }
};

export default fetchRecipes;
