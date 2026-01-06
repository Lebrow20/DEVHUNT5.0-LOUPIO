import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [willRedirect, setWillRedirect] = useState(false);
    const [redirectCountdown, setRedirectCountdown] = useState(0);
    const messagesEndRef = useRef(null);
    const speechSynthesisRef = useRef(null);
    const redirectTimerRef = useRef(null);
    const navigate = useNavigate();

    // Référence aux pages disponibles
    const pagesRef = useRef({
        dessin: {
            path: '/drawing',
            nom: "Studio Art",
            description: "Tu peux colorier de jolis dessins ou créer tes propres œuvres d'art!",
            keywords: ['dessin', 'dessiner', 'colorier', 'crayon', 'couleur', 'peinture', 'studio art']
        },
        chanson: {
            path: '/drawing',
            nom: "Studio Chant",
            description: "Tu peux chanter des chansons françaises comme 'Frère Jacques' et 'Au Clair de la Lune'!",
            keywords: ['chanson', 'chanter', 'musique', 'frère jacques', 'clair de la lune', 'karaoké', 'studio chant', 'chanté']
        },
        quiz: {
            path: '/minilecteur',
            nom: "Jeux éducatifs",
            description: "Réponds à des questions amusantes sur les animaux, la forêt magique et les couleurs!",
            keywords: ['quiz', 'question', 'jeu', 'animaux', 'forêt', 'couleur', 'éducatif']
        },
        histoires: {
            path: '/histoires',
            nom: "Lecture",
            description: "Écoute de belles histoires racontées spécialement pour toi!",
            keywords: ['histoire', 'lire', 'lecture', 'raconter', 'récit', 'conte']
        },
        accueil: {
            path: '/',
            nom: "Accueil",
            description: "La page principale de notre site",
            keywords: ['accueil', 'principal', 'début', 'home', 'menu']
        }
    });

    // Initialize messages with time-based greeting
    useEffect(() => {
        const getTimeBasedGreeting = () => {
            const hour = new Date().getHours();
            if (hour >= 5 && hour < 12) {
                return "Coucou ! Je m'appelle Lulu et je suis ton ami virtuel. Tu veux jouer avec moi ce matin ?";
            } else if (hour >= 12 && hour < 18) {
                return "Salut ! C'est Lulu ! Tu veux qu'on s'amuse ensemble cet après-midi ?";
            } else {
                return "Bonsoir ! C'est ton ami Lulu ! On fait un jeu ensemble avant d'aller dormir ?";
            }
        };

        setMessages([{ role: 'assistant', content: getTimeBasedGreeting() }]);
    }, []);

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Handle redirect countdown
    useEffect(() => {
        if (willRedirect && redirectCountdown > 0) {
            const timer = setTimeout(() => {
                setRedirectCountdown(prev => prev - 1);
            }, 1000);
            redirectTimerRef.current = timer;

            return () => {
                if (timer) {
                    clearTimeout(timer);
                }
            };
        } else if (willRedirect && redirectCountdown === 0) {
            try {
                // Execute the actual redirect
                const destination = willRedirect;
                setWillRedirect(false);
                if (redirectTimerRef.current) {
                    clearTimeout(redirectTimerRef.current);
                    redirectTimerRef.current = null;
                }
                navigate(destination);
            } catch (error) {
                console.error('Navigation error:', error);
                setWillRedirect(false);
                setRedirectCountdown(0);
            }
        }
    }, [willRedirect, redirectCountdown, navigate]);

    // Speak the message using Text-to-Speech with child voice
    const speakMessage = (text) => {
        if (!('speechSynthesis' in window)) {
            console.error('Text-to-speech not supported in this browser');
            return;
        }

        try {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'fr-FR';

            // Configuration pour une voix plus enfantine
            utterance.pitch = 1.5;    // Voix plus aiguë
            utterance.rate = 1.1;     // Légèrement plus rapide

            // Get available voices and try to find a French one
            const voices = window.speechSynthesis.getVoices();
            const frenchVoice = voices.find(voice =>
                voice.lang.includes('fr') &&
                (voice.name.includes('enfant') || voice.name.includes('fille') || voice.name.includes('jeune'))
            ) || voices.find(voice => voice.lang.includes('fr'));

            if (frenchVoice) {
                utterance.voice = frenchVoice;
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                speechSynthesisRef.current = null;
            };

            utterance.onerror = (event) => {
                console.error('Speech synthesis error:', event);
                setIsSpeaking(false);
                speechSynthesisRef.current = null;
            };

            speechSynthesisRef.current = utterance;
            window.speechSynthesis.speak(utterance);
        } catch (error) {
            console.error('Error in speakMessage:', error);
            setIsSpeaking(false);
            speechSynthesisRef.current = null;
        }
    };

    // Stop speaking
    const stopSpeaking = () => {
        try {
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
            setIsSpeaking(false);
            speechSynthesisRef.current = null;
        } catch (error) {
            console.error('Error stopping speech:', error);
            setIsSpeaking(false);
            speechSynthesisRef.current = null;
        }
    };

    // Déterminer si l'utilisateur veut aller vers une page spécifique
    const detectPageRequest = (userInput) => {
        const input = userInput.toLowerCase();

        // Détection explicite de demande de navigation
        const navigationIndicators = [
            'aller', 'ouvrir', 'montre', 'voir', 'visiter', 'emmène-moi', 'je veux', 'amène-moi',
            'je voudrais', 'peux-tu me montrer', 'j\'aimerais voir', 'va à', 'ouvre'
        ];

        const hasNavigationIntent = navigationIndicators.some(indicator => input.includes(indicator));

        // Parcourir toutes les pages disponibles
        for (const [_key, page] of Object.entries(pagesRef.current)) {
            // Vérifier si l'utilisateur mentionne les mots-clés associés à cette page
            const mentionsPage = page.keywords.some(keyword => input.includes(keyword));

            // Si l'utilisateur a une intention de navigation et mentionne la page
            if ((hasNavigationIntent && mentionsPage) ||
                // Ou s'il demande spécifiquement cette page
                input.includes(`aller ${page.nom.toLowerCase()}`) ||
                input.includes(`voir ${page.nom.toLowerCase()}`)) {
                return page.path;
            }
        }

        return null;
    };

    // Rediriger vers une page
    const redirectToPage = (pagePath) => {
        try {
            // Annuler les redirections précédentes
            if (redirectTimerRef.current) {
                clearTimeout(redirectTimerRef.current);
                redirectTimerRef.current = null;
            }

            setWillRedirect(pagePath);
            setRedirectCountdown(3); // Compte à rebours de 3 secondes

            // Message pour informer de la redirection
            const page = Object.values(pagesRef.current).find(p => p.path === pagePath);
            if (page) {
                const redirectMessage = `Super ! Je t'emmène au ${page.nom} dans 3 secondes...`;

                setMessages(prevMessages => [...prevMessages, {
                    role: 'assistant',
                    content: redirectMessage
                }]);

                speakMessage(redirectMessage);
            }
        } catch (error) {
            console.error('Error in redirectToPage:', error);
            setWillRedirect(false);
            setRedirectCountdown(0);
        }
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            if (!inputValue.trim()) return;

            // Store the input value before clearing it
            const userInputText = inputValue;

            // Stop any ongoing speech when user sends a message
            stopSpeaking();

            // Annuler toute redirection en cours
            if (willRedirect) {
                if (redirectTimerRef.current) {
                    clearTimeout(redirectTimerRef.current);
                    redirectTimerRef.current = null;
                }
                setWillRedirect(false);
                setRedirectCountdown(0);
            }

            // Add user message
            const userMessage = { role: 'user', content: userInputText };
            setMessages(prevMessages => [...prevMessages, userMessage]);
            setInputValue('');
            setIsLoading(true);

            try {
                // Simulated API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Format current time
                const timeString = currentTime.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                // Vérifier si l'utilisateur veut accéder à une page spécifique
                const requestedPage = detectPageRequest(userInputText);

                if (requestedPage) {
                    // Si une page est demandée, rediriger
                    redirectToPage(requestedPage);
                    return;
                }

                // Sample responses based on user input keywords
                let responseText = "Je ne suis pas sûr de comprendre. Tu veux qu'on joue ensemble ?";
                const userInput = userInputText.toLowerCase();

                // Réponses à propos du dessin
                if (userInput.includes('dessin') || userInput.includes('dessiner') || userInput.includes('colorier') || userInput.includes('crayon') || userInput.includes('couleur') || userInput.includes('studio art')) {
                    responseText = `J'adore dessiner ! ${pagesRef.current.dessin.description} ${currentTime.getHours() < 18
                        ? "C'est super pour s'amuser maintenant !"
                        : "On pourrait essayer avant d'aller dormir !"
                        } Tu veux que je t'emmène au Studio Art ? Dis-moi "Je veux aller au Studio Art" !`;
                }
                // Réponses à propos des chansons
                else if (userInput.includes('chanson') || userInput.includes('chanter') || userInput.includes('musique') || userInput.includes('frère jacques') || userInput.includes('clair de la lune')) {
                    responseText = `La chanson, c'est trop rigolo ! ${pagesRef.current.chanson.description} Tu peux suivre les paroles qui s'illuminent et je t'écouterai chanter. Ma chanson préférée c'est "Frère Jacques" ! Tu veux que je t'emmène au Studio Chant ? Dis-moi "Je veux chanter" !`;
                }
                // Réponses à propos des quiz
                else if (userInput.includes('quiz') || userInput.includes('question') || userInput.includes('jeu') || userInput.includes('animaux') || userInput.includes('forêt') || userInput.includes('couleur') || userInput.includes('éducatif')) {
                    responseText = `Les quiz sont super amusants ! ${pagesRef.current.quiz.description} Tu peux choisir entre les animaux, la forêt magique ou les couleurs. Chaque bonne réponse te donne des points. Tu veux y aller ? Dis-moi "Emmène-moi aux jeux" !`;
                }
                // Réponses à propos des histoires
                else if (userInput.includes('histoire') || userInput.includes('lire') || userInput.includes('lecture') || userInput.includes('raconter')) {
                    responseText = `J'adore les histoires ! ${pagesRef.current.histoires.description} Tu peux m'écouter te raconter des histoires magiques. Tu peux arrêter l'histoire et la reprendre quand tu veux. Tu veux que je t'emmène aux histoires ? Dis-moi "Je veux écouter une histoire" !`;
                }
                // Salutations
                else if (userInput.includes('bonjour') || userInput.includes('salut') || userInput.includes('coucou') || userInput.includes('hello')) {
                    const hour = currentTime.getHours();
                    if (hour >= 5 && hour < 12) {
                        responseText = `Coucou ! Il est ${timeString}, c'est une super matinée pour jouer ensemble ! Tu veux dessiner, chanter, faire un quiz ou écouter une histoire ?`;
                    } else if (hour >= 12 && hour < 18) {
                        responseText = `Salut copain ! Il est ${timeString}, c'est l'après-midi parfait pour s'amuser ! On dessine, on chante, on fait un quiz ou je te raconte une histoire ?`;
                    } else {
                        responseText = `Bonsoir ! Il est ${timeString}, on peut encore jouer un peu avant d'aller dormir ! Tu préfères dessiner, chanter, répondre à un quiz ou écouter une histoire ?`;
                    }
                }
                // Temps
                else if (userInput.includes('heure') || userInput.includes('temps')) {
                    responseText = `Il est ${timeString} ! ${currentTime.getHours() < 12
                        ? "C'est le matin, on a toute la journée pour s'amuser !"
                        : currentTime.getHours() < 18
                            ? "C'est l'après-midi, encore plein de temps pour jouer !"
                            : "C'est le soir, on peut encore jouer un peu avant de dormir !"
                        }`;
                }
                // Remerciements
                else if (userInput.includes('merci') || userInput.includes('cool') || userInput.includes('super')) {
                    responseText = `De rien ! C'est super de jouer avec toi ! Tu veux essayer une autre activité ? Je peux t'aider à dessiner, chanter, faire un quiz ou écouter une histoire !`;
                }
                // Aide
                else if (userInput.includes('aide') || userInput.includes('comment') || userInput.includes('quoi faire')) {
                    responseText = `Je peux t'aider ! Voici ce que tu peux faire sur notre site : 
        1. Dessiner et colorier dans le Studio Art
        2. Chanter des chansons comme "Frère Jacques"
        3. Faire des quiz sur les animaux, la forêt ou les couleurs
        4. Écouter des histoires passionnantes
        Qu'est-ce qui te ferait plaisir ? Tu peux me dire "Emmène-moi au dessin" ou "Je veux chanter" !`;
                }
                // Si l'enfant pose une question à propos de l'IA
                else if (userInput.includes('qui es-tu') || userInput.includes('ton nom') || userInput.includes('t\'appelles')) {
                    responseText = `Je m'appelle Lulu et j'ai 7 ans, comme toi peut-être ? Je suis ton ami virtuel et j'adore jouer, dessiner, chanter et raconter des histoires ! Et toi, comment tu t'appelles ?`;
                }

                // Add assistant response
                const assistantMessage = { role: 'assistant', content: responseText };
                setMessages(prevMessages => [...prevMessages, assistantMessage]);

                // Speak the response
                speakMessage(responseText);
            } catch (error) {
                console.error('Error:', error);
                setMessages(prevMessages => [...prevMessages, {
                    role: 'assistant',
                    content: "Oh non ! Il y a eu un problème. On peut réessayer ?"
                }]);
            } finally {
                setIsLoading(false);
            }
        } catch (outerError) {
            console.error('Outer error in handleSubmit:', outerError);
            setIsLoading(false);
            setMessages(prevMessages => [...prevMessages, {
                role: 'assistant',
                content: "Oh non ! Il y a eu un problème. On peut réessayer ?"
            }]);
        }
    };

    // Clean up speech synthesis when component unmounts
    useEffect(() => {
        return () => {
            try {
                // Cancel speech synthesis
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                }

                // Clear timers
                if (redirectTimerRef.current) {
                    clearTimeout(redirectTimerRef.current);
                }

                // Reset refs
                speechSynthesisRef.current = null;
                redirectTimerRef.current = null;
            } catch (error) {
                console.error('Error during cleanup:', error);
            }
        };
    }, []);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat toggle button */}
            <button
                onClick={() => {
                    try {
                        setIsOpen(!isOpen);
                        if (!isOpen) {
                            // When opening the chat, speak the welcome message if it's the first message
                            if (messages.length === 1 && messages[0].role === 'assistant') {
                                speakMessage(messages[0].content);
                            }
                        } else {
                            // When closing, stop any speech
                            stopSpeaking();
                            // Cancel any pending redirects
                            if (willRedirect) {
                                if (redirectTimerRef.current) {
                                    clearTimeout(redirectTimerRef.current);
                                    redirectTimerRef.current = null;
                                }
                                setWillRedirect(false);
                                setRedirectCountdown(0);
                            }
                        }
                    } catch (error) {
                        console.error('Error toggling chat:', error);
                    }
                }}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center animate-bounce"
            >
                {isOpen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl border-4 border-purple-300 flex flex-col">
                    {/* Chat header */}
                    <div className="bg-gradient-to-r from-purple-400 to-pink-400 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
                        <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center mr-2">
                                <img
                                    src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                                    alt="Lulu avatar"
                                    className="h-8 w-8 rounded-full"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Lulu</h3>
                                <p className="text-xs text-white/80">
                                    Ton ami virtuel • {currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {/* Voice control button */}
                            {isSpeaking ? (
                                <button
                                    onClick={stopSpeaking}
                                    className="text-white hover:text-gray-200 mr-2"
                                    title="Arrêter la voix"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            ) : null}
                            <button
                                onClick={() => {
                                    try {
                                        setIsOpen(false);
                                        stopSpeaking();
                                        if (willRedirect) {
                                            if (redirectTimerRef.current) {
                                                clearTimeout(redirectTimerRef.current);
                                                redirectTimerRef.current = null;
                                            }
                                            setWillRedirect(false);
                                            setRedirectCountdown(0);
                                        }
                                    } catch (error) {
                                        console.error('Error closing chat:', error);
                                        setIsOpen(false); // Force close even on error
                                    }
                                }}
                                className="text-white hover:text-gray-200"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Chat messages with child-friendly styling */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96 bg-gradient-to-b from-pink-50 to-purple-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {message.role === 'assistant' && (
                                    <div className="h-8 w-8 rounded-full bg-purple-200 flex-shrink-0 mr-2">
                                        <img
                                            src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                                            alt="Lulu avatar"
                                            className="h-8 w-8 rounded-full"
                                        />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg ${message.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-br-none'
                                        : 'bg-purple-200 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    <p className={message.role === 'assistant' ? "text-md" : ""}>{message.content}</p>
                                    {message.role === 'assistant' && (
                                        <button
                                            onClick={() => speakMessage(message.content)}
                                            className="ml-2 text-xs text-purple-500 hover:text-purple-700"
                                            title="Écouter"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071a1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243a1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828a1 1 0 010-1.415z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="h-8 w-8 rounded-full bg-purple-200 flex-shrink-0 mr-2">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
                                        alt="Lulu avatar"
                                        className="h-8 w-8 rounded-full"
                                    />
                                </div>
                                <div className="bg-purple-200 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Redirection countdown */}
                        {willRedirect && redirectCountdown > 0 && (
                            <div className="w-full flex justify-center my-2">
                                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded-full font-bold animate-pulse">
                                    Redirection dans {redirectCountdown}...
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat input avec style enfantin */}
                    <form onSubmit={handleSubmit} className="border-t-2 border-purple-300 p-3 bg-purple-100">
                        <div className="flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Dis quelque chose à Lulu..."
                                className="flex-1 border-2 border-purple-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-700"
                                disabled={isLoading || willRedirect}
                            />
                            <button
                                type="submit"
                                className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-r-md ${(isLoading || willRedirect) ? 'opacity-50 cursor-not-allowed' : 'hover:from-purple-600 hover:to-pink-600'
                                    }`}
                                disabled={isLoading || willRedirect}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                </svg>
                            </button>
                        </div>
                        <div className="flex justify-between text-xs text-purple-500 mt-1">
                            <p>Ton ami Lulu est là pour t'aider !</p>
                            <p>
                                {isSpeaking && '🔊 Je parle...'}
                                {willRedirect && '🚀 Je t\'emmène...'}
                            </p>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
