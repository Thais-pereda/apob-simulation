import React, { useState, useEffect, useRef } from 'react';

const BloodVesselSimulation = () => {
  const [particleCount, setParticleCount] = useState(10);
  const [vesselFragility, setVesselFragility] = useState(20);
  const [collisionsPerSecond, setCollisionsPerSecond] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const collisionCountRef = useRef(0);
  const lastTimeRef = useRef(Date.now());

  const VESSEL_HEIGHT = 200;
  const PARTICLE_RADIUS = 4;

  // Inicializa partículas
  const initParticles = (count) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * 200,
        y: PARTICLE_RADIUS + Math.random() * (VESSEL_HEIGHT - 2 * PARTICLE_RADIUS),
        dx: 1 + Math.random() * 2,
        dy: (Math.random() - 0.5) * 2,
      });
    }
    return particles;
  };

  // Atualiza posição das partículas
  const updateParticles = (ctx, particles) => {
    const width = ctx.canvas.width;
    const height = VESSEL_HEIGHT;
    
    particles.forEach(particle => {
      particle.x += particle.dx;
      particle.y += particle.dy;

      // Verifica colisão com as paredes
      if (particle.y <= PARTICLE_RADIUS || particle.y >= height - PARTICLE_RADIUS) {
        particle.dy *= -1;
        collisionCountRef.current++;
      }

      // Reposiciona partícula quando sai da tela
      if (particle.x >= width) {
        particle.x = 0;
      }
    });
  };

  // Renderiza a cena
  const render = (ctx, particles) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Desenha o vaso sanguíneo
    ctx.fillStyle = '#ffebee';
    ctx.fillRect(0, 0, ctx.canvas.width, VESSEL_HEIGHT);

    // Desenha bordas do vaso com opacidade baseada na fragilidade
    const borderOpacity = 0.3 + (vesselFragility / 100) * 0.7;
    ctx.fillStyle = `rgba(255, 0, 0, ${borderOpacity})`;
    ctx.fillRect(0, 0, ctx.canvas.width, 2);
    ctx.fillRect(0, VESSEL_HEIGHT - 2, ctx.canvas.width, 2);

    // Desenha partículas
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#e74c3c';
      ctx.fill();
    });
  };

  // Loop de animação
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    particlesRef.current = initParticles(particleCount);

    let animationFrameId;
    const animate = () => {
      updateParticles(ctx, particlesRef.current);
      render(ctx, particlesRef.current);

      // Atualiza contador de colisões por segundo
      const now = Date.now();
      if (now - lastTimeRef.current >= 1000) {
        setCollisionsPerSecond(collisionCountRef.current);
        collisionCountRef.current = 0;
        lastTimeRef.current = now;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [particleCount, vesselFragility]);

  return (
    <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
      <div className="w-full max-w-2xl">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={VESSEL_HEIGHT}
          className="w-full bg-white rounded-lg shadow-md"
        />
        
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Partículas: {particleCount}
            </label>
            <input
              type="range"
              min="1"
              max="50"
              value={particleCount}
              onChange={(e) => setParticleCount(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fragilidade da Parede: {vesselFragility}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={vesselFragility}
              onChange={(e) => setVesselFragility(Number(e.target.value))}
              className="w-full mt-1"
            />
          </div>

          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-lg font-semibold text-gray-800">
              Colisões por segundo: {collisionsPerSecond}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodVesselSimulation;
