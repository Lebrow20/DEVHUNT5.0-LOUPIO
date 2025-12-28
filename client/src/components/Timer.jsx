import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';

export default function Timer() {

  const { connecte, setConnecte, timeLeft, setTimeLeft, isActive, setIsActive, endTime, setEndTime, modifiable, setModifiable } = useStateContext();
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const navigate = useNavigate();

  const saveTimerState = (endTimeValue, isActiveValue) => {
    localStorage.setItem('timerEndTime', endTimeValue.toString());
    localStorage.setItem('timerIsActive', isActiveValue.toString());
  };


  const restoreTimerState = () => {
    const savedEndTime = localStorage.getItem('timerEndTime');
    const savedIsActive = localStorage.getItem('timerIsActive');

    if (savedEndTime && savedIsActive === 'true') {
      const endTimeValue = parseInt(savedEndTime);
      const now = Date.now();

      if (endTimeValue > now) {
        // Le timer est encore valide
        setEndTime(endTimeValue);
        setIsActive(true);
        const remainingTime = Math.round((endTimeValue - now) / 1000);
        setTimeLeft(remainingTime);
        return true;
      } else {
        // Le timer a expiré pendant que l'utilisateur était absent
        localStorage.removeItem('timerEndTime');
        localStorage.removeItem('timerIsActive');
        setConnecte(false);
        navigate("/login");
        return false;
      }
    }
    return false;
  };

  useEffect(() => {
    restoreTimerState();
  }, []);

  useEffect(() => {
    if (!endTime || !isActive) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.round((endTime - now) / 1000);

      if (diff <= 0) {

        setTimeLeft(0);
        setConnecte(false);
        setIsActive(false);
        localStorage.removeItem("token");
        setModifiable(true);

        // Nettoyer localStorage
        localStorage.removeItem('timerEndTime');
        localStorage.removeItem('timerIsActive');

        clearInterval(interval);

        // Déconnexion forcée peu importe la page
        window.location.href = "/login";
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setConnecte(false);
        setUser(null);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, isActive, setTimeLeft, setConnecte, setIsActive, setModifiable]);

  // Vérification périodique même quand le composant n'est pas monté
  useEffect(() => {
    const globalCheck = setInterval(() => {
      const savedEndTime = localStorage.getItem('timerEndTime');
      const savedIsActive = localStorage.getItem('timerIsActive');

      if (savedEndTime && savedIsActive === 'true') {
        const endTimeValue = parseInt(savedEndTime);
        const now = Date.now();

        if (endTimeValue <= now) {
          // Timer expiré, déconnexion forcée
          localStorage.removeItem('timerEndTime');
          localStorage.removeItem('timerIsActive');
          localStorage.removeItem("token");
          setConnecte(false);
          window.location.href = "/";
        }
      }
    }, 5000); // Vérification toutes les 5 secondes

    return () => clearInterval(globalCheck);
  }, []);

  const startTimer = () => {
    setModifiable(!modifiable);
    const totalSeconds = minutes * 60 + seconds;
    const end = Date.now() + totalSeconds * 1000;

    setTimeLeft(totalSeconds);
    setEndTime(end);
    setIsActive(true);

    // Sauvegarder l'état
    saveTimerState(end, true);

    setTimeout(() => navigate("/stepper"), 1700);
  };

  const stopTimer = () => {
    setIsActive(false);
    // Nettoyer localStorage
    localStorage.removeItem('timerEndTime');
    localStorage.removeItem('timerIsActive');
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setConnecte(true);
    setModifiable(true);

    // Nettoyer localStorage
    localStorage.removeItem('timerEndTime');
    localStorage.removeItem('timerIsActive');
  };

  const formatTime = (time) => {
    const mins = Math.floor(time / 60);
    const secs = time % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft > 0 ? ((minutes * 60 + seconds - timeLeft) / (minutes * 60 + seconds)) * 100 : 0;

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-xl">
      {/* status */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${connecte ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${connecte ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
          {connecte ? 'Connecté' : 'Déconnecté'}
        </div>
      </div>

      {/* timer */}
      <div className="text-center mb-8">
        <div className="relative w-48 h-48 mx-auto">
          {/* progression */}
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={isActive ? "#ef4444" : "#3b82f6"}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className={`text-4xl font-bold ${isActive ? 'text-[#f32450]' : 'text-gray-700'}`}>
                {isActive ? formatTime(timeLeft) : formatTime(minutes * 60 + seconds)}
              </div>
              {isActive && (
                <div className="text-sm text-gray-500 mt-1">
                  {timeLeft > 60 ? 'minutes restantes' : 'secondes restantes'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* sélecteur */}
      {!isActive && (
        <div className="flex gap-4 mb-6 justify-center">
          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(60)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>

          <div className="text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">Secondes</label>
            <select
              value={seconds}
              onChange={(e) => setSeconds(Number(e.target.value))}
              className="w-20 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {[...Array(60)].map((_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* boutons démarrer, réinitialiser */}
      {modifiable && (
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <button
              onClick={startTimer}
              disabled={minutes === 0 && seconds === 0}
              className="px-6 py-3 bg-blue-500 text-white rounded-full font-medium hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Démarrer
            </button>
          ) : (

            <button
              onClick={stopTimer}
              className="px-6 py-3 bg-[#f32450] text-white rounded-full font-medium hover:bg-[#f32451c2] transition-colors"
            >
              Arrêter
            </button>
          )}

          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-gray-500 text-white rounded-full font-medium hover:bg-gray-600 transition-colors"
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
}