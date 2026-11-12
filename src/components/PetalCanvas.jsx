import React, { useEffect, useRef } from 'react';

/**
 * 100% Pure Indian Marigold (गेंदा पुष्प) Falling Petals & Blossoms Canvas
 * Strictly Marigold flowers & petals — No leaves, no twigs.
 */
export default function PetalCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Pure Marigold Palette: Golden Yellow, Saffron Orange, Bright Genda Yellow
    const marigoldColors = [
      '#F59E0B', // Radiant Marigold
      '#FBBF24', // Golden Genda Yellow
      '#EAA315', // Auspicious Turmeric Gold
      '#D97706', // Deep Marigold Saffron
      '#EA580C', // Rich Saffron Orange
      '#FDE047', // Sunlit Yellow
    ];

    const particleCount = Math.min(Math.floor(window.innerWidth / 38), 28);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height - height,
      size: Math.random() * 8 + 8,
      speedX: (Math.random() - 0.5) * 0.9,
      speedY: Math.random() * 0.6 + 0.6,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.025,
      primaryColor: marigoldColors[Math.floor(Math.random() * marigoldColors.length)],
      secondaryColor: Math.random() > 0.5 ? '#EA580C' : '#FBBF24',
      isFlowerHead: Math.random() > 0.65 // 35% full marigold blossoms, 65% single ruffled marigold petals
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += Math.sin(p.y * 0.015) * 0.8 + p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 30) {
          p.y = -30;
          p.x = Math.random() * width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isFlowerHead) {
          // Render Ruffled Blooming Marigold Flower (गेंदा फूल)
          const petalsInLayer = 8;
          // Outer Petal Ring
          ctx.fillStyle = p.primaryColor;
          for (let i = 0; i < petalsInLayer; i++) {
            const angle = (i * Math.PI * 2) / petalsInLayer;
            ctx.beginPath();
            ctx.ellipse(
              Math.cos(angle) * (p.size * 0.45),
              Math.sin(angle) * (p.size * 0.45),
              p.size * 0.4,
              p.size * 0.28,
              angle,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          // Inner Saffron Layer
          ctx.fillStyle = p.secondaryColor;
          for (let i = 0; i < petalsInLayer; i++) {
            const angle = (i * Math.PI * 2) / petalsInLayer + 0.35;
            ctx.beginPath();
            ctx.ellipse(
              Math.cos(angle) * (p.size * 0.28),
              Math.sin(angle) * (p.size * 0.28),
              p.size * 0.25,
              p.size * 0.18,
              angle,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }

          // Center Marigold Tuft
          ctx.fillStyle = '#C2410C';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FDE047';
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.08, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Render Ruffled Organic Marigold Petal
          ctx.fillStyle = p.primaryColor;
          ctx.beginPath();
          // Broad ruffled fan-shaped genda petal
          ctx.moveTo(-p.size * 0.2, -p.size * 0.6);
          ctx.bezierCurveTo(
            -p.size * 0.6, -p.size * 0.2,
            -p.size * 0.5, p.size * 0.4,
            0, p.size * 0.7
          );
          ctx.bezierCurveTo(
            p.size * 0.5, p.size * 0.4,
            p.size * 0.6, -p.size * 0.2,
            p.size * 0.2, -p.size * 0.6
          );
          // Ruffled top edge
          ctx.quadraticCurveTo(0, -p.size * 0.75, -p.size * 0.2, -p.size * 0.6);
          ctx.fill();

          // Saffron orange gradient shading along base
          ctx.fillStyle = p.secondaryColor;
          ctx.beginPath();
          ctx.arc(0, p.size * 0.4, p.size * 0.25, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      aria-hidden="true"
    />
  );
}
