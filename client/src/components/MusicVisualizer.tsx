// MusicVisualizer.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Loader } from "./Loader";

const MusicVisualizer = ({ audioSrc }) => {
  if (!audioSrc) {
    return (
      <div
        className="w-full flex justify-center
      "
      >
        <Loader />;
      </div>
    );
  }

  const mountRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    // Configuración de la escena, cámara y renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    mountRef.current.appendChild(renderer.domElement);

    // Crear barras para el visualizador
    const bars = [];
    const barCount = 32; // Número de barras
    const barWidth = 1.5;
    const spacing = 0.5;
    for (let i = 0; i < barCount; i++) {
      const geometry = new THREE.BoxGeometry(barWidth, 1, barWidth);
      const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
      const bar = new THREE.Mesh(geometry, material);
      // Distribuir las barras horizontalmente
      bar.position.x = (i - barCount / 2) * (barWidth + spacing);
      bar.position.y = 0.5;
      scene.add(bar);
      bars.push(bar);
    }

    // Agregar luces a la escena
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 50, 50);
    scene.add(directionalLight);

    // Configuración del análisis de audio
    let analyser;
    if (audioRef.current) {
      const audio = audioRef.current;
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaElementSource(audio);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 64; // Debe ser potencia de 2
      source.connect(analyser);
      analyser.connect(audioContext.destination);
    }

    // Bucle de animación
    const animate = () => {
      requestAnimationFrame(animate);
      if (analyser) {
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);
        // Actualizar cada barra según la frecuencia
        for (let i = 0; i < bars.length; i++) {
          const scaleY = Math.max(dataArray[i] / 50, 1);
          bars[i].scale.y = scaleY;
          bars[i].position.y = scaleY / 2;
        }
      }
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup al desmontar el componente
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      {/* Contenedor para Three.js */}
      <div ref={mountRef} className="w-full h-1/2" />
      {/* El audio se recibe a través de la prop audioSrc */}
      <audio ref={audioRef} controls className="mt-4">
        <source src={audioSrc} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default MusicVisualizer;
