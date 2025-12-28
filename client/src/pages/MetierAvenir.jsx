import React, { useState, useCallback } from 'react';
import { Star, Rocket, BookOpen, Heart, Brain, Users, Zap, Target, ChevronRight, ChevronLeft } from 'lucide-react';

// Déplacer les données statiques hors du composant
const SKILLS = [
  { id: 'math', name: 'Mathématiques', icon: Brain },
  { id: 'french', name: 'Français', icon: BookOpen },
  { id: 'english', name: 'Anglais', icon: Users },
  { id: 'science', name: 'Sciences', icon: Zap },
  { id: 'art', name: 'Art & Créativité', icon: Heart },
  { id: 'sport', name: 'Sport', icon: Target },
  { id: 'tech', name: 'Technologie', icon: Rocket },
  { id: 'music', name: 'Musique', icon: Star }
];

const CAREER_DATABASE = {
  math: ['Ingénieur', 'Architecte', 'Comptable', 'Scientifique'],
  french: ['Écrivain', 'Journaliste', 'Professeur', 'Traducteur'],
  english: ['Guide touristique', 'Interprète', 'Pilote', 'Diplomate'],
  science: ['Médecin', 'Vétérinaire', 'Chercheur', 'Pharmacien'],
  art: ['Designer', 'Artiste', 'Photographe', 'Décorateur'],
  sport: ['Entraîneur sportif', 'Kinésithérapeute', 'Professeur d\'EPS', 'Athlète'],
  tech: ['Développeur', 'Roboticien', 'Ingénieur informatique', 'Game designer'],
  music: ['Musicien', 'Professeur de musique', 'Ingénieur du son', 'Compositeur']
};

const ROADMAPS = {
  'Médecin': [
    { step: 1, title: 'Bien étudier les sciences', description: 'Apprends la biologie, la chimie et la physique', age: '6-12 ans' },
    { step: 2, title: 'Obtenir de bonnes notes', description: 'Travaille dur au collège et lycée', age: '13-18 ans' },
    { step: 3, title: 'Études de médecine', description: 'Fais des études à l\'université (9 ans)', age: '18-27 ans' },
    { step: 4, title: 'Spécialisation', description: 'Choisis ta spécialité médicale', age: '27-30 ans' },
    { step: 5, title: 'Exercer la médecine', description: 'Aide les gens à guérir !', age: '30+ ans' }
  ],
  'Ingénieur': [
    { step: 1, title: 'Aimer les maths et sciences', description: 'Développe tes compétences logiques', age: '6-12 ans' },
    { step: 2, title: 'Études scientifiques', description: 'Concentre-toi sur les matières scientifiques', age: '13-18 ans' },
    { step: 3, title: 'École d\'ingénieur', description: 'Étudie l\'ingénierie (5 ans)', age: '18-23 ans' },
    { step: 4, title: 'Spécialisation', description: 'Choisis ton domaine d\'expertise', age: '23-25 ans' },
    { step: 5, title: 'Créer et innover', description: 'Construis le futur !', age: '25+ ans' }
  ],
  'Professeur': [
    { step: 1, title: 'Aimer apprendre et enseigner', description: 'Aide tes camarades avec leurs devoirs', age: '6-12 ans' },
    { step: 2, title: 'Bien étudier', description: 'Excelle dans tes matières préférées', age: '13-18 ans' },
    { step: 3, title: 'Études universitaires', description: 'Étudie ta matière favorite', age: '18-21 ans' },
    { step: 4, title: 'Formation d\'enseignant', description: 'Apprends à enseigner', age: '21-23 ans' },
    { step: 5, title: 'Enseigner', description: 'Transmets ton savoir aux enfants !', age: '23+ ans' }
  ],
  'Développeur': [
    { step: 1, title: 'Découvrir l\'informatique', description: 'Apprends les bases de l\'ordinateur', age: '6-12 ans' },
    { step: 2, title: 'Premiers codes', description: 'Essaie des langages simples comme Scratch', age: '13-18 ans' },
    { step: 3, title: 'Études informatiques', description: 'Apprends la programmation avancée', age: '18-21 ans' },
    { step: 4, title: 'Projets personnels', description: 'Crée tes propres applications', age: '21-23 ans' },
    { step: 5, title: 'Créer des logiciels', description: 'Développe les apps du futur !', age: '23+ ans' }
  ],
  'Vétérinaire': [
    { step: 1, title: 'Aimer les animaux', description: 'Prends soin des animaux autour de toi', age: '6-12 ans' },
    { step: 2, title: 'Étudier les sciences', description: 'Concentre-toi sur la biologie', age: '13-18 ans' },
    { step: 3, title: 'École vétérinaire', description: 'Étudie la médecine vétérinaire (7 ans)', age: '18-25 ans' },
    { step: 4, title: 'Stage pratique', description: 'Travaille avec des vétérinaires', age: '25-26 ans' },
    { step: 5, title: 'Soigner les animaux', description: 'Aide nos amis les animaux !', age: '26+ ans' }
  ]
};

