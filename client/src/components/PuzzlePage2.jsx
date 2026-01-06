import React, { useState, useEffect, useRef } from 'react';
import { Shuffle, Star, Timer, Lightbulb, ArrowLeft } from 'lucide-react';
import 'animate.css';
import { Link } from 'react-router-dom';

const PuzzlePage2 = () => {
  const [puzzleSize, setPuzzleSize] = useState(3);
  const [pieces, setPieces] = useState([]);
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [moves, setMoves] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState('animals');
  const [showHint, setShowHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef(null);

  const themes = {
    animals: {
      name: '🐾 Animaux',
      colors: ['🦁', '🐘', '🦒', '🐼', '🦓', '🦘', '🐨', '🦜', '🐠']
    },
    fruits: {
      name: '🍎 Fruits',
      colors: ['🍎', '🍌', '🍇', '🍓', '🍑', '🍒', '🍍', '🥥', '🍈']
    },
    space: {
      name: '🚀 Espace',
      colors: ['🚀', '🌙', '⭐', '☄️', '🪐', '🌍', '☀️', '🌕', '🌌']
    }
  };
  const initializePuzzle = () => {
    const totalPieces = puzzleSize * puzzleSize;
    const themeEmojis = themes[selectedTheme].colors;

    const newPieces = Array.from({ length: totalPieces }, (_, index) => ({
      id: index,
      correctPosition: index,
      currentPosition: index,
      emoji: themeEmojis[index % themeEmojis.length],
      isCorrect: true
    }));

    const shuffled = [...newPieces];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i].currentPosition, shuffled[j].currentPosition] =
        [shuffled[j].currentPosition, shuffled[i].currentPosition];
    }

    shuffled.forEach(piece => {
      piece.isCorrect = piece.currentPosition === piece.correctPosition;
    });

    setPieces(shuffled);
    setIsComplete(false);
    setMoves(0);
    setTimer(0);
    setIsPlaying(true);
    setShowHint(false);
    setSelectedPiece(null);
  };

  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, isComplete]);

  useEffect(() => {
    if (pieces.length > 0) {
      const completed = pieces.every(p => p.currentPosition === p.correctPosition);
      if (completed && isPlaying) {
        setIsComplete(true);
        setIsPlaying(false);
      }
    }
  }, [pieces, isPlaying]);

  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e, targetPosition) => {
    e.preventDefault();
    if (!draggedPiece) return;

    const targetPiece = pieces.find(p => p.currentPosition === targetPosition);
    if (targetPiece && targetPiece.id !== draggedPiece.id) {
      swapPieces(draggedPiece, targetPiece);
    }

    setDraggedPiece(null);
  };

  // Fonction pour échanger deux pièces
  const swapPieces = (piece1, piece2) => {
    const newPieces = pieces.map(piece => {
      if (piece.id === piece1.id) {
        return {
          ...piece,
          currentPosition: piece2.currentPosition,
          isCorrect: piece2.currentPosition === piece.correctPosition
        };
      }
      if (piece.id === piece2.id) {
        return {
          ...piece,
          currentPosition: piece1.currentPosition,
          isCorrect: piece1.currentPosition === piece.correctPosition
        };
      }
      return piece;
    });

    setPieces(newPieces);
    setMoves(prev => prev + 1);
  };

  // Gérer les clics sur les pièces (mode mobile)
  const handlePieceClick = (piece) => {
    if (!isMobile) return; // Ne fonctionne qu'en mode mobile

    if (!selectedPiece) {
      // Première pièce sélectionnée
      setSelectedPiece(piece);
    } else if (selectedPiece.id === piece.id) {
      // Déselectionner si on clique sur la même pièce
      setSelectedPiece(null);
    } else {
      // Échanger les deux pièces
      swapPieces(selectedPiece, piece);
      setSelectedPiece(null);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const getPieceAtPosition = (pos) => pieces.find(p => p.currentPosition === pos);

  const toggleHint = () => setShowHint(!showHint);

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="fixed z-50 ml-9 mt-3">
        <Link
          to="/sixanseducation"
          className="group flex items-center gap-3 px-6 py-3 bg-gray-100 rounded-2xl text-gray-800 hover:bg-gray-200 transition-all duration-300 border-2 border-gray-300 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span>Retour</span>
        </Link>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 animate__animated animate__bounce">
          🎉 Amuse-toi avec le Puzzle Magique ! 🎉
        </h1>        <div className="bg-white/90 border-2 border-gray-200 rounded-3xl p-6 mb-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block font-bold mb-3 text-gray-700 text-lg">🎨 Thème</label>
              <select value={selectedTheme} onChange={e => setSelectedTheme(e.target.value)} className="w-full p-3 rounded-xl border-3 border-purple-400 bg-white font-semibold text-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
                {Object.entries(themes).map(([key, val]) => (
                  <option key={key} value={key}>{val.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold mb-3 text-gray-700 text-lg">⚡ Difficulté</label>
              <select value={puzzleSize} onChange={e => setPuzzleSize(Number(e.target.value))} className="w-full p-3 rounded-xl border-3 border-purple-400 bg-white font-semibold text-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
                <option value={3}>Facile (3x3)</option>
                <option value={4}>Moyen (4x4)</option>
                <option value={5}>Difficile (5x5)</option>
              </select>
            </div>

            <div className="flex flex-col justify-center gap-3">
              <div className="text-lg text-gray-700 font-bold bg-gray-100 rounded-full px-4 py-2"><Timer className="inline w-5 h-5 mr-2" /> Temps : {formatTime(timer)}</div>
              <div className="text-lg text-gray-700 font-bold bg-gray-100 rounded-full px-4 py-2"><Shuffle className="inline w-5 h-5 mr-2" /> Coups : {moves}</div>
            </div>
          </div>

          <div className="flex gap-4 mt-6 flex-wrap justify-center">
            <button onClick={initializePuzzle} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform-gpu">
              🔄 Nouveau Puzzle
            </button>
            <button onClick={toggleHint} className={`text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform-gpu ${showHint ? 'bg-gradient-to-r from-yellow-500 to-amber-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'}`}>
              💡 {showHint ? 'Cacher' : 'Indice'}
            </button>
          </div>
        </div>        {moves > 0 && !isComplete && (
          <div className="text-center text-xl font-bold text-gray-700 animate-pulse mb-6 bg-gray-100 rounded-full py-3 px-6 shadow-lg border border-gray-300">
            ✨ Bravo ! Continue comme ça ! 🎈
          </div>
        )}

        {/* Instructions pour mobile */}
        {isMobile && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-4 mb-6 shadow-lg">
            <div className="text-center">
              <span className="text-blue-600 font-bold text-lg">
                📱 Mode Tactile : Clique sur deux pièces pour les échanger !
              </span>
              {selectedPiece && (
                <div className="mt-2 text-sm text-blue-500 animate-pulse">
                  Pièce sélectionnée : {selectedPiece.emoji} - Clique sur une autre pièce pour échanger
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-2xl p-6 mb-6 flex justify-center">
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: `repeat(${puzzleSize}, 1fr)` }}
          >
            {Array.from({ length: puzzleSize * puzzleSize }).map((_, position) => {
              const piece = getPieceAtPosition(position);
              const isSelected = selectedPiece && piece && selectedPiece.id === piece.id;

              return (
                <div
                  key={position}
                  className={`w-16 h-16 md:w-20 md:h-20 border-3 rounded-xl flex items-center justify-center text-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${piece?.isCorrect
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-400 bg-gray-50'
                    } ${isSelected
                      ? 'border-blue-500 bg-blue-100 ring-4 ring-blue-300'
                      : ''
                    } ${isMobile
                      ? 'cursor-pointer active:scale-95'
                      : 'cursor-move'
                    }`}
                  onDragOver={!isMobile ? handleDragOver : undefined}
                  onDrop={!isMobile ? (e) => handleDrop(e, position) : undefined}
                  onClick={isMobile && piece ? () => handlePieceClick(piece) : undefined}
                >
                  {piece && (
                    <div
                      draggable={!isMobile}
                      onDragStart={!isMobile ? (e) => handleDragStart(e, piece) : undefined}
                      className="w-full h-full flex items-center justify-center select-none"
                    >
                      {piece.emoji}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {showHint && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 mb-6 shadow-2xl">
            <h4 className="text-xl font-bold text-gray-700 mb-4 text-center">✨ Solution</h4>
            <div
              className="grid gap-2 justify-center"
              style={{ gridTemplateColumns: `repeat(${puzzleSize}, 1fr)`, width: 'fit-content', margin: '0 auto' }}
            >
              {Array.from({ length: puzzleSize * puzzleSize }).map((_, pos) => {
                const correct = pieces.find(p => p.correctPosition === pos);
                return (
                  <div key={pos} className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-xl bg-white border-2 border-gray-300 rounded-xl shadow-lg">
                    {correct?.emoji}
                  </div>
                );
              })}
            </div>
          </div>)}        {isComplete && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-50 border-4 border-yellow-400 rounded-3xl p-12 w-[500px] shadow-2xl text-center animate__animated animate__bounceIn">
                <div className="text-7xl mb-5">🎉</div>
                <h3 className="text-4xl font-bold text-yellow-600 mb-5">Félicitations !</h3><p className="text-xl text-gray-700 mb-3">
                  Tu as terminé en <span className="font-bold text-orange-600">{formatTime(timer)}</span>
                </p>
                <p className="text-xl text-gray-700 mb-7">
                  avec <span className="font-bold text-orange-600">{moves} coups</span> !
                </p>
                <div className="flex justify-center gap-2 mb-7">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-10 h-10 text-yellow-500 fill-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
                <button
                  onClick={() => {
                    setIsComplete(false);
                    initializePuzzle();
                  }}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  🔄 Nouveau Puzzle
                </button>
              </div>
            </div>
          )}        <div className="bg-gray-50 border-2 border-gray-200 rounded-3xl p-6 mt-6 shadow-2xl">
          <h3 className="font-bold text-gray-700 text-xl mb-4 text-center">👶 Comment jouer :</h3>
          <ul className="space-y-3 text-gray-700 font-semibold">
            {isMobile ? (
              <>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">👆</span>
                  Clique sur une pièce pour la sélectionner.
                </li>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">🔄</span>
                  Clique sur une autre pièce pour échanger leur place.
                </li>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">💚</span>
                  Les pièces vertes sont bien placées !
                </li>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">💡</span>
                  Tu peux regarder l'indice si tu es bloqué !
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">🖱️</span>
                  Glisse les pièces avec ta souris.
                </li>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">💚</span>
                  Les pièces vertes sont bien placées !
                </li>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">💡</span>
                  Tu peux regarder l'indice si tu es bloqué !
                </li>
                <li className="flex items-center gap-3 bg-white rounded-full py-2 px-4 border border-gray-200">
                  <span className="text-2xl">🌟</span>
                  Essaye de finir avec le moins de coups possible !
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PuzzlePage2;
