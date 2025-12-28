// src/pages/MathQuiz.jsx

import React, { useState } from "react";
import { mathQuiz } from "../data/mathQuiz";
import { Brain, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function MathQuiz() {
  const [niveau, setNiveau] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const quizzes = niveau ? mathQuiz[niveau] : [];

  const handleAnswer = (choice) => {
    const correctAnswer = quizzes[questionIndex].answer;
    if (choice === correctAnswer) {
      setScore(score + 1);
    }

    if (questionIndex + 1 < quizzes.length) {
      setQuestionIndex((prev) => prev + 1);
    } else {
      setDone(true);
    }
  };

  const resetQuiz = () => {
    setNiveau(null);
    setQuestionIndex(0);
    setScore(0);
    setDone(false);
  };

  if (!niveau) {
    return (
      <div>
        <div className="fixed z-50 ml-9 mt-3">
          <Link
            to="/sixanseducation"
            className="group flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl text-gray-800 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-300 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            <span>Retour</span>
          </Link>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-blue-100 p-8">


          <h1 className="text-4xl font-extrabold text-blue-800 mb-8 flex items-center gap-2">
            <Brain className="w-7 h-7 text-yellow-500" />
            Quiz Mathématique
          </h1>

          <p className="mb-8 text-lg text-blue-700 font-medium">
            Choisis ton niveau :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
            {[
              { key: "debutant", label: "Débutant", bg: "#FAD43B", txt: "text-gray-800" },
              { key: "intermediaire", label: "Intermédiaire", bg: "#0075ee", txt: "text-white" },
              { key: "avance", label: "Avancé", bg: "#f32450", txt: "text-white" },
            ].map(({ key, label, bg, txt }) => (
              <button
                key={key}
                onClick={() => setNiveau(key)}
                className={`flex flex-col items-center justify-center rounded-2xl p-8 shadow-md hover:shadow-xl transform transition-transform duration-300 hover:scale-105 font-semibold ${txt}`}
                style={{ backgroundColor: bg }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div>
        <div className="fixed z-50 ml-9 mt-3">
          <Link
            to="/sixanseducation"
            className="group flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl text-gray-800 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-300 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            <span>Retour</span>
          </Link>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-6 text-center">


          <div className="bg-white/70 p-8 rounded-2xl shadow-xl max-w-md w-full">
            <h2 className="text-3xl font-extrabold mb-6 text-green-700">
              {score === quizzes.length
                ? "🎉 Parfait !"
                : score >= quizzes.length / 2
                  ? "👏 Bien joué !"
                  : "🧐 Essaie encore !"}
            </h2>

            <p className="text-lg text-gray-800 font-medium mb-6">
              Tu as obtenu <span className="text-blue-700 font-bold">{score}</span> /{" "}
              <span className="font-bold">{quizzes.length}</span>
            </p>

            <button
              onClick={resetQuiz}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-400 hover:from-yellow-500 hover:to-pink-500 text-white rounded-full font-semibold shadow-md transition-all duration-300 hover:scale-105"
            >
              🔁 Recommencer le quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quizzes[questionIndex];

  return (
    <div>
      <div className="fixed z-50 ml-9 mt-3">
        <Link
          to="/sixanseducation"
          className="group flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl text-gray-800 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-300 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-blue-100 p-6 text-center">
        <h2 className="text-3xl font-extrabold text-yellow-700 mb-4">
          Niveau : {niveau.charAt(0).toUpperCase() + niveau.slice(1)}
        </h2>

        <p className="mb-8 text-lg text-gray-800 font-medium bg-white/60 px-6 py-4 rounded-2xl shadow">
          {currentQuestion.question}
        </p>

        <div className="grid gap-4 w-full max-w-md mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-white text-gray-700 border-2 border-yellow-400 hover:bg-yellow-400 hover:text-white font-semibold px-6 py-3 rounded-xl shadow transition-all duration-300 hover:scale-105"
            >
              {option}
            </button>
          ))}
        </div>

        <div className="text-sm text-blue-800 mb-2 font-medium">
          Question {questionIndex + 1} / {quizzes.length}
        </div>

        <div className="w-full max-w-md h-3 rounded-full bg-yellow-200 shadow-inner">
          <div
            className="h-3 bg-[#0075ee] rounded-full transition-all duration-500"
            style={{ width: `${((questionIndex + 1) / quizzes.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
