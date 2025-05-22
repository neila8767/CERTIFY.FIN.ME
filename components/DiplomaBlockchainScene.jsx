import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Bloc 3D
const Block = ({ position, color = 'skyblue', active = false }) => {
  const ref = useRef()

  useFrame(() => {
    if (active) ref.current.rotation.y += 0.01
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[2, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Diplôme animé
const Diploma = ({ position }) => {
  const ref = useRef()
  const [certified, setCertified] = useState(false)

  useFrame(({ clock }) => {
    ref.current.rotation.y = Math.sin(clock.getElapsedTime()) * 0.3
    ref.current.rotation.x = Math.sin(clock.getElapsedTime()) * 0.2
  })

  return (
    <mesh
      ref={ref}
      position={position}
      onClick={() => setCertified(true)}
    >
      <planeGeometry args={[1.5, 1]} />
      <meshStandardMaterial color={certified ? 'limegreen' : 'white'} />
      <Html center position={[0, 0, 0.1]}>
        <div style={{ color: '#222', fontSize: '12px' }}>
          {certified ? 'Diplôme certifié ✅' : 'Cliquez pour certifier'}
        </div>
      </Html>
    </mesh>
  )
}

// Chaîne de blocs
const Blockchain = () => {
  const blocks = []
  for (let i = 0; i < 5; i++) {
    blocks.push(
      <Block
        key={i}
        position={[i * 3, 0, 0]}
        color={i === 2 ? '#38A169' : '#2D3748'}
        active={i === 2}
      />
    )
  }

  return <>{blocks}</>
}

// Scène principale
export default function DiplomaBlockchainScene() {
  return (
    <Canvas camera={{ position: [10, 5, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} />
      <OrbitControls />
      <Diploma position={[0, 2, 0]} />
      <Blockchain />
    </Canvas>
  )
}
