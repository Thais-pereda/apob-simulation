'use strict';

const BloodVesselSimulation = () => {
  const [particleCount, setParticleCount] = React.useState(10);
  const [collisionsPerSecond, setCollisionsPerSecond] = React.useState(0);
  const canvasRef = React.useRef(null);
  const particlesRef = React.useRef([]);
  const collisionCountRef = React.useRef(0);
  const lastTimeRef = React.useRef(Date.now());

  const VESSEL_HEIGHT = 200;
  const PARTICLE_RADIUS = 4;

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

  const updateParticles = (ctx, particles) => {
    const width = ctx.canvas.width;
    const height = VESSEL_HEIGHT;
    
    particles.forEach(particle => {
      particle.x += particle.dx;
      particle.y += particle.dy;

      if (particle.y <= PARTICLE_RADIUS || particle.y >= height - PARTICLE_RADIUS) {
        particle.dy *= -1;
        collisionCountRef.current++;
      }

      if (particle.x >= width) {
        particle.x = 0;
      }
    });
  };

  const render = (ctx, particles) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Vaso sanguíneo
    ctx.fillStyle = '#ffebee';
    ctx.fillRect(0, 0, ctx.canvas.width, VESSEL_HEIGHT);

    // Bordas do vaso - agora com cor fixa
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillRect(0, 0, ctx.canvas.width, 2);
    ctx.fillRect(0, VESSEL_HEIGHT - 2, ctx.canvas.width, 2);

    // Partículas
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, PARTICLE_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = '#e74c3c';
      ctx.fill();
    });
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    particlesRef.current = initParticles(particleCount);

    let animationFrameId;
    const animate = () => {
      updateParticles(ctx, particlesRef.current);
      render(ctx, particlesRef.current);

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
  }, [particleCount]);

  return React.createElement('div', { style: { padding: '20px' } },
    React.createElement('h1', { 
      style: { 
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px'
      } 
    }, 'Simulação de Partículas ApoB'),
    React.createElement('canvas', {
      ref: canvasRef,
      width: 600,
      height: VESSEL_HEIGHT,
      style: { 
        width: '100%',
        maxWidth: '600px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        display: 'block',
        margin: '0 auto'
      }
    }),
    React.createElement('div', { 
      style: { 
        marginTop: '20px',
        maxWidth: '600px',
        margin: '20px auto'
      } 
    },
      React.createElement('div', { style: { marginBottom: '10px' } },
        React.createElement('label', { 
          style: { 
            display: 'block',
            marginBottom: '5px',
            fontWeight: 'bold'
          } 
        }, 
          `Número de Partículas: ${particleCount}`
        ),
        React.createElement('input', {
          type: 'range',
          min: 1,
          max: 100,
          value: particleCount,
          onChange: (e) => setParticleCount(Number(e.target.value)),
          style: { width: '100%', marginTop: '5px' }
        })
      ),
      React.createElement('div', {
        style: {
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
          marginTop: '20px',
          textAlign: 'center'
        }
      },
        React.createElement('p', {
          style: { 
            margin: 0, 
            fontWeight: 'bold',
            fontSize: '16px'
          }
        }, `Colisões por segundo: ${collisionsPerSecond}`)
      )
    )
  );
};

ReactDOM.render(
  React.createElement(BloodVesselSimulation),
  document.getElementById('root')
);
