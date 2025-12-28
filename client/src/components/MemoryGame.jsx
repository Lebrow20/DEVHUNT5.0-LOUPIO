import { ArrowLeft } from 'lucide-react';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';

const MemoryGame = () => {
  const symbols = ['🌟', '⚡', '🌈', '🎈', '🎵', '🎯', '🎨', '🎪'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [showVictoryPopup, setShowVictoryPopup] = useState(false);
  const [message, setMessage] = useState('Clique sur les cartes pour commencer !');
  const [confetti, setConfetti] = useState([]);

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const createGameBoard = useCallback(() => {
    const cardSymbols = [...symbols, ...symbols];
    const shuffledSymbols = shuffleArray(cardSymbols);

    const newCards = shuffledSymbols.map((symbol, index) => ({
      id: index,
      symbol,
      isFlipped: false,
      isMatched: false
    }));

    setCards(newCards);
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setMessage('🚀 C\'est parti !');
    setTimeout(() => {
      setMessage('Continue comme ça !');
    }, 1500);
  };

  const flipCard = (cardId) => {
    if (!gameStarted) {
      startGame();
    }

    if (flippedCards.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);
    setFlippedCards([...flippedCards, cardId]);
  };

  const checkMatch = useCallback(() => {
    if (flippedCards.length === 2) {
      const [card1Id, card2Id] = flippedCards;
      const card1 = cards.find(c => c.id === card1Id);
      const card2 = cards.find(c => c.id === card2Id);

      setMoves(prev => prev + 1);

      if (card1.symbol === card2.symbol) {
        // Paire trouvée
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === card1Id || c.id === card2Id
              ? { ...c, isMatched: true }
              : c
          ));
          setMatchedPairs(prev => prev + 1);
          setMessage('🎉 Bravo ! Paire trouvée !');
          setTimeout(() => setMessage('Continue comme ça !'), 1500);
          setFlippedCards([]);
        }, 500);
      } else {
        // Pas de paire
        setMessage('🤔 Essaie encore !');
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.id === card1Id || c.id === card2Id
              ? { ...c, isFlipped: false }
              : c
          ));
          setFlippedCards([]);
          setMessage('Continue comme ça !');
        }, 1200);
      }
    }
  }, [flippedCards, cards]);

  const createConfetti = () => {
    const confettiSymbols = ['🎉', '🎊', '⭐', '🌟', '✨', '🎈'];
    const newConfetti = [];

    for (let i = 0; i < 20; i++) {
      newConfetti.push({
        id: i,
        symbol: confettiSymbols[Math.floor(Math.random() * confettiSymbols.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: Math.random() * 2 + 2
      });
    }

    setConfetti(newConfetti);
    setTimeout(() => setConfetti([]), 4000);
  };
  const showVictoryScreen = useCallback(() => {
    setShowVictoryPopup(true);
    createConfetti();
    setMessage('🏆 Fantastique ! Tu as gagné !');
  }, []);

  const getPerformanceMessage = (moves) => {
    if (moves <= 20) return '🏆 Performance EXCEPTIONNELLE !';
    if (moves <= 30) return '⭐ Très bonne performance !';
    if (moves <= 40) return '👍 Bonne performance !';
    return '💪 Continue à t\'entraîner !';
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTime(0);
    setGameStarted(false);
    setShowVictoryPopup(false);
    setMessage('Clique sur les cartes pour commencer !');
    setConfetti([]);
  };

  const restartGame = () => {
    resetGame();
    createGameBoard();
  };

  const newGame = () => {
    resetGame();
    createGameBoard();
    setMessage('Nouveau défi ! Bonne chance !');
  };

  const closePopup = () => {
    setShowVictoryPopup(false);
  };

  const playAgain = () => {
    closePopup();
    newGame();
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (gameStarted && matchedPairs < 8) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs]);

  // Check match effect
  useEffect(() => {
    checkMatch();
  }, [checkMatch]);
  // Victory check effect
  useEffect(() => {
    if (matchedPairs === 8 && gameStarted) {
      setTimeout(showVictoryScreen, 1000);
    }
  }, [matchedPairs, gameStarted, showVictoryScreen]);

  // Initialize game
  useEffect(() => {
    createGameBoard();
  }, [createGameBoard]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating bubbles */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-56 h-56 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/2 w-60 h-60 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1500"></div>

        {/* Floating stars and sparkles */}
        <div className="absolute top-10 left-10 text-yellow-300 text-3xl animate-bounce delay-300 opacity-80">⭐</div>
        <div className="absolute top-20 right-20 text-pink-300 text-2xl animate-bounce delay-700 opacity-70">🌟</div>
        <div className="absolute bottom-32 left-20 text-blue-300 text-2xl animate-bounce delay-1000 opacity-75">✨</div>
        <div className="absolute bottom-10 right-10 text-purple-300 text-3xl animate-bounce delay-1300 opacity-80">💫</div>
        <div className="absolute top-1/3 left-1/2 text-green-300 text-xl animate-bounce delay-2000 opacity-60">🌈</div>
        <div className="absolute bottom-1/2 right-1/4 text-orange-300 text-2xl animate-bounce delay-1800 opacity-70">⚡</div>

        {/* Additional geometric shapes */}
        <div className="absolute top-16 right-1/3 w-4 h-4 bg-white rounded-full opacity-60 animate-ping delay-500"></div>
        <div className="absolute bottom-20 left-1/4 w-3 h-3 bg-yellow-200 rounded-full opacity-50 animate-ping delay-1200"></div>
        <div className="absolute top-1/2 left-16 w-5 h-5 bg-pink-200 rounded-full opacity-40 animate-ping delay-800"></div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/5"></div>
      </div>

      <div className="fixed z-50 ml-9 mt-3">
        <Link
          to="/sixanseducation"
          className="group flex items-center gap-3 px-6 py-3 bg-white/25 backdrop-blur-lg rounded-2xl text-white hover:bg-white/35 transition-all duration-300 border-2 border-white/40 shadow-xl hover:shadow-2xl hover:scale-110 font-semibold text-lg"
        >
          <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
          <span >Retour</span>
        </Link>
      </div>      <div className="relative z-10 min-h-screen flex flex-col items-center p-5 font-sans">

        {/* Confetti */}
        {confetti.map(item => (
          <div
            key={item.id}
            className="absolute text-2xl pointer-events-none animate-bounce"
            style={{
              left: `${item.left}%`,
              animationDelay: `${item.delay}s`,
              animationDuration: `${item.duration}s`,
              top: '-100px'
            }}
          >
            {item.symbol}
          </div>
        ))}

        {/* Header */}
        <div className="text-center mb-10 text-white">
          <h1 className="text-5xl font-extrabold mb-4 text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] animate-bounce">
            🌟 Jeu de Mémoire Magique 🌟
          </h1>
          <p className="text-xl font-medium text-blue-200 drop-shadow-md tracking-wide">
            Trouve toutes les paires de symboles !
          </p>
        </div>


        {/* Game Info */}
        <div className="flex gap-6 mb-8 text-white font-semibold text-lg flex-wrap justify-center">
          <div className="px-6 py-3 rounded-full backdrop-blur-md bg-[#FAD43B]/30 border border-[#FAD43B] shadow-md shadow-yellow-300/30">
            ⭐ Coups : {moves}
          </div>
          <div className="px-6 py-3 rounded-full backdrop-blur-md bg-[#0075ee]/30 border border-[#0075ee] shadow-md shadow-blue-400/30">
            ⏰ Temps : {formatTime(time)}
          </div>
          <div className="px-6 py-3 rounded-full backdrop-blur-md bg-[#f32450]/30 border border-[#f32450] shadow-md shadow-pink-400/30">
            🎯 Paires : {matchedPairs}/8
          </div>
        </div>


        {/* Game Board */}
        <div className="grid grid-cols-4 gap-4 max-w-2xl mb-8 p-5 bg-white bg-opacity-10 rounded-3xl backdrop-blur-md shadow-2xl">
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => flipCard(card.id)}
              className={`w-28 h-28 relative cursor-pointer transition-all duration-500 transform-gpu ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''
                } ${card.isMatched ? 'scale-110' : 'hover:scale-105'}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Back */}
              <div className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-yellow-400 via-orange-400 to-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-4xl transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-0' : 'opacity-100'
                }`}>
                ✨
              </div>

              {/* Card Front */}
              <div className={`absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-blue-300 via-blue-600 to-yellow-400 border-4 border-white shadow-lg flex items-center justify-center text-4xl text-white transition-opacity duration-300 ${card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'
                }`}>
                {card.symbol}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-5 mb-6 flex-wrap justify-center">
          <button
            onClick={restartGame}
            className="px-6 py-3 bg-gradient-to-r from-[#f32450] to-red-500 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            🔄 Recommencer
          </button>
          <button
            onClick={newGame}
            className="px-6 py-3 bg-gradient-to-r from-[#0075ee] to-blue-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            🎮 Nouveau Jeu
          </button>
        </div>


        {/* Message */}
        <div className={`text-xl font-bold text-center text-white drop-shadow-lg min-h-8 ${matchedPairs === 8 ? 'animate-pulse text-yellow-300 text-2xl' : ''
          }`}>
          {message}
        </div>        {/* Victory Popup */}
        {showVictoryPopup && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <div className="bg-gradient-to-br from-yellow-100 via-orange-50 to-yellow-50 border-4 border-yellow-400 rounded-3xl p-12 w-[500px] shadow-2xl text-center animate__animated animate__bounceIn">
              <div className="text-7xl mb-5">🎉</div>
              <h2 className="text-4xl font-bold text-yellow-600 mb-5">BRAVO !</h2>

              <div className="text-gray-700 text-xl mb-5">
                <p className="mb-2">🌟 Tu as terminé le jeu ! 🌟</p>
                <p className="text-lg">Tu es un champion de la mémoire !</p>
              </div>

              <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-5 mb-7">
                <div className="text-gray-700 font-bold space-y-2">
                  <div className="text-lg">⭐ Nombre de coups: <span className="text-orange-600">{moves}</span></div>
                  <div className="text-lg">⏰ Temps total: <span className="text-orange-600">{formatTime(time)}</span></div>
                  <div className="text-lg mt-3 text-purple-600">{getPerformanceMessage(moves)}</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center flex-wrap">
                <button
                  onClick={playAgain}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  🎮 Rejouer
                </button>
                <button
                  onClick={closePopup}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  ✨ Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Responsive Design for Mobile */}
        <style jsx>{`
        @media (max-width: 640px) {
          .grid-cols-4 {
            grid-template-columns: repeat(3, 1fr);
          }
          .w-28 {
            width: 5rem;
          }
          .h-28 {
            height: 5rem;
          }
          .text-3xl {
            font-size: 1.5rem;
          }
        }
      `}</style>
      </div>
    </div>
  );
};

export default MemoryGame;