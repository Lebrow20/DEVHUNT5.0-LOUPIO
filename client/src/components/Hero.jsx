import { Home } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import TeddyBear from '../assets/img/teddy.png'
import Stars from '../assets/img/stars.png'
import MultiStars from '../assets/img/multi-stars.png'


const Hero = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['surprises', 'merveilles', 'nouvelles choses'];

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    const timer = setInterval(() => {
      if (!isDeleting) {
        setDisplayText(currentWord.substring(0, displayText.length + 1));
        if (displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearInterval(timer);
  }, [displayText, isDeleting, currentWordIndex]);

  return (
    <section>

      {/* <div className="text-sm inline-block text-[#9090a0] italic tracking-wide">
        Education ~ Épanouissement ~ Avenir
      </div> */}

      <div className='lg:grid grid-cols-2 gap-7'>
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-200/80 to-pink-200/80 rounded-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 blur-xl"></div>
          <div className="relative">
            <img
              src={TeddyBear}
              alt="Ourson magique"
              className="w-full h-auto transform transition-transform duration-500 filter drop-shadow-2xl"
            />
          </div>
          {/* rond */}

          <div className="absolute bottom-8 left-8 w-4 h-4 bg-pink-400 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className=''>
          <h1 className="text-center tracking-wide bg-gradient-to-r from-[#861fbb] to-[#4f68d3] text-transparent bg-clip-text min-h-48">
            <span className="text-5xl">Bienvenue dans le monde magique, où </span>
            <span className='meow text-xl sm:text-6xl lg:text-6xl'>l'aventure t'attend à chaque clic !</span><br />
            <span className="text-4xl">
              Découvre plein de <span className="inline-block min-w-[200px] text-left">{displayText}</span>
              <span className="animate-pulse">|</span>
              <br />
            </span>
          </h1>

          <div className='flex justify-end items-center mt-5'>
            <button onClick={() => document.getElementById("service-start")?.scrollIntoView({ behavior: "smooth" })} className="group relative bg-[#f32450] text-white px-5 py-3 mr-2 rounded-4xl overflow-hidden transition-all duration-300 ease-in-out w-fit hover:pr-14">
              <span>S'aventurer</span>
              <span className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                &gt;&gt;
              </span>
            </button>
            <div className='w-3/12 animate-floating'>
              <img src={Stars} alt="" className='w-20 h-auto' />
            </div>
          </div>

        </div>
      </div>
      <div id='service-start' className='animate-pulse w-25 mt-4'>
        <img src={MultiStars} alt="" />
      </div>
    </section>
  )
}

export default Hero