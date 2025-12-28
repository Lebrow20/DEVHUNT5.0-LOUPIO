import React, { useEffect, useState, useCallback } from "react";

export default function Narration({ title, narration = [], onComplete, onBackToCategories }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isPaused, setIsPaused] = useState(false); const playNarration = useCallback((index = 0) => {
    if (index >= narration.length) {
      setIsFinished(true);
      return;
    }

    const utter = new SpeechSynthesisUtterance(narration[index]);
    utter.lang = "fr-FR";
    utter.pitch = 1.3;
    utter.rate = 0.8;

    const voices = speechSynthesis.getVoices();
    const dodoVoice = voices.find(v =>
      v.name.toLowerCase().includes("amelie") ||
      v.name.toLowerCase().includes("julie") ||
      v.name.toLowerCase().includes("google français") ||
      v.lang === "fr-FR"
    );
    if (dodoVoice) utter.voice = dodoVoice;

    utter.onend = () => {
      if (!speechSynthesis.paused) {
        const next = index + 1;
        setCurrentLine(next);
        playNarration(next);
      }
    };

    speechSynthesis.speak(utter);
  }, [narration]); useEffect(() => {
    const startNarration = () => {
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.onvoiceschanged = () => playNarration();
      } else {
        playNarration();
      }
    };

    startNarration();

    return () => speechSynthesis.cancel();
  }, [playNarration]);
  const replay = () => {
    speechSynthesis.cancel();
    setCurrentLine(0);
    setIsFinished(false);
    setIsPaused(false);
    playNarration(0);
  };

  const pauseNarration = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeNarration = () => {
    speechSynthesis.resume();
    setIsPaused(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-8 flex flex-col items-center justify-center text-center overflow-hidden">
      {/* 🌟 Etoiles flottantes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0 animate-pulse">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-50 animate-bounce"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random()}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full">
        <h1 className="text-4xl font-bold text-indigo-800 mb-6">{title}</h1>

        {/* ✅ Zone de texte avec une seule ligne visible */}
        <div className="bg-white shadow-lg rounded-lg p-6 text-3xl leading-loose max-w-4xl mx-auto text-gray-800 min-h-[6rem] flex items-center justify-center">
          <p className="font-bold text-black">
            {narration[currentLine] || (isFinished && "🎉 Fin de l'histoire")}
          </p>
        </div>        {/* ✅ Boutons de contrôle */}
        <div className="mt-6 space-x-4 flex flex-wrap justify-center">
          {/* Bouton permanent pour revenir aux catégories */}
          <button
            onClick={onBackToCategories}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            ← Catégories
          </button>

          {!isPaused && !isFinished && (
            <button
              onClick={pauseNarration}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              ⏸ Pause
            </button>
          )}

          {isPaused && (
            <>
              <button
                onClick={resumeNarration}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                ▶️ Continuer
              </button>
              <button
                onClick={onComplete}
                className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
              >
                ↩️ Retour au menu
              </button>
            </>
          )}

          {!isPaused && (
            <button
              onClick={replay}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              🔁 Écouter à nouveau
            </button>
          )}

          {isFinished && !isPaused && (
            <button
              onClick={onComplete}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              ↩️ Retour au menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
