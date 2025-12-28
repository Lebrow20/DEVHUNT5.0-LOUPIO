import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { stories } from "../data/stories";
import CategorySelector from "./CategorySelector";
import Reader from "./Reader";
import Question from "./Question";
import Narration from "./Narration";
import TalkingTom from "./TalkingTom";
import ModeDodo from "./ModeDodo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function MiniLecteur() {
  const [mode, setMode] = useState(null); // "quiz", "narration", "dodo"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [tomAnimation, setTomAnimation] = useState(2);

  const category = selectedCategory ? stories[selectedCategory] : null;
  const isMulti = category?.contents !== undefined;
  const content = isMulti ? category?.contents?.[currentStep] : category;

  const readCurrentText = () => {
    if (!content?.text) return;
    const fullText = content.text.map((w) => w.word).join(" ");
    const utter = new SpeechSynthesisUtterance(fullText);
    utter.lang = "fr-FR";

    const voices = speechSynthesis.getVoices();
    const childVoice = voices.find(v =>
      v.name.toLowerCase().includes("hortense") || v.name.toLowerCase().includes("amelie")
    );
    if (childVoice) utter.voice = childVoice;

    utter.pitch = 1.4;
    speechSynthesis.speak(utter);
  };

  useEffect(() => {
    if (mode === "quiz" && selectedCategory && currentStep === 0) {
      setTimeout(() => {
        readCurrentText();
      }, 600);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (mode === "quiz" && selectedCategory && content?.text && isMulti) {
      setTimeout(() => {
        readCurrentText();
      }, 400);
    }
  }, [currentStep]);

  useEffect(() => {
    if (mode === "quiz" && !isMulti && quizCompleted) {
      const timer = setTimeout(() => {
        resetAll();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [quizCompleted]);

  const resetAll = () => {
    setMode(null);
    setSelectedCategory(null);
    setCurrentStep(0);
    setQuizCompleted(false);
    setTomAnimation(2);
  };

  const handleCorrectAnswer = () => {
    setTomAnimation(17);
    setTimeout(() => {
      setTomAnimation(2);
      if (isMulti) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setQuizCompleted(true);
      }
    }, 5000);
  };

  const handleWrongAnswer = () => {
    setTomAnimation(4);
    setTimeout(() => {
      setTomAnimation(2);
    }, 4000);
  };

  // 🌙 Mode Dodo
  if (mode === "dodo") {
    return <ModeDodo onBack={resetAll} />;
  }
  // 🟡 Menu principal
  if (!mode) {
    return (
      <div>
        <div className="fixed ml-9 mt-3 ">
          <Link
            to="/education"
            className="group flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl text-gray-800 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-300 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            <span>Retour</span>
          </Link>
        </div>

        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-blue-100 p-8">
          <h1 className="text-5xl font-bold text-blue-800 mb-4 animate-fade-in-down">Bienvenue 👋</h1>
          <p className="text-xl text-blue-700 mb-10 animate-fade-in-up">Que veux-tu faire aujourd'hui ?</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <button
              onClick={() => setMode("quiz")}
              className="flex flex-col items-center justify-center bg-yellow-300 hover:bg-yellow-400 text-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
            >
              <span className="text-4xl mb-2">🎯</span>
              <span className="text-xl font-semibold">Faire des quiz</span>
            </button>

            <button
              onClick={() => setMode("narration")}
              className="flex flex-col items-center justify-center bg-blue-200 hover:bg-blue-300 text-blue-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
            >
              <span className="text-4xl mb-2">📖</span>
              <span className="text-xl font-semibold">Écouter des histoires</span>
            </button>

            <button
              onClick={() => setMode("dodo")}
              className="flex flex-col items-center justify-center bg-purple-300 hover:bg-purple-400 text-purple-900 rounded-2xl p-6 shadow-lg hover:shadow-xl transform transition-transform duration-300 hover:scale-105"
            >
              <span className="text-4xl mb-2">🌙</span>
              <span className="text-xl font-semibold">Mode Dodo</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
  // 📚 Choix de catégorie
  if (mode && !selectedCategory) {
    const filteredKeys = Object.keys(stories).filter((key) => {
      const story = stories[key];
      if (mode === "quiz") return story.contents || (story.text && story.question);
      if (mode === "narration") return story.narration;
      return false;
    });

    return (

      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50 p-6">
        <h2 className="text-4xl font-extrabold mb-8 text-pink-800">Choisis une catégorie</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {filteredKeys.map((key) => (
            <button
              key={key}
              onClick={() => {
                setSelectedCategory(key);
                setCurrentStep(0);
                setTomAnimation(2);
              }}
              className="bg-white px-6 py-5 rounded-2xl shadow-md text-lg text-pink-800 font-semibold
                   hover:bg-pink-100 hover:shadow-lg transition-transform transform hover:scale-105"
            >
              {stories[key].title}
            </button>
          ))}
        </div>

        <button
          onClick={() => setMode(null)}
          className="mt-10 flex items-center gap-2 text-gray-700 hover:text-pink-800 underline underline-offset-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour au menu principal
        </button>
      </div>

    );
  }
  // 📖 Mode Narration
  if (mode === "narration" && category?.narration) {
    return (
      <Narration
        title={category.title}
        narration={category.narration}
        onComplete={() => setTimeout(() => resetAll(), 2000)}
        onBackToCategories={() => setSelectedCategory(null)}
      />
    );
  }
  // ✅ Fin des quiz
  if (mode === "quiz" && isMulti && !content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center">
        <h2 className="text-3xl font-bold text-green-700">🎉 Terminé !</h2>
        <p className="mt-4 text-lg">Bravo ! Tu as tout lu et répondu correctement !</p>
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={resetAll}
        >
          ↩️ Revenir au menu
        </button>
      </div>
    );
  }

  // 🧠 Mode Quiz avec TalkingTom
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-blue-200 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">{category?.title}</h1>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full max-w-6xl">
        {/* Partie lecture + question */}
        <div className="w-full lg:w-1/2 flex flex-col items-center bg-white/70 rounded-xl p-6 shadow-md border border-yellow-200">
          <Reader
            story={{ title: content?.title || category.title, text: content.text }}
          />
          <Question
            question={content.question}
            onCorrect={handleCorrectAnswer}
            onWrong={handleWrongAnswer}
          />
        </div>

        {/* Partie animation 3D */}
        <div className="w-full lg:w-1/2 h-0 lg:h-[500px] bg-white/30 rounded-xl shadow-inner border border-blue-200 p-2">
          <Canvas camera={{ position: [0, 2, 4], fov: 50 }} style={{ background: 'transparent' }}>
            <ambientLight intensity={0.7} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <TalkingTom index={tomAnimation} position={[0, -1, 0]} />
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 4}
              target={[0, 1, 0]}
            />
          </Canvas>
        </div>
      </div>
    </div>

  );
}

export default MiniLecteur;
