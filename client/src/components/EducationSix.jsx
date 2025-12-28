import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import puzzleImg from "../assets/puzzle.png";
import minilecteurImg from "../assets/lecteur.png";
import dessinImg from "../assets/math.jpg";
import { ArrowLeft, ArrowLeftIcon } from "lucide-react";

const activities = [
  { id: 1, label: "Puzzle", path: "/puzzle2", image: puzzleImg },
  { id: 2, label: "Memory", path: "/memory", image: minilecteurImg },
  { id: 3, label: "Math Quiz", path: "/mathquiz", image: dessinImg },
];
const EducationSix = () => {
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleClick = (activity) => {
    setSelected(activity.id);
    navigate(activity.path);
  };

  return (
    <div>
      <div className="fixed z-50 ml-9 mt-3">
        <Link
          to="/stepper"
          className="group flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl text-gray-800 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-300 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="relative max-w-4xl mx-auto p-8">

        <h2 className="text-3xl font-extrabold text-center text-yellow-600 mb-8 drop-shadow-lg">
          Choisissez une activité pour votre enfant
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {activities.map(({ id, label, path, image }) => (
            <button
              key={id}
              onClick={() => handleClick({ id, label, path })}
              className={`
               relative flex flex-col items-center rounded-2xl border border-gray-300 p-8
               shadow-md bg-white transition-transform duration-300 ease-in-out
               hover:scale-105 hover:shadow-yellow-400 focus:outline-none focus:ring-4 focus:ring-yellow-300
               min-w-[220px]
               ${selected === id ? "selected-choice" : ""}
             `}
            >
              <img
                src={image}
                alt={label}
                className="w-36 h-36 object-contain mb-6 transition-transform duration-300 group-hover:scale-110"
              />
              <div className="text-yellow-700 text-2xl font-semibold">{label}</div>
            </button>
          ))}
        </div>

        <style>{`
         .selected-choice {
           border-left: none !important;
           border-right: none !important;
           border-top-width: 6px !important;
           border-bottom-width: 6px !important;
           border-color: #FAD43B !important;
           box-shadow: 0 6px 8px -4px rgba(250, 212, 59, 0.7);
         }
         .selected-choice:hover {
           box-shadow: 0 8px 12px -4px rgba(250, 212, 59, 0.9);
         }
       `}</style>
      </div>
    </div>
  );

};

export default EducationSix
