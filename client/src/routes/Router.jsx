import { createBrowserRouter, Navigate } from "react-router-dom";

import MonModele3D from "../pages/MonModele3D";
import Accueil from "../pages/Accueil";
import Guest from "../pages/Guest";
import Parent from "../pages/Parent";
import Auth from "../auth/auth";
import Stepper from "../pages/Stepper";
import DrawingCanvas from "../components/DrawingCanvas";
import MemoryGame from "../components/MemoryGame";
import PrivateRoute from "./PrivateRoutes";

import EnfantsQuatre from "../pages/EnfantsQuatre";
import Lecteur from "../pages/Lecteur";
import Puzzle2 from "../pages/Puzzle2";
import Puzzle from "../pages/Puzzle";
import MathQuiz from "../components/MathQuiz";
import MathQuizP from "../pages/MathQuizP";
import Memory from "../pages/Memory";

import MetierAvenir from "../pages/MetierAvenir"
import EnfantsSix from "../pages/EnfantsSix";
const Router = createBrowserRouter([
  {
    path: "/",
    element: <Accueil />,
  },
  {
    path: "/login",
    element: <Auth />,
  },
  {
    path: "/metier",
    element: <MetierAvenir />,
  },
  {
    path: "/register",
    element: <Auth />,
  },

  {
    path: "/stepper",
    element: (
      <PrivateRoute>
        <Stepper />
      </PrivateRoute>
    ),
  },
  {
    path: "/education",
    element: (
      <PrivateRoute>
        <EnfantsQuatre />
      </PrivateRoute>
    ),
  },
  {
    path: "/sixanseducation",
    element:
      (
        <PrivateRoute>
          <EnfantsSix />
        </PrivateRoute>
      ),
  },

  {
    path: "/guest",
    element: (
      <PrivateRoute><Guest /></PrivateRoute>
    ),
  },
  {
    path: "/guest/parent",
    element:
      <PrivateRoute>
        <Parent />
      </PrivateRoute>,
  },
  {
    path: "/puzzle",
    element: (
      <PrivateRoute>
        <Puzzle />
      </PrivateRoute>)
  },
  {
    path: "/puzzle2",
    element: (
      <PrivateRoute>
        <Puzzle2 />
      </PrivateRoute>)
  },
  {
    path: "/memory",
    element:
      (
        <PrivateRoute>
          <Memory />
        </PrivateRoute>)
  },
  {
    path: "/minilecteur",
    element: (
      <PrivateRoute>
        <Lecteur />
      </PrivateRoute>),
  },
  {
    path: "/monModele",
    element: (
      <PrivateRoute>
        <MonModele3D />
      </PrivateRoute>)
  },
  {
    path: "/drawing",
    element:
      (<PrivateRoute>
        <DrawingCanvas />
      </PrivateRoute>)
  },

  {
    path: "/mathquiz",
    element:
      (<PrivateRoute>
        <MathQuizP />
      </PrivateRoute>)
  }
]);

export default Router