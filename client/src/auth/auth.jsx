import { useState } from "react";
import { MdAlternateEmail } from "react-icons/md";
import { FaFingerprint, FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { ArrowLeft, Backpack, CircleUserRound, Undo } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStateContext } from "../context/ContextProvider";


const Auth = () => {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setConnecte, setUser } = useStateContext();

  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const isLogin = location.pathname === "/login";

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordView = () => setShowPassword(!showPassword);


  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3002/user/login", { // adapte le port si besoin
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {

        toast.success("Connexion réussie");
         localStorage.setItem("token", data.token);
  setConnecte(true);
         setUser(data.user);
         localStorage.setItem("user", JSON.stringify(data.user));

        navigate("/stepper");
        // setEmail("");
        // setPassword("");
 
        

      } else {
        toast.error(data.message || "Erreur lors de la connexion");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur");
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:3002/user/ajouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pseudo, email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("Inscription réussie");
        setPseudo("");
        setEmail("");
        setPassword("");
      } else {
        toast.error(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      console.error(error);
      toast.error("Erreur serveur");
    }
  };

  return (
  <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-yellow-400 via-white to-blue-400">
  <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow-2xl flex flex-col items-center gap-5 transition-all duration-500 animate-fade-in-up relative w-full">

    {/* Icône retour en haut à gauche */}
    <Link to="/" className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 transition-colors">
      <ArrowLeft className="w-5 h-5" />
    </Link>
        <CircleUserRound className="w-16 h-16 text-yellow-500" />

        <h1 className="text-2xl font-bold text-blue-600">
          {isLogin ? "Connexion !" : "Inscription"}
        </h1>

        <p className="text-sm text-gray-600 text-center">
          {isLogin ? (
            <>
              Pas encore de compte ?{" "}
              <Link
                to="/register"
                className="text-yellow-500 font-semibold hover:underline cursor-pointer"
              >
                S’inscrire
              </Link>
            </>
          ) : (
            <>
              Vous avez déjà un compte ?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                Se connecter
              </Link>
            </>
          )}
        </p>

        <div className="w-full flex flex-col gap-3">
          {!isLogin && (
            <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-xl">
              <CircleUserRound className="text-blue-500" />
              <input
                type="text"
                value={pseudo}
                placeholder="Nom d'utilisateur"
                onChange={e => setPseudo(e.target.value)}
                className="bg-transparent w-full outline-none text-gray-700 placeholder-blue-400"
              />
            </div>
          )}

          <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-xl">
            <MdAlternateEmail className="text-blue-500" />
            <input
              type="email"
              placeholder="Adresse e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-blue-400"
            />
          </div>

          <div className="flex items-center gap-2 bg-blue-100 p-3 rounded-xl relative">
            <FaFingerprint className="text-blue-500" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-blue-400"
            />
            {showPassword ? (
              <FaRegEyeSlash
                className="absolute right-4 text-blue-500 cursor-pointer"
                onClick={togglePasswordView}
              />
            ) : (
              <FaRegEye
                className="absolute right-4 text-blue-500 cursor-pointer"
                onClick={togglePasswordView}
              />
            )}
          </div>
        </div>

        <button
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            try {
              if (isLogin) {
                await handleLogin();
              } else {
                await handleRegister();
              }
            } finally {
              setLoading(false);
            }
          }}
          className={`w-full py-2 rounded-xl font-semibold shadow-md transition-all duration-300 flex justify-center items-center gap-2
    ${isLogin
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-yellow-400 hover:bg-yellow-500 text-gray-800"} 
    ${loading && "opacity-70 cursor-not-allowed"}
  `}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
              Chargement...
            </div>
          ) : (
            isLogin ? "Se connecter" : "S’inscrire"
          )}
        </button>
        {isLogin && (
          <p className="text-sm text-blue-500 cursor-pointer hover:underline mt-2">
            Mot de passe oublié ?
          </p>
        )}
      </div>
    </div>
  );
};

export default Auth;
