/**
 * ZSynora Technologies — Grand Celebration & Confetti Launch System
 * Extended multi-wave celebration with floating balloons, emoji bursts, ribbons, and star cannons
 */

(function () {
  'use strict';

  let activeAnimation = null;
  let canvas = null;
  let ctx = null;
  let particles = [];
  let balloons = [];
  let emojiParticles = [];

  const colors = [
    '#2563eb', // Brand Electric Blue
    '#38bdf8', // Sky Blue
    '#6366f1', // Synergy Indigo
    '#10b981', // Emerald Growth
    '#f59e0b', // Radiant Gold
    '#f43f5e', // Festive Rose
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#14b8a6', // Cyan Teal
    '#fbbf24'  // Amber Spark
  ];

  const emojis = ['🚀', '🎉', '✨', '🥳', '🌟', '⚡️', '💡', '🏆', '💎', '🔥'];
  const balloonColors = ['#2563eb', '#38bdf8', '#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  // Particle Factory
  function createParticle(x, y, isCannon) {
    const angle = isCannon 
      ? (x < window.innerWidth / 2 ? (Math.random() * 0.45 + 0.08) * -Math.PI : (Math.random() * 0.45 + 0.47) * -Math.PI)
      : Math.random() * Math.PI * 2;
    const speed = isCannon ? Math.random() * 22 + 14 : Math.random() * 12 + 5;

    const shapes = ['rect', 'circle', 'ribbon', 'star'];
    const selectedShape = shapes[Math.floor(Math.random() * shapes.length)];

    return {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isCannon ? 12 : 5),
      size: Math.random() * 10 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      wobble: Math.random() * 12,
      wobbleSpeed: Math.random() * 0.12 + 0.04,
      gravity: 0.28,       // Slightly lighter gravity for longer floating fun
      drag: 0.965,        // Smooth air resistance
      opacity: 1,
      shape: selectedShape,
      ribbonLength: Math.random() * 16 + 10
    };
  }

  // Floating Emoji Factory
  function createEmojiParticle(x, y) {
    const angle = (Math.random() * 0.6 + 0.2) * -Math.PI;
    const speed = Math.random() * 14 + 8;
    return {
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 6,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      size: Math.floor(Math.random() * 14 + 22),
      rotation: Math.random() * 40 - 20,
      rotationSpeed: (Math.random() - 0.5) * 4,
      gravity: 0.18,
      drag: 0.98,
      opacity: 1
    };
  }

  // Floating Balloon Factory
  function createBalloon(x) {
    return {
      x: x || Math.random() * (window.innerWidth - 100) + 50,
      y: window.innerHeight + 50,
      vx: (Math.random() - 0.5) * 1.5,
      vy: -(Math.random() * 2.2 + 2.0), // Floats upwards smoothly
      radius: Math.random() * 14 + 24,
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
      stringLength: Math.random() * 20 + 35,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.02,
      opacity: 0.92
    };
  }

  function getOrCreateCanvas() {
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'celebration-canvas';
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100vw';
      canvas.style.height = '100vh';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '999999';
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
    }
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    return { canvas, ctx };
  }

  function shootBurst(x, y, count, isCannon) {
    getOrCreateCanvas();
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(x, y, isCannon));
    }
    if (!activeAnimation) {
      render();
    }
  }

  function shootEmojis(x, y, count) {
    getOrCreateCanvas();
    for (let i = 0; i < count; i++) {
      emojiParticles.push(createEmojiParticle(x, y));
    }
    if (!activeAnimation) {
      render();
    }
  }

  function releaseBalloons(count) {
    getOrCreateCanvas();
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        balloons.push(createBalloon());
        if (!activeAnimation) render();
      }, i * 180);
    }
  }

  function drawStar(cx, cy, spikes, outerRadius, innerRadius, color) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function render() {
    const totalActive = particles.length + balloons.length + emojiParticles.length;
    if (totalActive === 0) {
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
        canvas = null;
        ctx = null;
      }
      activeAnimation = null;
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Balloons
    for (let i = balloons.length - 1; i >= 0; i--) {
      const b = balloons[i];
      b.wobble += b.wobbleSpeed;
      b.x += b.vx + Math.sin(b.wobble) * 0.8;
      b.y += b.vy;

      if (b.y < -100) {
        balloons.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = b.opacity;

      // Balloon Body (Oval)
      ctx.beginPath();
      ctx.ellipse(b.x, b.y, b.radius * 0.85, b.radius, 0, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();

      // Balloon Highlight
      ctx.beginPath();
      ctx.ellipse(b.x - b.radius * 0.3, b.y - b.radius * 0.35, b.radius * 0.22, b.radius * 0.35, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.fill();

      // Balloon Knot
      ctx.beginPath();
      ctx.moveTo(b.x - 3, b.y + b.radius);
      ctx.lineTo(b.x + 3, b.y + b.radius);
      ctx.lineTo(b.x, b.y + b.radius + 5);
      ctx.closePath();
      ctx.fillStyle = b.color;
      ctx.fill();

      // Balloon String (Wavy)
      ctx.beginPath();
      ctx.moveTo(b.x, b.y + b.radius + 5);
      ctx.bezierCurveTo(
        b.x - 6, b.y + b.radius + 20,
        b.x + 6, b.y + b.radius + 35,
        b.x, b.y + b.radius + b.stringLength
      );
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    // 2. Draw Emojis
    for (let i = emojiParticles.length - 1; i >= 0; i--) {
      const ep = emojiParticles[i];
      ep.vx *= ep.drag;
      ep.vy *= ep.drag;
      ep.vy += ep.gravity;
      ep.x += ep.vx;
      ep.y += ep.vy;
      ep.rotation += ep.rotationSpeed;
      ep.opacity -= 0.005;

      if (ep.opacity <= 0 || ep.y > canvas.height + 60) {
        emojiParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, ep.opacity);
      ctx.translate(ep.x, ep.y);
      ctx.rotate((ep.rotation * Math.PI) / 180);
      ctx.font = `${ep.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ep.emoji, 0, 0);
      ctx.restore();
    }

    // 3. Draw Confetti Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.opacity -= 0.004; // Long lasting gentle fade

      if (p.opacity <= 0 || p.y > canvas.height + 60) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);

      if (p.shape === 'rect') {
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.75);
      } else if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      } else if (p.shape === 'star') {
        drawStar(0, 0, 5, p.size, p.size / 2, p.color);
      } else {
        // Dynamic Fluttering Ribbon
        ctx.fillStyle = p.color;
        const ribbonWidth = p.size * 0.7;
        ctx.fillRect(-ribbonWidth / 2, -p.ribbonLength / 2, ribbonWidth, p.ribbonLength);
      }
      ctx.restore();
    }

    activeAnimation = requestAnimationFrame(render);
  }

  // Harmonic celebratory chime synthesis
  function playCelebrationFanfare() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // 5-note celebratory chord progression (C5 -> E5 -> G5 -> B5 -> C6)
      const chord = [523.25, 659.25, 783.99, 987.77, 1046.50];
      chord.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.09);

        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.09);
        gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + index * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.09 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.09);
        osc.stop(ctx.currentTime + index * 0.09 + 0.95);
      });
    } catch (e) {
      // Audio context restricted before user interaction; ignore safely
    }
  }

  // Extended Grand Celebration Sequence (Runs across ~7 seconds of pure fun)
  window.triggerCelebration = function () {
    playCelebrationFanfare();
    const w = window.innerWidth;
    const h = window.innerHeight;

    // Stage 1 (0s): Dual corner cannon explosion
    shootBurst(w * 0.1, h * 0.95, 90, true);
    shootBurst(w * 0.9, h * 0.95, 90, true);
    shootEmojis(w * 0.5, h * 0.5, 12);
    releaseBalloons(6);

    // Stage 2 (0.8s): Sky star shower & center fountain
    setTimeout(() => {
      shootBurst(w * 0.5, h * 0.35, 100, false);
      shootEmojis(w * 0.25, h * 0.45, 8);
      shootEmojis(w * 0.75, h * 0.45, 8);
      releaseBalloons(5);
    }, 800);

    // Stage 3 (1.8s): Cross-firing side cannons
    setTimeout(() => {
      shootBurst(w * 0.2, h * 0.85, 75, true);
      shootBurst(w * 0.8, h * 0.85, 75, true);
      shootBurst(w * 0.5, h * 0.6, 60, false);
      shootEmojis(w * 0.5, h * 0.35, 14);
    }, 1800);

    // Stage 4 (3.0s): Cascading metallic ribbons and glitter rain
    setTimeout(() => {
      shootBurst(w * 0.35, h * 0.25, 70, false);
      shootBurst(w * 0.65, h * 0.25, 70, false);
      releaseBalloons(4);
    }, 3000);

    // Stage 5 (4.2s): Grand finale sparkle fountain!
    setTimeout(() => {
      shootBurst(w * 0.5, h * 0.85, 120, false);
      shootEmojis(w * 0.5, h * 0.5, 16);
    }, 4200);
  };

  // Mini burst for interactive click easter egg
  window.triggerMiniBurst = function (x, y) {
    shootBurst(x, y, 35, false);
    shootEmojis(x, y, 5);
  };

  // Automatically start grand celebration when page opens (ONLY for index.html, NEVER on launch.html)
  document.addEventListener('DOMContentLoaded', () => {
    const isLaunchPage = window.location.pathname.endsWith('launch.html') || 
                         window.location.href.includes('launch.html');
    
    if (!isLaunchPage) {
      setTimeout(() => {
        window.triggerCelebration();
      }, 400);
    }

    // Interactive Easter Egg: Clicking anywhere on hero celebration badge or interactive element spawns celebration
    const pill = document.querySelector('.launch-celebration-pill');
    if (pill) {
      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        window.triggerCelebration();
      });
    }
  });

  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
})();