const MetierAvenir = () => {
  // États du composant
  const [currentStep, setCurrentStep] = useState('welcome');
  const [userType, setUserType] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [suggestedCareers, setSuggestedCareers] = useState([]);
  const [chosenCareer, setChosenCareer] = useState('');
  const [knownCareer, setKnownCareer] = useState('');
  const [error, setError] = useState(null);

  // Fonctions utilitaires
  const handleError = useCallback((error) => {
    setError(error.message);
    setTimeout(() => setError(null), 5000);
  }, []);

  const resetApp = () => {
    setCurrentStep('welcome');
    setUserType('');
    setSelectedSkills([]);
    setSuggestedCareers([]);
    setChosenCareer('');
    setKnownCareer('');
    setError(null);
  };

  const handleSkillToggle = useCallback((skillId) => {
    setSelectedSkills(prev => 
      prev.includes(skillId) 
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  }, []);

  const generateCareerSuggestions = useCallback(() => {
    try {
      const suggestions = new Set();
      selectedSkills.forEach(skill => {
        if (!CAREER_DATABASE[skill]) {
          throw new Error(`Compétence non trouvée : ${skill}`);
        }
        CAREER_DATABASE[skill].forEach(career => suggestions.add(career));
      });
      setSuggestedCareers(Array.from(suggestions));
      setCurrentStep('suggestions');
    } catch (error) {
      handleError(error);
    }
  }, [selectedSkills, handleError]);

  const selectCareer = (career) => {
    setChosenCareer(career);
    setCurrentStep('roadmap');
  };

  const getRoadmap = (career) => {
    return ROADMAPS[career] || ROADMAPS['Professeur'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-yellow-400 to-blue-500 p-4">
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg z-50">
          {error}
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        
        {/* Welcome Screen */}
        {currentStep === 'welcome' && (
          <div className="text-center space-y-8 pt-16">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <div className="text-6xl mb-6">🌟</div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Découvre ton Métier d'Avenir !
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Une aventure magique pour explorer ton futur professionnel
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => {
                    setUserType('knows');
                    setCurrentStep('knownCareer');
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg"
                >
                  <Rocket className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Je connais déjà mon métier !</h3>
                  <p className="text-blue-100">Montre-moi comment l'atteindre</p>
                </button>
                
                <button
                  onClick={() => {
                    setUserType('discover');
                    setCurrentStep('skills');
                  }}
                  className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-2xl hover:scale-105 transform transition-all duration-300 shadow-lg"
                >
                  <Star className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Je veux découvrir !</h3>
                  <p className="text-green-100">Aide-moi à trouver mon métier</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Known Career Input */}
        {currentStep === 'knownCareer' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Quel métier veux-tu faire plus tard ? 🎯
            </h2>
            
            <div className="max-w-md mx-auto space-y-6">
              <input
                type="text"
                value={knownCareer}
                onChange={(e) => setKnownCareer(e.target.value)}
                placeholder="Écris ton métier de rêve..."
                className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              />
              
              <div className="grid grid-cols-2 gap-3">
                {['Médecin', 'Ingénieur', 'Professeur', 'Développeur', 'Vétérinaire', 'Artiste'].map(career => (
                  <button
                    key={career}
                    onClick={() => setKnownCareer(career)}
                    className="p-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl hover:scale-105 transform transition-all"
                  >
                    {career}
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => {
                  setChosenCareer(knownCareer);
                  setCurrentStep('roadmap');
                }}
                disabled={!knownCareer}
                className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                Voir ma roadmap ! <ChevronRight className="inline w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Skills Selection */}
        {currentStep === 'skills' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Dans quoi es-tu doué(e) ? ✨
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {SKILLS.map(skill => {
                const Icon = skill.icon;
                const isSelected = selectedSkills.includes(skill.id);
                
                return (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillToggle(skill.id)}
                    className={`p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                      isSelected 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-600' 
                        : 'bg-white border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                    <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {skill.name}
                    </p>
                  </button>
                );
              })}
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                {selectedSkills.length > 0 
                  ? `Tu as sélectionné ${selectedSkills.length} compétence${selectedSkills.length > 1 ? 's' : ''} !`
                  : 'Sélectionne tes compétences favorites'
                }
              </p>
              
              <button
                onClick={generateCareerSuggestions}
                disabled={selectedSkills.length === 0}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:scale-105 transform transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                Découvrir mes métiers ! <ChevronRight className="inline w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {/* Career Suggestions */}
        {currentStep === 'suggestions' && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Voici tes métiers parfaits ! 🎉
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {suggestedCareers.map((career, index) => (
                <button
                  key={index}
                  onClick={() => selectCareer(career)}
                  className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-2xl hover:scale-105 transform transition-all shadow-lg"
                >
                  <div className="text-4xl mb-3">
                    {career.includes('Médecin') ? '👨‍⚕️' : 
                     career.includes('Ingénieur') ? '👷‍♂️' :
                     career.includes('Professeur') ? '👨‍🏫' :
                     career.includes('Développeur') ? '👨‍💻' :
                     career.includes('Vétérinaire') ? '👨‍⚕️' :
                     career.includes('Artiste') ? '🎨' : '⭐'}
                  </div>
                  <h3 className="text-xl font-bold">{career}</h3>
                  <p className="text-yellow-100 mt-2">Clique pour voir ton parcours !</p>
                </button>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setCurrentStep('skills')}
                className="px-6 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
              >
                <ChevronLeft className="inline w-5 h-5 mr-2" /> Retour
              </button>
            </div>
          </div>
        )}

        {/* Roadmap Display */}
        {currentStep === 'roadmap' && chosenCareer && (
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
              Ta roadmap pour devenir {chosenCareer} ! 🚀
            </h2>
            
            <div className="space-y-6">
              {getRoadmap(chosenCareer).map((step, index) => (
                <div key={index} className="relative">
                  {index < getRoadmap(chosenCareer).length - 1 && (
                    <div className="absolute left-8 top-16 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-purple-600"></div>
                  )}
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {step.step}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-md">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                        <span className="text-sm bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
                          {step.age}
                        </span>
                      </div>
                      <p className="text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button
                onClick={resetApp}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-xl hover:scale-105 transform transition-all font-semibold"
              >
                Découvrir un autre métier ! ✨
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetierAvenir;