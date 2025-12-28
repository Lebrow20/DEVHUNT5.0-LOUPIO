export const stories = {
  animaux: {
    title: "😺 Le monde des animaux",
    contents: [
      {
        text: [
          { word: "Le", audio: true },
          { word: "chat", audio: true, image: "chat.jpg" },
          { word: "dort", audio: true },
          { word: "dans", audio: true },
          { word: "la", audio: true },
          { word: "maison.", audio: true, image: "maison.jpg" }
        ],
        question: {
          text: "Que fait le chat ?",
          options: [
            { answer: "Il dort", correct: true },
            { answer: "Il court", correct: false },
            { answer: "Il chante", correct: false }
          ]
        }
      },
      {
        text: [
          { word: "Le", audio: true },
          { word: "chien", audio: true, image: "chien.jpg" },
          { word: "aboie", audio: true },
          { word: "devant", audio: true },
          { word: "la", audio: true },
          { word: "porte.", audio: true }
        ],
        question: {
          text: "Que fait le chien ?",
          options: [
            { answer: "Il aboie", correct: true },
            { answer: "Il dort", correct: false },
            { answer: "Il mange", correct: false }
          ]
        }
      }
    ]
  },

  foretMagique: {
    title: "🌳 La forêt magique",
    text: [
      { word: "Dans", audio: true },
      { word: "la", audio: true },
      { word: "forêt", audio: true },
      { word: "magique,", audio: true },
      { word: "un", audio: true },
      { word: "hibou", audio: true },
      { word: "parle", audio: true },
      { word: "aux", audio: true },
      { word: "arbres.", audio: true }
    ],
    question: {
      text: "Qui parle aux arbres ?",
      options: [
        { answer: "Le hibou", correct: true },
        { answer: "Le chat", correct: false },
        { answer: "L’arbre", correct: false }
      ]
    }
  },

  couleurs: {
    title: "🌈 Les couleurs",
    contents: [
      {
        text: [
          { word: "Le", audio: true },
          { word: "bleu", audio: true, image: "blue.jpg" },
          { word: "est", audio: true },
          { word: "la", audio: true },
          { word: "couleur", audio: true },
          { word: "du", audio: true },
          { word: "ciel.", audio: true, image: "ciel.jpg" }
        ],
        question: {
          text: "Quelle couleur est le ciel ?",
          options: [
            { answer: "Bleu", correct: true },
            { answer: "Rouge", correct: false },
            { answer: "Jaune", correct: false }
          ]
        }
      },
      {
        text: [
          { word: "La", audio: true },
          { word: "banane", audio: true, image: "banane.jpg" },
          { word: "est", audio: true },
          { word: "jaune.", audio: true, image: "jaune.png" }
        ],
        question: {
          text: "Quelle couleur est la banane ?",
          options: [
            { answer: "Jaune", correct: true },
            { answer: "Rouge", correct: false },
            { answer: "Verte", correct: false }
          ]
        }
      }
    ]
  },

  // 🔊 Narrations uniquement
  feeDesEtoiles: {
    title: "🧚 La fée des étoiles",
    narration: [
      "Dans un ciel très lointain, une petite fée brillait plus fort que toutes les étoiles.",
      "Chaque nuit, elle volait d'une planète à l'autre pour déposer des rêves dans les cœurs des enfants.",
      "Mais un soir, la fée perdit sa lumière et ne pouvait plus voler.",
      "Heureusement, un petit garçon nommé Leo l’aida à retrouver son éclat avec un sourire magique.",
      "Depuis ce jour, la fée brille deux fois plus fort grâce à l’amitié."
    ]
  },

  etoileCurieuse: {
    title: "✨ L’étoile curieuse",
    narration: [
      "Une étoile filante regardait la Terre chaque nuit.",
      "Elle rêvait de savoir ce qu’il y avait dans les forêts, les villes et les océans.",
      "Un soir, elle décida de descendre visiter les enfants endormis.",
      "Elle découvrit les rêves, les rires, et les câlins de maman.",
      "Depuis, elle revient chaque nuit pour illuminer les rêves des petits."
    ]
  },

  lapinTimide: {
    title: "🐰 Le lapin timide",
    narration: [
      "Dans une clairière vivait un petit lapin très timide.",
      "Il n’osait jamais parler ni jouer avec les autres animaux.",
      "Un jour, une tortue lui dit : 'Tu as une jolie voix, viens chanter avec moi !'",
      "Le lapin accepta, et tout le monde l’écouta en silence.",
      "Depuis ce jour, le lapin n’a plus jamais eu peur de parler."
    ]
  },

  nuageVoyageur: {
    title: "☁️ Le nuage voyageur",
    narration: [
      "Il était une fois, tout là-haut dans le ciel, un petit nuage blanc nommé Nino. Nino n’était pas comme les autres nuages. Tandis que ses amis aimaient courir après le vent ou faire tomber la pluie, lui, adorait rêver.",
      "Chaque soir, quand le soleil se couchait et que la lune commençait à briller, Nino montait tout en haut du ciel, là où les étoiles chuchotent des secrets.",
      "Il s’installait doucement entre deux étoiles scintillantes, fermait ses yeux de coton, et se mettait à rêver…",
      "Il rêvait de champs de guimauves, de rivières de lait chaud, de forêts de doudous géants, et de baleines volantes qui chantaient des berceuses.",
      "Un soir, en rêvant très fort, Nino sentit quelque chose d’étrange : il glissait lentement vers la terre… porté par une douce brise.",
      "Quand il ouvrit les yeux, il était juste au-dessus d’une petite maison, où un enfant ne trouvait pas le sommeil.",
      "L’enfant tournait et retournait dans son lit, les yeux grands ouverts.",
      "Alors, Nino descendit tout doucement par la fenêtre entrouverte, se posa près du lit et murmura :",
      "« Ferme les yeux, petit cœur, Je suis le nuage rêveur. Laisse-moi t’emporter, sans bruit, Dans le monde magique de la nuit. »",
      "Et aussitôt, l’enfant sentit ses paupières devenir lourdes… très lourdes.",
      "Il vit des étoiles danser, des licornes voler doucement, et un monde doux comme du coton.",
      "Nino resta là jusqu’à ce que le sommeil emporte l’enfant dans un rêve merveilleux.",
      "Depuis ce jour, chaque fois qu’un enfant a du mal à dormir, Nino le petit nuage rêveur vient tout doucement lui chuchoter une histoire magique… pour qu’il s’endorme le cœur léger.",
      "Bonne nuit… 💤"
    ]
  },

  oursonDormeur: {
    title: "🧸 L’ourson dormeur",
    narration: [
      "Dans une grotte douillette vivait un ourson qui adorait dormir.",
      "Il faisait la sieste après chaque repas, et même entre deux jeux.",
      "Un jour, il rêva qu’il volait dans le ciel sur un coussin en nuage.",
      "Quand il se réveilla, tous ses amis l’attendaient pour une surprise.",
      "Ils avaient construit un lit géant rien que pour lui dans les branches !"
    ]
  }
};
