import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative">
      <div className="bg-gradient-to-b from-[#fff] to-[#e7f3fd] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12 w-1/2 m-auto">
            {/* liens */}
            <div>
              <h4 className="text-xl font-bold text-[#9090a0] mb-6">Liens rapides</h4>
              <ul className="space-y-3">
                {[
                  'Studio Art',
                  'Jeux éducatifs', 
                  'Lecture',
                ].map((link, index) => (
                  <li key={index}>
                    <a href="#" className="text-[#9090a0] hover:text-purple-600 transition-colors duration-200 flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full"></div>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* contact */}
            <div>
              <h4 className="text-xl font-bold text-[#9090a0] mb-6">Contact</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-[#f32450] p-2 rounded-lg mt-1">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[#9090a0] font-medium">Email</p>
                    <p className="text-[#9090a0] text-sm">email@contact.mg</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 p-2 rounded-lg mt-1">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[#9090a0] font-medium">Téléphone</p>
                    <p className="text-[#9090a0] text-sm">01 23 45 67 89</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* plus */}
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-8 mb-12">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-[#9090a0] mb-4">
                 Restez informé de nos nouveautés !
              </h4>
              <p className="text-[#9090a0] mb-6">
                Recevez nos dernières activités et conseils créatifs.
              </p>
              {/* <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-3 rounded-full border-2 border-purple-200 focus:border-purple-400 focus:outline-none text-gray-700"
                />
                <button className="bg-[#f32450] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#f32451ec] transition-all duration-200 transform hover:scale-105 shadow-lg">
                  S'abonner
                </button>
              </div> */}
            </div>
          </div>

          {/* barre du bas */}
          <div className="border-t-2 border-white/30 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-[#9090a0] text-center md:text-left">
                 2025   Tous droits réservés. 
                <span className="inline-block ml-2">Fait pour les enfants</span>
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-[#9090a0] hover:text-[#f32450] transition-colors">
                  Mix All
                </a>
                <a href="#" className="text-[#9090a0] hover:text-purple-600 transition-colors">
                  E F F F M M .
                </a>
                <a href="#" className="text-[#9090a0] hover:text-[#0075ee] transition-colors">
                  D 5.0
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ronds */}
      <div className="absolute top-20 left-10 w-8 h-8 bg-pink-300 rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-32 right-20 w-6 h-6 bg-purple-300 rounded-full opacity-60 animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-blue-300 rounded-full opacity-60 animate-pulse" style={{animationDelay: '2s'}}></div>
    </footer>
  );
};

export default Footer;