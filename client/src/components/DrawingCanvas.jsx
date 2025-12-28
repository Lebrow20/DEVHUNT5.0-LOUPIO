import { ArrowLeft } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  FaEraser,
  FaPencilAlt,
  FaSave,
  FaTrash,
  FaUndo,
  FaRedo,
} from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './DrawingCanvas.css'

const DrawingCanvas = () => {
  // State for active menu section
  const [activeMenu, setActiveMenu] = useState('drawing') // 'drawing' or 'song'

  // All existing state variables
  const canvasRef = useRef(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)
  const [tool, setTool] = useState('pencil')
  const [preinstalledImages, setPreinstalledImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [history, setHistory] = useState([])
  const [currentStep, setCurrentStep] = useState(-1)
  // Audio recording states
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [mediaRecorder, setMediaRecorder] = useState(null)

  // New song studio states
  const [savedRecordings, setSavedRecordings] = useState([])
  const [selectedKaraoke, setSelectedKaraoke] = useState(null)
  const [isKaraokePlaying, setIsKaraokePlaying] = useState(false)
  const [karaokeAudio, setKaraokeAudio] = useState(null)

  // Karaoke lyrics tracking states
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0)
  const lyricTimerRef = useRef(null)

  // Voice interaction states
  const [voiceInteraction, setVoiceInteraction] = useState(false)
  const [lastDetectedLyric, setLastDetectedLyric] = useState(null)
  const speechRecognitionRef = useRef(null)

  // Karaoke songs list
  const karaokeSongs = [
    {
      id: 1,
      title: 'Frère Jacques',
      audioSrc: '/songs/frere-jacques.mp3',
      lyrics: [
        { text: 'Frère Jacques, Frère Jacques', startTime: 0, endTime: 3.5 },
        { text: 'Dormez-vous? Dormez-vous?', startTime: 3.5, endTime: 7 },
        {
          text: 'Sonnez les matines, Sonnez les matines',
          startTime: 7,
          endTime: 10.5,
        },
        {
          text: 'Ding, dang, dong. Ding, dang, dong.',
          startTime: 10.5,
          endTime: 14,
        },
      ],
    },
    {
      id: 2,
      title: 'Au Clair de la Lune',
      audioSrc: '/songs/au-clair-de-la-lune.mp3',
      lyrics: [
        { text: 'Au clair de la lune', startTime: 0, endTime: 2.5 },
        { text: 'Mon ami Pierrot', startTime: 2.5, endTime: 5 },
        { text: 'Prête-moi ta plume', startTime: 5, endTime: 7.5 },
        { text: 'Pour écrire un mot', startTime: 7.5, endTime: 10 },
        { text: 'Ma chandelle est morte', startTime: 10, endTime: 12.5 },
        { text: "Je n'ai plus de feu", startTime: 12.5, endTime: 15 },
        { text: 'Ouvre-moi ta porte', startTime: 15, endTime: 17.5 },
        { text: "Pour l'amour de Dieu", startTime: 17.5, endTime: 20 },
      ],
    },
  ]

  // Colors definition
  const colors = [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Red', hex: '#FF0000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Yellow', hex: '#FFFF00' },
    { name: 'Green', hex: '#00FF00' },
    { name: 'Purple', hex: '#800080' },
    { name: 'Orange', hex: '#FFA500' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Light Blue', hex: '#ADD8E6' },
  ]  // Initialize canvas - separate effect for canvas initialization
  useEffect(() => {
    if (activeMenu === 'drawing') {
      const canvas = canvasRef.current
      if (canvas && history.length === 0) {
        const context = canvas.getContext('2d')
        context.lineCap = 'round'
        context.lineJoin = 'round'

        // Clear canvas with white background only once
        context.fillStyle = 'white'
        context.fillRect(0, 0, canvas.width, canvas.height)

        // Save initial canvas state to history
        setHistory([canvas.toDataURL()])
        setCurrentStep(0)
      }
    }
  }, [activeMenu, history.length])

  // Set preinstalled images
  useEffect(() => {
    if (activeMenu === 'drawing') {
      setPreinstalledImages([
        {
          name: 'Image 1',
          path: '/images/sary1.jpg',
          thumbnail: '/images/sary1.jpg',
        },
        {
          name: 'Image 2',
          path: '/images/sary2.jpg',
          thumbnail: '/images/sary2.jpg',
        },
      ])
    }
  }, [activeMenu])

  // All existing drawing functions
  const saveToHistory = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (currentStep < history.length - 1) {
      setHistory(history.slice(0, currentStep + 1))
    }

    setHistory([...history.slice(0, currentStep + 1), canvas.toDataURL()])
    setCurrentStep(currentStep + 1)
  }

  const startDrawing = (e) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.beginPath()
    context.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    context.lineWidth = brushSize
    context.strokeStyle = tool === 'eraser' ? 'white' : color

    context.lineTo(x, y)
    context.stroke()
  }

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      context.closePath()
      setIsDrawing(false)

      saveToHistory()
    }
  }

  const loadImage = (imagePath) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const image = new Image()
    image.src = imagePath
    image.onload = () => {
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      setSelectedImage(imagePath)
      saveToHistory()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.fillStyle = 'white'
    context.fillRect(0, 0, canvas.width, canvas.height)
    setSelectedImage(null)
    saveToHistory()
  }

  const undo = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      loadFromHistory(currentStep - 1)
    }
  }

  const redo = () => {
    if (currentStep < history.length - 1) {
      setCurrentStep(currentStep + 1)
      loadFromHistory(currentStep + 1)
    }
  }

  const loadFromHistory = (step) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const img = new Image()
    img.src = history[step]
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
  }

  const saveDrawing = () => {
    const canvas = canvasRef.current
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'drawing.png'
    link.href = url
    link.click()
  }
  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioURL(url)
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert(
        'Nous ne pouvons pas accéder au microphone. Vérifiez vos permissions.',
      )
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      setIsRecording(false)

      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }

  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL)
      audio.play()
    }
  }

  const saveAudio = () => {
    if (audioURL) {
      // Save to local storage
      const recordingName = `Recording ${savedRecordings.length + 1}`
      const newRecording = {
        id: Date.now(),
        name: recordingName,
        url: audioURL,
        date: new Date().toLocaleString(),
      }

      setSavedRecordings([...savedRecordings, newRecording])

      // Also allow downloading
      const a = document.createElement('a')
      a.href = audioURL
      a.download = 'my-song.webm'
      a.click()
    }
  }

  // New karaoke functions
  const playKaraoke = (song) => {
    setSelectedKaraoke(song)
    setCurrentLyricIndex(0)

    if (karaokeAudio) {
      karaokeAudio.pause()
      clearInterval(lyricTimerRef.current)
    }

    const audio = new Audio(song.audioSrc)
    setKaraokeAudio(audio)
    audio.play()
    setIsKaraokePlaying(true)

    // Set up interval to check time and update current lyric
    lyricTimerRef.current = setInterval(() => {
      const currentTime = audio.currentTime
      const newIndex = song.lyrics.findIndex(
        (lyric) =>
          currentTime >= lyric.startTime && currentTime < lyric.endTime,
      )

      if (newIndex !== -1 && newIndex !== currentLyricIndex) {
        setCurrentLyricIndex(newIndex)
      }
    }, 100)

    audio.onended = () => {
      setIsKaraokePlaying(false)
      clearInterval(lyricTimerRef.current)
    }
  }

  const pauseKaraoke = () => {
    if (karaokeAudio) {
      karaokeAudio.pause()
      setIsKaraokePlaying(false)
      clearInterval(lyricTimerRef.current)
    }
  }

  const resumeKaraoke = () => {
    if (karaokeAudio) {
      karaokeAudio.play()
      setIsKaraokePlaying(true)

      // Restart the lyric timer
      lyricTimerRef.current = setInterval(() => {
        const currentTime = karaokeAudio.currentTime
        const newIndex = selectedKaraoke.lyrics.findIndex(
          (lyric) =>
            currentTime >= lyric.startTime && currentTime < lyric.endTime,
        )

        if (newIndex !== -1 && newIndex !== currentLyricIndex) {
          setCurrentLyricIndex(newIndex)
        }
      }, 100)
    }
  }

  const stopKaraoke = () => {
    if (karaokeAudio) {
      karaokeAudio.pause()
      karaokeAudio.currentTime = 0
      setIsKaraokePlaying(false)
      clearInterval(lyricTimerRef.current)
      setCurrentLyricIndex(0)
    }
  }

  const startVoiceInteraction = () => {
    if (!selectedKaraoke) {
      alert("Veuillez d'abord sélectionner une chanson")
      return
    }

    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'fr-FR'

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('')

        // Check if any of the lyrics are in the transcript
        selectedKaraoke.lyrics.forEach((line, index) => {
          if (transcript.toLowerCase().includes(line.text.toLowerCase())) {
            setLastDetectedLyric(index)
            setCurrentLyricIndex(index)
          }
        })
      }

      recognition.start()
      setVoiceInteraction(true)
      speechRecognitionRef.current = recognition
    } else {
      alert(
        "La reconnaissance vocale n'est pas prise en charge par votre navigateur",
      )
    }
  }

  const stopVoiceInteraction = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop()
      setVoiceInteraction(false)
      speechRecognitionRef.current = null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large floating bubbles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-2/3 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-56 h-56 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-35 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>

        {/* Floating creative elements */}
        <div className="absolute top-16 left-16 text-yellow-400 text-3xl animate-bounce delay-300 opacity-80">🎨</div>
        <div className="absolute top-24 right-24 text-purple-400 text-2xl animate-bounce delay-700 opacity-70">✨</div>
        <div className="absolute bottom-32 left-24 text-pink-400 text-2xl animate-bounce delay-1000 opacity-75">🖌️</div>
        <div className="absolute bottom-16 right-16 text-blue-400 text-3xl animate-bounce delay-1300 opacity-80">🎵</div>
        <div className="absolute top-1/3 left-1/2 text-orange-400 text-xl animate-bounce delay-2000 opacity-60">🎪</div>

        {/* Additional geometric shapes */}
        <div className="absolute top-20 right-1/3 w-4 h-4 bg-white rounded-full opacity-60 animate-ping delay-500"></div>
        <div className="absolute bottom-24 left-1/4 w-3 h-3 bg-yellow-300 rounded-full opacity-50 animate-ping delay-1200"></div>
        <div className="absolute top-1/2 left-20 w-5 h-5 bg-pink-300 rounded-full opacity-40 animate-ping delay-800"></div>

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/5"></div>
      </div>

      {/* Navigation Menu */}
      <div className="relative z-10 w-full mb-8 bg-white/70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30">
        <div className="fixed z-50 ml-9 mt-4">
          <Link
            to="/sixanseducation"
            className="group flex items-center space-x-1 text-gray-800 hover:bg-gray-200 transition-all duration-300 p-2  rounded-2xl font-semibold text-lg"
          >
            <ArrowLeft className="w-6 h-6 transition-transform group-hover:-translate-x-1" />
            <span>Retour</span>
          </Link>
        </div>        <div className="flex justify-center">
          <button
            className={`px-8 py-4 text-xl font-bold transition-all duration-300 ${activeMenu === 'drawing'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
              : 'bg-white/50 text-purple-700 hover:bg-white/70 hover:scale-105'
              } rounded-2xl m-2 border-2 border-purple-200`}
            onClick={() => setActiveMenu('drawing')}
          >
            🎨 Studio de dessin
          </button>
          <button
            className={`px-8 py-4 text-xl font-bold transition-all duration-300 ${activeMenu === 'song'
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
              : 'bg-white/50 text-blue-700 hover:bg-white/70 hover:scale-105'
              } rounded-2xl m-2 border-2 border-blue-200`}
            onClick={() => setActiveMenu('song')}
          >            🎵 Studio de chant
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-5xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 drop-shadow-lg animate-pulse">
          {activeMenu === 'drawing' ? '🎨 Studio de Dessin Créatif' : '🎵 Studio de Chant Magique'}
        </h1>      {/* Drawing Studio */}
        {activeMenu === 'drawing' && (
          <div className="flex flex-wrap gap-8 justify-center">
            {/* Tools Panel */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">🎨 Outils Créatifs</h2>            <div className="flex flex-col gap-6">
                <div>
                  <p className="mb-4 font-semibold text-gray-700">🌈 Palette de Couleurs</p>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((colorOption) => (
                      <div
                        key={colorOption.hex}
                        onClick={() => setColor(colorOption.hex)}
                        className={`w-14 h-14 rounded-xl cursor-pointer flex items-center justify-center border-3 transition-all duration-200 hover:scale-110 hover:shadow-lg ${color === colorOption.hex
                          ? 'border-gray-800 scale-110 shadow-lg'
                          : 'border-gray-300 hover:border-gray-500'
                          }`}
                        style={{ backgroundColor: colorOption.hex }}
                        title={colorOption.name}
                      >
                        {color === colorOption.hex && (
                          <span
                            className={`text-sm font-bold ${[
                              '#FFFFFF',
                              '#FFFF00',
                              '#00FF00',
                              '#ADD8E6',
                            ].includes(colorOption.hex)
                              ? 'text-black'
                              : 'text-white'
                              }`}
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-4 font-semibold text-gray-700">🖌️ Épaisseur: {brushSize}px</p>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={brushSize}
                    onChange={(e) => setBrushSize(parseInt(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>              <div>
                  <p className="mb-4 font-semibold text-gray-700">🛠️ Outils</p>
                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={() => setTool('pencil')}
                      className={`p-4 rounded-xl flex items-center justify-center transition-all duration-300 ${tool === 'pencil'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                        }`}
                      title="Crayon"
                    >
                      <FaPencilAlt className="text-xl" />
                    </button>
                    <button
                      onClick={() => setTool('eraser')}
                      className={`p-4 rounded-xl flex items-center justify-center transition-all duration-300 ${tool === 'eraser'
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
                        }`}
                      title="Gomme"
                    >
                      <FaEraser className="text-xl" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="font-semibold text-gray-700 mb-2">⚡ Actions Rapides</p>
                  {/* First row of buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={undo}
                      disabled={currentStep <= 0}
                      className={`px-4 py-3 rounded-xl flex items-center justify-center gap-2 flex-1 transition-all duration-300 ${currentStep <= 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:from-yellow-500 hover:to-orange-500 hover:scale-105 shadow-lg'
                        }`}
                      title="Annuler"
                    >
                      <FaUndo className="text-sm" />
                      <span className="font-semibold">Annuler</span>
                    </button>
                    <button
                      onClick={redo}
                      disabled={currentStep >= history.length - 1}
                      className={`px-4 py-3 rounded-xl flex items-center justify-center gap-2 flex-1 transition-all duration-300 ${currentStep >= history.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-green-400 to-blue-400 text-white hover:from-green-500 hover:to-blue-500 hover:scale-105 shadow-lg'
                        }`}
                      title="Rétablir"
                    >
                      <FaRedo className="text-sm" />
                      <span className="font-semibold">Refaire</span>
                    </button>
                  </div>

                  {/* Second row of buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={clearCanvas}
                      className="px-4 py-3 rounded-xl flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg"
                      title="Effacer"
                    >
                      <FaTrash className="text-sm" />
                      <span className="font-semibold">Effacer</span>
                    </button>
                    <button
                      onClick={saveDrawing}
                      className="px-4 py-3 rounded-xl flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg"
                      title="Enregistrer"
                    >
                      <FaSave className="text-sm" />
                      <span className="font-semibold">Sauver</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>          {/* Canvas */}
            <div className="bg-white/95 backdrop-blur-lg p-4 rounded-2xl shadow-2xl border border-white/50 hover:shadow-3xl transition-all duration-300">
              <div className="mb-4 text-center">
                <h3 className="text-xl font-bold text-gray-800">🖼️ Espace de Création</h3>
              </div>              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className={`border-4 border-gray-300 rounded-xl shadow-inner hover:border-purple-400 transition-colors duration-300 ${tool === 'pencil' ? 'cursor-pencil' : 'cursor-eraser'
                  }`}
              />
            </div>

            {/* Preinstalled Images */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50 w-80 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">🖼️ Images Magiques</h2>
              <div className="grid grid-cols-2 gap-4">
                {preinstalledImages.map((image, index) => (
                  <div
                    key={index}
                    className={`cursor-pointer border-3 p-2 rounded-xl transition-all duration-300 hover:scale-105 ${selectedImage === image.path
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-300 hover:border-purple-300 hover:shadow-md'
                      }`}
                    onClick={() => loadImage(image.path)}
                  >
                    <img
                      src={image.thumbnail || image.path}
                      alt={image.name}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                    <p className="text-sm text-center mt-2 font-semibold text-gray-700">{image.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}      {/* Song Studio */}
        {activeMenu === 'song' && (
          <div className="flex flex-wrap gap-8 justify-center">
            {/* Karaoke Songs Panel */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50 w-96 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">🎵 Chansons Françaises</h2>
              <div className="flex flex-col gap-4">
                {karaokeSongs.map((song) => (
                  <div
                    key={song.id}
                    className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 ${selectedKaraoke && selectedKaraoke.id === song.id
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    onClick={() => playKaraoke(song)}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-800">{song.title}</h3>
                      {selectedKaraoke && selectedKaraoke.id === song.id && (
                        <span className="text-blue-500 text-sm font-semibold bg-blue-100 px-3 py-1 rounded-full">▶️ En cours</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>          {/* Lyrics and Controls Panel */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50 w-96 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📝 Paroles Magiques</h2>
              {selectedKaraoke ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-purple-600 text-center mb-4">
                      {selectedKaraoke.title}
                    </h3>
                    <div className="mt-4 p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-3 border-yellow-200 shadow-inner">
                      {selectedKaraoke.lyrics.map((line, index) => (
                        <p
                          key={index}
                          className={`py-3 transition-all duration-300 text-center ${currentLyricIndex === index
                            ? 'text-blue-600 font-bold scale-110 transform bg-yellow-100 px-4 py-3 rounded-xl shadow-lg border-2 border-blue-300'
                            : 'text-gray-700 hover:text-gray-900'
                            }`}
                          style={{
                            transformOrigin: 'center',
                          }}
                        >
                          {line.text}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-6">
                    {isKaraokePlaying ? (
                      <button
                        onClick={pauseKaraoke}
                        className="px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={resumeKaraoke}
                        className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Jouer
                      </button>
                    )}
                    <button
                      onClick={stopKaraoke}
                      className="px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Arrêter
                    </button>
                    {voiceInteraction ? (
                      <button
                        onClick={stopVoiceInteraction}
                        className="px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Arrêter vocal
                      </button>
                    ) : (
                      <button
                        onClick={startVoiceInteraction}
                        className="px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Interaction vocale
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎵</div>
                  <p className="text-gray-500 text-lg">
                    Sélectionnez une chanson pour voir les paroles magiques !
                  </p>
                </div>
              )}
            </div>          {/* Recording Panel */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50 w-96 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">🎤 Studio d'Enregistrement</h2>

              <div className="flex flex-col gap-6">
                {isRecording ? (
                  <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl border-2 border-red-200">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="font-semibold text-red-700 text-lg">Enregistrement en cours...</span>
                  </div>
                ) : audioURL ? (
                  <div className="text-center p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-200">
                    <div className="text-4xl mb-2">🎵</div>
                    <div className="text-green-700 font-bold text-lg">
                      Chanson enregistrée avec succès !
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl border-2 border-blue-200">
                    <div className="text-4xl mb-2">🎙️</div>
                    <div className="text-blue-700 font-semibold">
                      Prêt à enregistrer votre voix magique !
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex-1 px-4 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-red-600 hover:to-pink-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      disabled={isRecording}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <circle cx="10" cy="10" r="8" />
                      </svg>
                      Commencer
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex-1 px-4 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-gray-600 hover:to-gray-700 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <rect x="6" y="6" width="8" height="8" />
                      </svg>
                      Arrêter
                    </button>
                  )}
                </div>

                {audioURL && (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button
                        onClick={playRecording}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Écouter
                      </button>
                      <button
                        onClick={saveAudio}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl flex items-center justify-center gap-2 hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Sauvegarder
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <p className="text-center text-gray-700 font-medium">
                    🎵 Chante avec le karaoke ou enregistre ta propre voix magique ! ✨
                  </p>
                </div>

                {/* Voice Interaction Section */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <h3 className="font-bold mb-4 text-center text-gray-800 text-lg">🗣️ Interaction Vocale Magique</h3>
                  <p className="text-sm text-gray-600 mb-4 text-center">
                    Chantez la chanson et voyez les paroles s'animer comme par magie ! ✨
                  </p>

                  {!voiceInteraction ? (
                    <button
                      onClick={startVoiceInteraction}
                      className="w-full px-4 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl flex items-center justify-center gap-2 hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Démarrer la magie vocale
                    </button>
                  ) : (
                    <button
                      onClick={stopVoiceInteraction}
                      className="w-full px-4 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl flex items-center justify-center gap-2 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 hover:scale-105 shadow-lg font-semibold"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Arrêter la magie
                    </button>
                  )}

                  {lastDetectedLyric !== null && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 rounded-xl border-2 border-green-200 text-center">
                      <div className="text-2xl mb-2">🌟</div>
                      <div className="font-bold">
                        Bravo ! Vous avez bien chanté :
                      </div>
                      <div className="italic mt-2 text-lg">
                        "{selectedKaraoke?.lyrics[lastDetectedLyric]?.text}"
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>          {/* Saved Recordings */}
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/50 w-96 hover:shadow-3xl transition-all duration-300">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">🎵 Tes Chefs-d'Œuvre</h2>
              {savedRecordings.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {savedRecordings.map((recording) => (
                    <div key={recording.id} className="p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-r from-purple-50 to-pink-50">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-gray-800">{recording.name}</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {recording.date}
                        </span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            const audio = new Audio(recording.url)
                            audio.play()
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-md font-semibold flex items-center justify-center gap-1"
                        >
                          ▶️ Écouter
                        </button>
                        <button
                          onClick={() => {
                            const a = document.createElement('a')
                            a.href = recording.url
                            a.download = `${recording.name}.webm`
                            a.click()
                          }}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 shadow-md font-semibold flex items-center justify-center gap-1"
                        >
                          💾 Télécharger
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎤</div>
                  <p className="text-gray-500 text-lg mb-2">
                    Aucun enregistrement pour le moment
                  </p>
                  <p className="text-sm text-gray-400">
                    Commence à chanter pour créer tes premiers chefs-d'œuvre ! ✨
                  </p>
                </div>
              )}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DrawingCanvas
