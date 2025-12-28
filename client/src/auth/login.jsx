import React, { useState } from 'react';
import {
    User,
    Lock,
    Mail,
    Github,
    Facebook,
    Linkedin,
    CircleUserRound,
    Users,
    UsersRound,
    LucideUsersRound,
    UsersRoundIcon,
} from 'lucide-react';
import "./style.css"


export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <div className="bg-login-page min-h-screen flex justify-center items-center">
      <div className={`container relative w-[850px] h-[550px] bg-white rounded-[30px] shadow-[0_0_30px_rgba(0,0,0,0.2)] overflow-hidden ${isRegistering ? 'active' : ''}`}>
          {/* Login Form */}
            <div className="form-box login absolute right-0 w-1/2 h-full bg-white flex items-center text-center p-10 z-[1] transition-all ease-in-out duration-1000">
            
                <form className="w-full">
                <div className="flex justify-center mb-4">
            <CircleUserRound className="w-25 h-25 text-yellow-500 text-center"/>
            </div>
            <h1 className=" mb-5 mt-5 text-blue-500 text-center font-semibold">Connexion</h1>
                    <div className="input-box relative my-5">
                        <input type="text" placeholder="Pseudo" required className="w-full p-3 pr-12 bg-gray-200 rounded-md border-none outline-none text-base text-gray-800 font-medium placeholder:text-gray-500" />
                        <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-yellow-300 w-5 h-5" />
                    </div>
                    <div className="input-box relative my-5">
                        <input type="Mot de passe" placeholder="Mot de passe" required className="w-full p-3 pr-12 bg-gray-200 rounded-md border-none outline-none text-base text-gray-800 font-medium placeholder:text-gray-500" />
                        <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-yellow-300 w-5 h-5" />
                    </div>
                    <div className="forgot-link text-center mb-4 text-sm">
                        <a href="#" className="text-blue-500">Mot de passe oublié</a>
                    </div>
                    <button type="submit" className="btn w-full h-12 bg-blue-400 rounded-md text-white font-semibold">Se connecter</button>
            
                </form>
            </div>

            {/* Register Form */}
            <div className="form-box register absolute right-0 w-1/2 h-full bg-white flex items-center text-center p-10 z-[1] transition-all ease-in-out duration-1000" style={{ visibility: isRegistering ? 'visible' : 'hidden' }}>
                <form className="w-full">
                <div className="flex justify-center mb-4">
            <UsersRoundIcon className="w-25 h-25 text-yellow-500 text-center"/>
            </div>
                    <h1 className=" mb-5 mt-5 text-blue-500 text-center font-semibold">Inscription</h1>
                    <div className="input-box relative my-5">
                        <input type="text" placeholder="Pseudo" required className="w-full p-3 pr-12 bg-gray-200 rounded-md border-none outline-none text-base text-gray-800 font-medium placeholder:text-gray-500" />
                        <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-yellow-300 w-5 h-5" />
                    </div>
                    <div className="input-box relative my-5">
                        <input type="email" placeholder="Adresse mail" required className="w-full p-3 pr-12 bg-gray-200 rounded-md border-none outline-none text-base text-gray-800 font-medium placeholder:text-gray-500" />
                        <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-yellow-300 w-5 h-5" />
                    </div>
                    <div className="input-box relative my-5">
                        <input type="password" placeholder="Mot de passe" required className="w-full p-3 pr-12 bg-gray-200 rounded-md border-none outline-none text-base text-gray-800 font-medium placeholder:text-gray-500" />
                        <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-yellow-300 w-5 h-5" />
                    </div>
                    <button type="submit" className="btn w-full h-12 bg-blue-400 rounded-md text-white font-semibold">Enregistrer</button>
                                   
                </form>
            </div>

            {/* Toggle Panel */}
            <div className="toggle-box absolute w-full h-full">
                <div className="toggle-pannel toggle-left absolute w-1/2 h-full text-white flex flex-col justify-center items-center z-[2] transition-all">
                    <h1 className="text-2xl">Bienvenue sur Loupio !</h1>

                    <p className="text-base text-center px-4">Connecte-toi pour continuer à apprendre en t’amusant.</p>
                    <p className="mb-4">Vous n'avez pas de compte ?</p>
                    <button className="btn w-40 h-12 border-2 border-white bg-transparent text-white" onClick={() => setIsRegistering(true)}>S'inscrire</button>
                </div>
                <div className="toggle-pannel toggle-right absolute w-1/2 h-full right-0 text-white flex flex-col justify-center items-center z-[2] transition-all">
                    <h1 className="text-2xl font-bold mb-2">Rejoins Loupio !</h1>
                    <p className="text-base text-center px-4">
                        Crée ton compte et découvre un monde de jeux amusants, C’est gratuit et sécurisé !
                    </p>
                    <p className="mb-">Avez-vous un compte ?</p>
                    <button className="btn w-40 h-12 border-2 border-white bg-transparent text-white" onClick={() => setIsRegistering(false)}>Se connecter</button>
                </div>
            </div>
        </div></div>
    );
}
