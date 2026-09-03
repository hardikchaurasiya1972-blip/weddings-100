// Riwaayat Royale - Slow-Motion Opening Video & Splash Engine
// Features: Ultra Slow-Motion Flower Petal Physics, Volumetric Champagne Rays, Cinematic Zoom & Smooth Reveal

class SlowmoIntroEngine {
  constructor() {
    this.overlay = document.getElementById('introSplashScreen');
    this.canvas = document.getElementById('introSlowmoCanvas');
    if (!this.canvas || !this.overlay) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.time = 0;

    this.petals = [];
    this.lightBeams = [];
    this.progress = 0;
    this.isEntering = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    this.createSlowmoPetals(50);
    this.createLightBeams(8);

    this.startLoadingSequence();
    this.animate();

    const enterBtn = document.getElementById('enterMaisonBtn');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => this.revealWebsite());
    }
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  createSlowmoPetals(count) {
    const colors = ['#E6C687', '#E0A9AF', '#F59E0B', '#B76E79', '#FFF5D6'];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 16 + 8,
        speedY: (Math.random() * 0.25 + 0.1), // Slowmo speed (1/4 normal speed)
        speedX: (Math.random() - 0.5) * 0.2,
        angle: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.008, // Slow rotation
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.3
      });
    }
  }

  createLightBeams(count) {
    for (let i = 0; i < count; i++) {
      this.lightBeams.push({
        x: (this.width / count) * i + Math.random() * 60,
        width: 80 + Math.random() * 120,
        alpha: Math.random() * 0.3 + 0.1,
        angle: -0.15 - Math.random() * 0.1,
        speed: 0.003
      });
    }
  }

  startLoadingSequence() {
    const progressBar = document.getElementById('introProgressBar');
    const statusText = document.getElementById('introStatusText');
    const enterBtn = document.getElementById('enterMaisonBtn');

    const interval = setInterval(() => {
      if (this.isEntering) {
        clearInterval(interval);
        return;
      }

      this.progress += 2.5;

      if (progressBar) progressBar.style.width = `${Math.min(100, this.progress)}%`;

      if (this.progress > 40 && this.progress < 80) {
        if (statusText) statusText.textContent = 'Rendering 3D Royal Atelier...';
      } else if (this.progress >= 80 && this.progress < 100) {
        if (statusText) statusText.textContent = 'Preparing Royal Fashion Showcase...';
      } else if (this.progress >= 100) {
        clearInterval(interval);
        if (statusText) statusText.textContent = 'Maison De Couture Ready';
        if (enterBtn) enterBtn.classList.add('visible');

        // Auto transition after 4 seconds
        setTimeout(() => {
          if (!this.isEntering) this.revealWebsite();
        }, 1200);
      }
    }, 80);
  }

  revealWebsite() {
    if (this.isEntering) return;
    this.isEntering = true;

    if (this.overlay) {
      this.overlay.classList.add('fade-out');
      setTimeout(() => {
        this.overlay.style.display = 'none';
      }, 1200);
    }
  }

  drawSlowmoPetals() {
    this.petals.forEach(p => {
      p.y += p.speedY;
      p.x += Math.sin(p.y * 0.01) * 0.3 + p.speedX;
      p.angle += p.rotSpeed;

      if (p.y > this.height + 30) {
        p.y = -30;
        p.x = Math.random() * this.width;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = '#D4AF37';
      this.ctx.fill();

      this.ctx.restore();
    });
  }

  drawLightBeams() {
    this.lightBeams.forEach(lb => {
      lb.alpha += Math.sin(this.time * lb.speed) * 0.003;

      this.ctx.save();
      this.ctx.translate(lb.x, 0);
      this.ctx.rotate(lb.angle);

      const grad = this.ctx.createLinearGradient(0, 0, 0, this.height);
      grad.addColorStop(0, 'rgba(255, 245, 214, 0.4)');
      grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
      grad.addColorStop(1, 'transparent');

      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = Math.max(0.08, Math.min(0.4, lb.alpha));
      this.ctx.fillRect(0, 0, lb.width, this.height * 1.6);
      this.ctx.restore();
    });
  }

  animate() {
    this.time++;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Deep luxury opening background
    const bgGrad = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, 50,
      this.width / 2, this.height / 2, this.width / 1.1
    );
    bgGrad.addColorStop(0, '#360922');
    bgGrad.addColorStop(0.6, '#1F0519');
    bgGrad.addColorStop(1, '#0A0208');

    this.ctx.fillStyle = bgGrad;
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawLightBeams();
    this.drawSlowmoPetals();

    if (!this.isEntering) {
      requestAnimationFrame(() => this.animate());
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SlowmoIntroEngine();
});
