import { createContext, useContext, useEffect, useState } from 'react';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
 const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

   const [connecte, setConnecte] = useState(() => {
  const token = localStorage.getItem("token");
  return !!token;
});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [endTime, setEndTime] = useState(null);
  const [modifiable, setModifiable] = useState(true)
 const logout = () => {
  setConnecte(false);
  localStorage.removeItem("token");
};

return (
    <StateContext.Provider value={{
      connecte, setConnecte, logout, timeLeft,
      setTimeLeft,
      isActive,
      setIsActive, endTime, setEndTime, modifiable, setModifiable, user, setUser 
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
