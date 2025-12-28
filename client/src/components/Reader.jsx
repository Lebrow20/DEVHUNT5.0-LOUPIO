import React from "react";

// Import dynamique des images dans le dossier assets/img
const images = import.meta.glob('../assets/img/*.{png,jpg,jpeg,gif,svg}', { eager: true });

export default function Reader({ story }) {
  const speak = (text) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "fr-FR";
    speechSynthesis.speak(utter);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 w-full max-w-md text-center">
      <h2 className="text-xl font-bold text-blue-700 mb-4">{story.title}</h2>

      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {story.text.map((item, index) => (
          <span
            key={index}
            className="cursor-pointer px-2 py-1 bg-blue-100 rounded hover:bg-blue-200"
            onClick={() => speak(item.word)}
          >
            {item.word}{" "}
            {item.image && (
              <img
                src={images[`../assets/img/${item.image}`]?.default}
                alt={item.word}
                className="inline w-10 h-10 object-contain mx-1"
              />
            )}
          </span>
        ))}
      </div>

      <button
        className="mt-3 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 shadow"
        onClick={() => speak(story.text.map(w => w.word).join(" "))}
      >
        🔊 Lire tout
      </button>
    </div>
  );
}
