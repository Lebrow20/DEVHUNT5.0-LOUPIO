import React from "react";

export default function CategorySelector({ onSelect }) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h2 className="text-xl font-bold text-purple-700 mb-2">Choisis une catégorie :</h2>

      <button
        onClick={() => onSelect("animaux")}
        className="px-6 py-3 bg-yellow-300 text-black font-semibold rounded-lg shadow hover:bg-yellow-400 transition"
      >
        🐾 Animaux
      </button>

      <button
        onClick={() => onSelect("foretMagique")}
        className="px-6 py-3 bg-green-300 text-black font-semibold rounded-lg shadow hover:bg-green-400 transition"
      >
        🌳 Forêt magique
      </button>

      <button
        onClick={() => onSelect("couleurs")}
        className="px-6 py-3 bg-blue-300 text-black font-semibold rounded-lg shadow hover:bg-blue-400 transition"
      >
        🌈 Couleurs
      </button>
    </div>
  );
}
