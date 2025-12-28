import React, { useState, useEffect, useRef } from 'react';
import {
  Trophy,
  Image as ImageIcon,
  LayoutGrid,
  Lightbulb,
  RefreshCcw,
  ArrowLeft
} from 'lucide-react'
import { Link } from 'react-router-dom';


const shuffleArray = (array) => {
  const newArray = [...array];
  let currentIndex = newArray.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
  }
  return newArray;
};

export default function PuzzlePage() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [pieces, setPieces] = useState([]);
  const [slots, setSlots] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [pieceSize, setPieceSize] = useState({ width: 0, height: 0 });
  const [gameState, setGameState] = useState('config');
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const puzzleContainerRef = useRef(null);
  const [draggedPiece, setDraggedPiece] = useState(null);

  const resetGame = () => {
    setGameState('config');
    setPieces([]);
    setSlots([]);
    setIsComplete(false);
    setScore(0);
    setImageUrl(null);
  };

  const startGame = () => {
    if (imageUrl) {
      setGameState('playing');
      setIsComplete(false);
      setScore(0);
    }
  };

  // Vérifier si le puzzle est terminé
  useEffect(() => {
    if (slots.length > 0 && pieces.length === 0) {
      const correctPieces = slots.filter(slot =>
        slot.acceptedPiece && slot.acceptedPiece.correctSlotId === slot.id
      ).length;

      setScore(correctPieces);

      if (correctPieces === slots.length) {
        setIsComplete(true);
      }
    }
  }, [slots, pieces]);

  useEffect(() => {
    if (gameState !== 'playing' || !imageUrl || !puzzleContainerRef.current) return;

    const img = new Image();
    img.onload = () => {
      const container = puzzleContainerRef.current;

      // Taille adaptée pour enfants : puzzle plus grand
      const maxPuzzleWidth = Math.min(container.offsetWidth - 40, 500);
      const maxPuzzleHeight = Math.min(container.offsetHeight - 40, 400);

      const imgAspectRatio = img.width / img.height;
      const containerAspectRatio = maxPuzzleWidth / maxPuzzleHeight;

      let puzzleWidth, puzzleHeight;

      if (imgAspectRatio > containerAspectRatio) {
        puzzleWidth = maxPuzzleWidth;
        puzzleHeight = puzzleWidth / imgAspectRatio;
      } else {
        puzzleHeight = maxPuzzleHeight;
        puzzleWidth = puzzleHeight * imgAspectRatio;
      }

      // Dimensions minimum pour enfants
      puzzleWidth = Math.max(puzzleWidth, 300);
      puzzleHeight = Math.max(puzzleHeight, 200);

      setImageSize({ width: puzzleWidth, height: puzzleHeight });

      const totalPieces = rows * cols;
      const pieceWidth = puzzleWidth / cols;
      const pieceHeight = puzzleHeight / rows;

      // Taille minimum des pièces pour enfants (au moins 60px)
      const adjustedPieceWidth = Math.max(pieceWidth, 60);
      const adjustedPieceHeight = Math.max(pieceHeight, 60);

      setPieceSize({ width: adjustedPieceWidth, height: adjustedPieceHeight });

      const initialPieces = Array.from({ length: totalPieces }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const correctSlotId = i + 1;
        return {
          id: i + 1,
          correctSlotId,
          row,
          col,
          style: {
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${puzzleWidth}px ${puzzleHeight}px`,
            backgroundPosition: `-${col * pieceWidth}px -${row * pieceHeight}px`,
            width: `${adjustedPieceWidth}px`,
            height: `${adjustedPieceHeight}px`,
            minWidth: `${adjustedPieceWidth}px`,
            minHeight: `${adjustedPieceHeight}px`,
          },
        };
      });

      setPieces(shuffleArray(initialPieces));

      const initialSlots = Array.from({ length: totalPieces }, (_, i) => ({
        id: i + 1,
        acceptedPiece: null,
        style: {
          width: `${pieceWidth}px`,
          height: `${pieceHeight}px`,
          minWidth: `${pieceWidth}px`,
          minHeight: `${pieceHeight}px`,
        }
      }));
      setSlots(initialSlots);
    };

    img.onerror = () => {
      alert('Erreur lors du chargement de l\'image. Veuillez essayer une autre image.');
    };

    img.src = imageUrl;
  }, [gameState, imageUrl, rows, cols]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target.result);
      };
      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragStart = (e, piece) => {
    setDraggedPiece(piece);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', piece.id.toString());
  };

  const handleDragEnd = () => {
    setDraggedPiece(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, slotId) => {
    e.preventDefault();

    if (!draggedPiece) return;

    const targetSlot = slots.find(s => s.id === slotId);
    if (!targetSlot || targetSlot.acceptedPiece) {
      return;
    }

    // Si la pièce vient d'un autre slot, la libérer
    setSlots(prevSlots =>
      prevSlots.map(slot => {
        if (slot.acceptedPiece && slot.acceptedPiece.id === draggedPiece.id) {
          // Décrémenter le score si la pièce était bien placée
          if (slot.acceptedPiece.correctSlotId === slot.id) {
            setScore(prev => prev - 1);
          }
          return { ...slot, acceptedPiece: null };
        }
        if (slot.id === slotId) {
          // Incrémenter le score si la pièce est bien placée
          if (draggedPiece.correctSlotId === slotId) {
            setScore(prev => prev + 1);
          }
          return { ...slot, acceptedPiece: draggedPiece };
        }
        return slot;
      })
    );

    // Retirer la pièce de la liste des pièces disponibles
    setPieces(prevPieces => prevPieces.filter(p => p.id !== draggedPiece.id));
    setDraggedPiece(null);
  };

  const handleSlotClick = (slot) => {
    if (slot.acceptedPiece) {
      // Décrémenter le score si la pièce était bien placée
      if (slot.acceptedPiece.correctSlotId === slot.id) {
        setScore(prev => prev - 1);
      }
      // Remettre la pièce dans la liste des pièces disponibles
      setPieces(prev => [...prev, slot.acceptedPiece]);
      setSlots(prevSlots =>
        prevSlots.map(s =>
          s.id === slot.id ? { ...s, acceptedPiece: null } : s
        )
      );
    }
  };

  const handlePieceClick = (piece) => {
    // Pour les plus jeunes : clic pour placer automatiquement dans le bon slot
    const correctSlot = slots.find(s => s.id === piece.correctSlotId);
    if (correctSlot && !correctSlot.acceptedPiece) {
      setSlots(prevSlots =>
        prevSlots.map(slot =>
          slot.id === piece.correctSlotId
            ? { ...slot, acceptedPiece: piece }
            : slot
        )
      );
      setPieces(prevPieces => prevPieces.filter(p => p.id !== piece.id));
      // Incrémenter le score car la pièce est placée au bon endroit
      setScore(prev => prev + 1);
    }
  };

  if (gameState === 'config') {
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
        <div className="flex flex-col items-center p-6 min-h-screen text-gray-800">

          <h1 className="text-4xl font-extrabold mb-10 text-center text-blue-600 drop-shadow-md">
            🧩 Mon Super Puzzle ! 🧩
          </h1>

          <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200 transition-all duration-300 hover:shadow-yellow-300">

            {/* Upload image */}
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-blue-700"> Choisis ton image :</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-yellow-100 file:text-yellow-700 hover:file:bg-yellow-200
                   file:cursor-pointer cursor-pointer"
              />
              {imageUrl && (
                <div className="mt-4 p-2 border rounded-xl shadow-inner">
                  <img src={imageUrl} alt="Aperçu" className="rounded-lg max-w-full h-auto max-h-48 mx-auto" />
                </div>
              )}
            </div>

            {/* Lignes */}
            <div className="mb-4">
              <label className="block mb-2 text-lg font-semibold text-blue-700"> Lignes :</label>
              <select
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg
                   focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value={2}>2 (Facile)</option>
                <option value={3}>3 (Moyen)</option>
                <option value={4}>4 (Difficile)</option>
              </select>
            </div>

            {/* Colonnes */}
            <div className="mb-6">
              <label className="block mb-2 text-lg font-semibold text-blue-700">📐 Colonnes :</label>
              <select
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-700 text-lg
                   focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
              >
                <option value={2}>2 (Facile)</option>
                <option value={3}>3 (Moyen)</option>
                <option value={4}>4 (Difficile)</option>
                <option value={5}>5 (Expert)</option>
              </select>
            </div>

            {/* Bouton */}
            <button
              onClick={startGame}
              disabled={!imageUrl}
              className={`w-full py-4 px-6 rounded-xl text-lg font-bold transition-all duration-300 ease-in-out transform hover:scale-105
        ${imageUrl
                  ? 'bg-yellow-400 hover:bg-yellow-500 text-white shadow-lg'
                  : 'bg-gray-400 text-gray-300 cursor-not-allowed'
                }`}
            >
              🚀 Commencer à jouer !
            </button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="flex flex-col p-6 min-h-screen text-white bg-gradient-to-br from-yellow-300 via-white to-blue-800">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-blue-800 flex items-center gap-2">
          <Link to="/education" className=" text-blue-700 hover:text-blue-900 transition-colors">
            <ArrowLeft className="cursor-pointer w-6 h-6" />
          </Link> Mon Super Puzzle ! <LayoutGrid className="text-yellow-600 w-7 h-7" />
        </h1>
        <div className="flex gap-4 items-center flex-wrap">
          <div className="bg-yellow-400 text-gray-800 px-4 py-2 rounded-full font-bold text-lg shadow-md">
            ⭐ Score: {score}/{rows * cols}
          </div>
          {isComplete && (
            <div className="bg-pink-400 text-white px-6 py-3 rounded-full font-bold text-lg animate-bounce flex items-center gap-2 shadow-lg">
              <Trophy className="w-5 h-5" /> Bravo ! Tu as gagné !
            </div>
          )}
          <button
            onClick={resetGame}
            className="bg-blue-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded-full transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <RefreshCcw className="w-5 h-5" /> Nouveau puzzle
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 flex-1 min-h-0">
        {/* Zone principale */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Image de référence */}
          <div className="bg-white/20 p-5 rounded-2xl border border-blue-300/30 shadow-lg">
            <h2 className="text-xl font-semibold text-center text-blue-900 mb-3 flex justify-center items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-700" /> Image à reproduire
            </h2>
            <div className="flex justify-center">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt="Modèle"
                  className="rounded-xl max-h-48 w-auto object-contain border border-blue-300 shadow-md"
                />
              )}
            </div>
          </div>

          {/* Puzzle zone */}
          <div
            className="flex-1 border-4 border-dashed border-blue-300/40 rounded-2xl p-6 flex items-center justify-center bg-white/30 shadow-inner"
            ref={puzzleContainerRef}
          >
            {imageSize.width > 0 && (
              <div
                className="grid gap-2 bg-white/20 rounded-xl p-4 shadow-xl"
                style={{
                  gridTemplateColumns: `repeat(${cols}, 1fr)`,
                  width: `${imageSize.width + 32}px`,
                  height: `${imageSize.height + 32}px`,
                }}
              >
                {slots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`border-4 rounded-xl cursor-pointer transition-all duration-300 ${slot.acceptedPiece
                      ? slot.acceptedPiece.correctSlotId === slot.id
                        ? 'border-green-400 shadow-green-300/50 shadow-md scale-105'
                        : 'border-yellow-400 shadow-yellow-300/50 shadow-md'
                      : 'border-blue-200 hover:border-blue-400 hover:bg-blue-100/20'
                      }`}
                    style={{
                      ...slot.style,
                      ...(slot.acceptedPiece ? slot.acceptedPiece.style : {}),
                    }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, slot.id)}
                    onClick={() => handleSlotClick(slot)}
                    title={
                      slot.acceptedPiece
                        ? 'Cliquer pour retirer la pièce'
                        : 'Glisser une pièce ici'
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pièces disponibles */}
        <div className="w-full xl:w-96 bg-white/30 rounded-2xl p-4 border border-blue-300/30 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-center text-blue-800">
            🧩 Pièces disponibles ({pieces.length})
          </h3>
          <div className="grid grid-cols-2 gap-4 max-h-135 overflow-y-auto pr-2">
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className="cursor-pointer rounded-xl border-4 border-white/30 hover:border-blue-400 transition-all transform hover:scale-110 shadow-md bg-white/20"
                style={{
                  ...piece.style,
                  width: '100%',
                  aspectRatio: '1',
                }}
                draggable
                onDragStart={(e) => handleDragStart(e, piece)}
                onDragEnd={handleDragEnd}
                onClick={() => handlePieceClick(piece)}
                title={`Pièce ${piece.id}`}
              />
            ))}
          </div>

          {pieces.length === 0 && !isComplete && (
            <div className="text-center mt-6 p-4 bg-yellow-300/30 rounded-xl text-blue-900 font-medium shadow">
              Toutes les pièces sont placées ! Vérifie si elles sont au bon endroit.
            </div>
          )}

          <div className="mt-5 p-4 bg-blue-100/40 rounded-xl text-blue-900 text-center text-sm font-semibold flex items-center gap-2 justify-center">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            Astuce : Clique ou glisse les pièces pour les placer !
          </div>
        </div>
      </div>
    </div>
  );
}