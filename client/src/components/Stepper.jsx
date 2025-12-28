import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChild, FaUserGraduate } from "react-icons/fa";

export default function Step() {
  const navigate = useNavigate();

  const handleSelectAge = (range) => {
    if (range === "7-12") {
      navigate("/sixanseducation");
    } else {
      navigate("/education");
    }
  };

  return (
    <div className="min-h-screen p-6 flex justify-center">
      <div className="w-full max-w-screen-lg px-6">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-6 text-center">
          Bienvenue dans ton aventure !
        </h1>
        <p className="text-md text-gray-700 text-center mb-10">
          Choisis la tranche d'âge pour commencer le jeu ✨
        </p>

        <button
          onClick={() => handleSelectAge("4-6")}
          className="w-full bg-white rounded-3xl border-4 border-yellow-400 text-yellow-600 shadow-md hover:shadow-yellow-300 hover:bg-yellow-200 transform hover:scale-105 transition duration-300 ease-out mb-6 py-4 px-10 flex flex-col items-center gap-3 text-center"
          aria-label="4 à 6 ans"
        >
          <FaChild className="text-yellow-500 w-14 h-14" />
          <span className="text-2xl font-bold select-none">4 - 6 ans</span>
        </button>

        <button
          onClick={() => handleSelectAge("7-12")}
          className="w-full bg-white rounded-3xl border-4 border-blue-400 text-blue-600 shadow-md hover:shadow-blue-300 hover:bg-blue-200 transform hover:scale-105 transition duration-300 ease-out py-4 px-10 flex flex-col items-center gap-3 text-center"
          aria-label="7 à 12 ans"
        >
          <FaUserGraduate className="text-blue-500 w-14 h-14" />
          <span className="text-2xl font-bold select-none">7 - 12 ans</span>
        </button>
      </div>
    </div>
  );
}
