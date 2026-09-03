// Riwaayat Royale - "A CELEBRATION IN MOTION" Campaign Engine
// Royal Indian Palace Architecture, Volumetric Champagne Light Shafts, Floating Petals & Depth-of-Field Motion

class CelebrationMotionEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.time = 0;

    this.lightShafts = [];
    this.petals = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.createLightShafts(6);
    this.createPetals(40);

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.clientWidth || 800;
    this.height = this.canvas.height = this.canvas.clientHeight || 500;
  }

  createLightShafts(count) {
    for (let i = 0; i < count; i++) {
      this.lightShafts.push({
        x: (this.width / count) * i + 40,
        width: 60 + Math.random() * 80,
        alpha: Math.random() * 0.25 + 0.1,
        angle: -0.2 - Math.random() * 0.1,
        speed: 0.005 + Math.random() * 0.005
      });
    }
  }

  createPetals(count) {
    const colors = ['#E6C687', '#E0A9AF', '#F59E0B', '#B76E79'];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 10 + 6,
        speedY: Math.random() * 0.7 + 0.3,
        speedX: Math.sin(Math.random() * Math.PI) * 0.4,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  drawPalaceArchway() {
    const timeOffset = Math.sin(this.time * 0.02) * 10;
    const centerX = this.width / 2 + timeOffset;
    const centerY = this.height / 2;

    this.ctx.save();

    // Outer Grand Jharokha Archway Silhouette
    this.ctx.beginPath();
    this.ctx.moveTo(centerX - 280, this.height);
    this.ctx.lineTo(centerX - 280, centerY - 60);
    this.ctx.bezierCurveTo(centerX - 280, centerY - 200, centerX - 120, centerY - 240, centerX, centerY - 240);
    this.ctx.bezierCurveTo(centerX + 120, centerY - 240, centerX + 280, centerY - 200, centerX + 280, centerY - 60);
    this.ctx.lineTo(centerX + 280, this.height);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    this.ctx.stroke();

    // Decorative Royal Crest Finial at Arch Apex
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY - 245, 12, 0, Math.PI * 2);
    this.ctx.fillStyle = '#D4AF37';
    this.ctx.fill();

    this.ctx.restore();
  }

  drawLightShafts() {
    this.lightShafts.forEach(ls => {
      ls.alpha += Math.sin(this.time * ls.speed) * 0.005;

      this.ctx.save();
      this.ctx.translate(ls.x, 0);
      this.ctx.rotate(ls.angle);

      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, 'rgba(255, 245, 214, 0.35)');
      grad.addColorStop(0.6, 'rgba(212, 175, 55, 0.15)');
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = Math.max(0.05, Math.min(0.4, ls.alpha));
      this.ctx.fillRect(0, 0, ls.width, this.height * 1.5);
      this.ctx.restore();
    });
  }

  drawFloatingPetals() {
    this.petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.02) * 0.5 + p.speedX;
      p.angle += p.rotSpeed;

      if (p.y > this.height + 20) {
        p.y = -20;
        p.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = 0.7;
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  animate() {
    this.time++;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Deep luxury background glow
    const bgGrad = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 50,
      this.width / 2, this.height / 2, this.width / 1.2
    );
    bgGrad.addColorStop(0, '#4A0E2E');
    bgGrad.addColorStop(0.7, '#1F0519');
    bgGrad.addColorStop(1, '#0A0208');

    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawLightShafts();
    this.drawPalaceArchway();
    this.drawFloatingPetals();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new CelebrationMotionEngine('celebrationMotionCanvas');
});
