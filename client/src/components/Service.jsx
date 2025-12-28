import { Gamepad } from "lucide-react";
import { Link } from "react-router-dom";

 const Service = () => {
  const activites = [
    {
      title: "Studio Art",
      image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=200&fit=crop",
      description: " Laisse parler ta créativité ! Dessine, colorie, imagine tout ce que tu souhaites.",
      bgColor: "bg-gradient-to-br from-green-100 to-emerald-50",
      borderColor: "border-green-200",
      link:"/drawing"
    },
    {
      title: "Jeux éducatifs",
      image: "https://cdn.pixabay.com/photo/2020/05/20/03/50/gears-5193383_1280.png?w=400&h=200&fit=crop",
      description: "Amuse-toi tout en apprenant ! Découvre des jeux rigolos pour développer ta logique et ta curiosité.",
      bgColor: "bg-gradient-to-br from-purple-100 to-pink-50",
      borderColor: "border-purple-200",
      link:"/education"
    },
    {
      title: "Lecture",
      image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop",
      description: "Plonge dans des histoires magiques ! Découvre des contes et des aventures à partager.",
      bgColor: "bg-gradient-to-br from-orange-100 to-yellow-50",
      borderColor: "border-orange-200",
      link:"/minilecteur"
    }
  ];

  return (
    <section id="service" className='bg-gradient-to-b from-[#fff] to-[#e7f3fd] min-h-screen'>
      <div className='relative'>
        {/* ondulation */}
        <svg 
          className="absolute top-0 left-0 w-full h-20 z-10"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
        >
          <path
            fill="white"
            d="M0,50 C400,0 1040,100 1440,50 L1440,0 L0,0 Z"
            opacity="0.1"
          />
        </svg>
      </div>
      
      <div className='pt-10 pb-20'>
        <h1 className='text-center text-5xl font-bold text-[#9090a0] mb-4'>
          Tes activités
        </h1>
        <p className='text-center text-[#9090a0] text-[2rem] mb-16 max-w-2xl mx-auto px-6'>
          Plonge dans un monde où jouer devient magique, où créer et apprendre deviennent facile
        </p>
        
        <div className='flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-6'>
          {activites.map((activite, index) => (
             <Link to={activite.link}>
            <div            
              key={index}
              className={`group relative rounded-2xl border-2 ${activite.borderColor} ${activite.bgColor} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 w-80 overflow-hidden`}
            >
              {/* img container */}
              <div className='relative h-48 overflow-hidden rounded-t-xl'>
                <img 
                  src={activite.image}
                  alt={activite.title}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
              </div>
              
              {/* contenu*/}
              <div className='p-6'>
                <h3 className='text-2xl font-bold text-gray-800 mb-3'>{activite.title}</h3>
                <p className='text-gray-600 mb-6 leading-relaxed'>{activite.description}</p>
                
                {/* icône */}
                <div className='flex justify-center'>
                  <div className='bg-red-500 hover:bg-red-600 p-4 rounded-full transition-colors duration-200 cursor-pointer group'>
                  <Link to="/drawing">
                    <Gamepad className='text-white w-6 h-6' />
                  </Link>
                  </div>
                </div>
              </div>
              
              {/* hover */}
              <div className='absolute inset-0 bg-gradient-to-t from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/*  */}
      <svg 
        className="w-full h-20"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
      >
        <path
          fill="white"
          d="M0,50 C400,100 1040,0 1440,50 L1440,100 L0,100 Z"
        />
      </svg>
    </section>
  );
}

export default Service;