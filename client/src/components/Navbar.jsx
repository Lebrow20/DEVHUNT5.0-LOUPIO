import { Baby, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStateContext } from '../context/ContextProvider';

const Navbar = () => {

  const { connecte, setConnecte, modifiable, user, setUser } = useStateContext();
  const [scroll, setscroll] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  // connecte = useStateContext();
  const location = useLocation();
  const isParent = location.pathname === "/guest/parent";

  const handleLog = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setConnecte(false);
    setUser(null);
  };



  const getInitials = (email) => {
    if (!email) return 'U';
    const parts = email.split('@')[0];
    return parts.charAt(0).toUpperCase();
  };

  useEffect(() => {
    const handleScroll = () => {
      setscroll(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav className='sticky top-0 pb-3 border-b z-50 backdrop-blur-lg text-amber-50 transition-all duration-500'>
        <div className="relative w-full">
          {/* background principal */}
          <div className={`relative z-10 ${scroll
            ? 'bg-[#fad43bc4] h-20'
            : 'bg-[#FAD43B] h-30'
            }`} />
          {!scroll && (
            <>
              {/* svg haut */}
              <svg
                className="absolute top-0 left-0 w-full h-5 z-20"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
              >
                <path
                  fill="#FAD43B"
                  d="M0,50 C300,0 1140,100 1440,50 L1440,0 L0,0 Z"
                />
              </svg>

              {/* svg bas */}
              <svg
                className="absolute bottom-0 left-0 w-full h-14 z-20"
                viewBox="0 0 1440 100"
                preserveAspectRatio="none"
              >
                <path
                  fill="#FFF59D"
                  d="M0,30 C660,90 1080,-30 1440,30 L41440,100 L0,100 Z"
                />
              </svg>
            </>)}

          {/* boutons navbar */}
          <div className={`absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 transition-all duration-500 ${scroll
            ? 'h-20'
            : 'h-26'
            }`}>            <div className='flex items-center space-x-3'>
              <Link to="/" className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200">
                <div className="relative">
                  <div className="w-10 h-10 bg-transparent rounded-full flex items-center justify-center">
                    <Baby className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFF59D] rounded-full animate-pulse"></div>
                </div>
                <div className="text-white text-xl font-bold flex-shrink-0"><span className='meow text-3xl'>L</span>oupiot</div>
              </Link>
            </div>


            {(connecte == false) ? (
              <div className="flex gap-3">
                <Link to="/login">
                  <button className="bg-[#0075ee] text-white px-5 py-2 rounded-full shadow-md">
                    Connexion
                  </button>
                </Link>

                <Link to="/register">
                  <button className="bg-[#f32450] text-white px-5 py-2 rounded-full shadow-md">
                    S'inscrire
                  </button>
                </Link>
              </div>
            ) :
              (<div className="flex gap-3 relative">
                {isParent ? (
                  <Link to="/stepper" className='cursor-pointer'>
                    <button className="bg-[#0075ee] text-white px-5 py-2 rounded-full shadow-md">Accueil</button>
                  </Link>) :
                  <Link to="/guest/parent" >
                    <button className="bg-[#0075ee] text-white px-5 py-2 rounded-full shadow-md">{modifiable ? 'Parent' : 'Temps'}</button>
                  </Link>
                }

                {/* avatar */}
                <div className="relative">
                  <button
                    className="bg-[#f32450] text-white w-10 h-10 rounded-full shadow-md flex items-center justify-center font-semibold hover:bg-[#e11d42] transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {getInitials(user?.email ?? "inconnu@inconnu.com")}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-12 bg-white rounded-lg shadow-lg border py-2 min-w-48 z-50">
                      <button
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => {
                          setShowDropdown(false);
                          handleLog();
                        }}
                      >
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>

                {showDropdown && (
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowDropdown(false)}
                  ></div>
                )}
              </div>
              )
            }
          </div>
        </div>

      </nav>
    </>
  )
}

export default Navbar