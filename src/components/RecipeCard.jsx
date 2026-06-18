// src/app/components/RecipeCard.jsx

const RecipeCard = ({ recipe }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={recipe.strMealThumb}
        alt={recipe.strMeal}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {recipe.strMeal}
        </h2>

        <p className="text-gray-600 mt-2">
          Category: {recipe.strCategory}
        </p>

        <p className="text-gray-600">
          Cuisine: {recipe.strArea}
        </p>

        {recipe.strYoutube && (
          <a
            href={recipe.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="block mt-4 text-blue-600 hover:underline"
          >
            Watch Video
          </a>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
