import React, { useState } from "react";

export default function Question({ question, onCorrect, onWrong }) {
  const [selected, setSelected] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (opt) => {
    if (isAnimating) return; // Empêche les clics pendant l'animation
    
    setSelected(opt);
    setIsAnimating(true);
    
    if (opt.correct) {
      // Bonne réponse
      if (onCorrect) {
        setTimeout(() => {
          setSelected(null);
          setIsAnimating(false);
          onCorrect();
        }, 600);
      }
    } else {
      // Mauvaise réponse
      if (onWrong) {
        onWrong();
      }
      
      // Reset après 4 secondes pour permettre de réessayer
      setTimeout(() => {
        setSelected(null);
        setIsAnimating(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-4 rounded-lg shadow">
      <h4 className="text-lg font-semibold text-center text-purple-700 mb-4">{question.text}</h4>
      <div className="flex flex-col gap-3">
        {question.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleClick(opt)}
            disabled={isAnimating || (selected && selected.correct)}
            className={`px-4 py-2 rounded font-semibold shadow transition-colors ${
              selected
                ? opt.correct
                  ? "bg-green-400 text-white"
                  : opt === selected
                  ? "bg-red-400 text-white"
                  : "bg-gray-200"
                : isAnimating
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-200 hover:bg-blue-300 text-black"
            }`}
          >
            {opt.answer}
          </button>
        ))}
      </div>

      {selected && (
        <p className="text-center mt-4 font-bold text-lg">
          {selected.correct ? "✅ Bravo !" : "❌ Essaie encore !"}
        </p>
      )}
    </div>
  );
}