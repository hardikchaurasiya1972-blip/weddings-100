// Riwaayat Royale - Hero 3D & Particle Canvas Engine
// Features: Floating Flower Petals, Golden Dust Particles, Flowing 3D Silk Ribbons, Dynamic Lighting

class Hero3DEngine {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.canvas = document.createElement('canvas');
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.width = 0;
    this.height = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    this.particles = [];
    this.petals = [];
    this.ribbons = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));

    this.createParticles(120);
    this.createPetals(35);
    this.createRibbons(3);

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = this.container.clientWidth;
    this.height = this.canvas.height = this.container.clientHeight;
  }

  onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.targetMouseX = (e.clientX - rect.left - this.width / 2) * 0.15;
    this.targetMouseY = (e.clientY - rect.top - this.height / 2) * 0.15;
  }

  createParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        speedY: -Math.random() * 0.6 - 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.3 ? '#E6C687' : '#B76E79'
      });
    }
  }

  createPetals(count) {
    const colors = ['#E0A9AF', '#D4AF37', '#F59E0B', '#B76E79', '#FDFBF7'];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 14 + 8,
        angle: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        speedY: Math.random() * 0.8 + 0.4,
        speedX: Math.sin(Math.random() * Math.PI) * 0.5,
        oscillation: Math.random() * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  createRibbons(count) {
    for (let i = 0; i < count; i++) {
      this.ribbons.push({
        phase: i * (Math.PI / 1.5),
        amplitude: 40 + i * 20,
        frequency: 0.002 + i * 0.001,
        speed: 0.015 + i * 0.005,
        color: i === 0 ? 'rgba(212, 175, 55, 0.18)' : i === 1 ? 'rgba(183, 110, 121, 0.15)' : 'rgba(74, 14, 46, 0.25)'
      });
    }
  }

  drawParticles() {
    this.particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.01;

      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(p.x + this.mouseX * 0.2, p.y + this.mouseY * 0.2, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = Math.max(0.1, Math.min(0.9, p.alpha));
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = '#D4AF37';
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawPetals() {
    this.petals.forEach(pt => {
      pt.y += pt.speedY;
      pt.x += Math.sin(pt.y * pt.oscillation) * 0.6 + pt.speedX;
      pt.angle += pt.rotationSpeed;

      if (pt.y > this.height + 20) {
        pt.y = -20;
        pt.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(pt.x + this.mouseX * 0.4, pt.y + this.mouseY * 0.4);
      this.ctx.rotate(pt.angle);

      // Draw stylized flower petal shape
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.quadraticCurveTo(pt.size / 2, -pt.size, pt.size, 0);
      this.ctx.quadraticCurveTo(pt.size / 2, pt.size, 0, 0);
      this.ctx.fillStyle = pt.color;
      this.ctx.globalAlpha = 0.75;
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  drawSilkRibbons() {
    const time = Date.now();
    this.ribbons.forEach(r => {
      this.ctx.save();
      this.ctx.beginPath();
      const pointsCount = 40;
      for (let i = 0; i <= pointsCount; i++) {
        const x = (this.width / pointsCount) * i;
        const y = this.height * 0.5 + 
                  Math.sin(time * r.frequency + i * 0.15 + r.phase) * r.amplitude +
                  this.mouseY * 0.3;

        if (i === 0) this.ctx.moveTo(x, y);
        else this.ctx.lineTo(x, y);
      }
      this.ctx.lineWidth = 18;
      this.ctx.strokeStyle = r.color;
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  animate() {
    // Smooth camera lag
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawSilkRibbons();
    this.drawParticles();
    this.drawPetals();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Hero3DEngine('heroCanvasContainer');
});
