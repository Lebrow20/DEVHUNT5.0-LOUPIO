// src/pages/MonModele3D.jsx
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TalkingTom from '../components/TalkingTom'

export default function MonModele3D() {
  const [currentAnimation, setCurrentAnimation] = useState(2)

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      {/* Panel de contrôle - OUTSIDE du Canvas */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 100,
        background: 'rgba(0,0,0,0.8)',
        padding: '20px',
        borderRadius: '10px',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        minWidth: '280px'
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#4CAF50' }}>
          🎬 TalkingTom Controls
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px' }}>
            Animation: <strong>{currentAnimation}</strong> / 17
          </label>
          <input
            type="range"
            min="0"
            max="17"
            value={currentAnimation}
            onChange={(e) => setCurrentAnimation(parseInt(e.target.value))}
            style={{
              width: '100%',
              height: '6px',
              borderRadius: '3px',
              background: '#ddd',
              outline: 'none'
            }}
          />
        </div>

        {/* Boutons navigation */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <button
            onClick={() => setCurrentAnimation(Math.max(0, currentAnimation - 1))}
            disabled={currentAnimation === 0}
            style={{
              padding: '8px 15px',
              border: 'none',
              borderRadius: '4px',
              background: currentAnimation === 0 ? '#666' : '#2196F3',
              color: 'white',
              cursor: currentAnimation === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Prev
          </button>
          <button
            onClick={() => setCurrentAnimation(Math.min(17, currentAnimation + 1))}
            disabled={currentAnimation === 17}
            style={{
              padding: '8px 15px',
              border: 'none',
              borderRadius: '4px',
              background: currentAnimation === 17 ? '#666' : '#2196F3',
              color: 'white',
              cursor: currentAnimation === 17 ? 'not-allowed' : 'pointer'
            }}
          >
            Next →
          </button>
        </div>

        {/* Boutons rapides */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
          {[0, 1, 2, 5, 8, 10, 12, 15, 17].map(animIndex => (
            <button
              key={animIndex}
              onClick={() => setCurrentAnimation(animIndex)}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '3px',
                background: currentAnimation === animIndex ? '#4CAF50' : '#555',
                color: 'white',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {animIndex}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas 3D - ONLY 3D elements inside */}
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        <TalkingTom index={currentAnimation} />
        
        <OrbitControls />
      </Canvas>
    </div>
  )
}