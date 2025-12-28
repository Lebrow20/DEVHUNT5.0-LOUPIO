import React, { useState, useEffect } from "react";
import { PlayCircle, StopCircle, ArrowLeft } from "lucide-react";

// ✅ Liste des sons de détente
const sounds = [
  {
    name: "🌧️ Bruits de pluie",
    src: "/sounds/rain.mp3",
  },
  {
    name: "🐦 Bruits des oiseaux",
    src: "/sounds/bird.mp3",
  },
  {
    name: "🌊 Bruits de la mer",
    src: "/sounds/ocean.mp3",
  },
  {
    name: "🏞️ Bruits de la rivière",
    src: "/sounds/river.mp3",
  },
];

export default function ModeDodo({ onBack }) {
  const [currentSound, setCurrentSound] = useState(null);
  const [audioInstance, setAudioInstance] = useState(null);

  // ✅ Lancer un son
  const playSound = (src) => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
    }

    const audio = new Audio(src);
    audio.loop = false; // ❌ Le son ne se rejoue pas automatiquement
    audio.volume = 0.7;

    audio.onended = () => {
      setCurrentSound(null);     // ✅ Remet à zéro quand fini
      setAudioInstance(null);
    };

    audio.play();
    setAudioInstance(audio);
    setCurrentSound(src);
  };

  // ✅ Stopper le son
  const stopSound = () => {
    if (audioInstance) {
      audioInstance.pause();
      audioInstance.currentTime = 0;
      setAudioInstance(null);
    }
    setCurrentSound(null);
  };

  // ✅ Nettoyage à la sortie
  useEffect(() => {
    return () => {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
      }
    };
  }, [audioInstance]);

  return (

<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-blue-200 p-6 text-center">
  <h1 className="text-4xl font-extrabold text-indigo-800 mb-10 drop-shadow-md">
    🌙 Mode Dodo
  </h1>

  <div className="grid gap-5 w-full max-w-xl">
    {sounds.map((sound, index) => (
      <div
        key={index}
        className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-6 py-5 flex justify-between items-center border border-indigo-200 hover:shadow-xl transition duration-300"
      >
        <span className="text-lg font-semibold text-indigo-700">{sound.name}</span>
        {currentSound === sound.src ? (
          <button
            onClick={stopSound}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          >
            <StopCircle className="w-5 h-5" />
            Stop
          </button>
        ) : (
          <button
            onClick={() => playSound(sound.src)}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
          >
            <PlayCircle className="w-5 h-5" />
            Écouter
          </button>
        )}
      </div>
    ))}
  </div>

  <button
    onClick={() => {
      stopSound();
      onBack();
    }}
    className="mt-12 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-full hover:bg-indigo-700 shadow-md hover:shadow-xl transition-all duration-300"
  >
    <ArrowLeft className="w-5 h-5" />
    Retour au menu
  </button>
</div>

  );
}
