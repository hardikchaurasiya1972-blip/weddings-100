// Riwaayat Royale - THE ROYAL 3D ATELIER Engine
// Interactive 360 Product Showroom with Canvas3D/2D Effects, Kundan Light Nodes, and Fabric Motion

class Royal3DAtelierEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;

    this.rotationAngle = 0;
    this.isDragging = false;
    this.lastMouseX = 0;

    this.activeImageIndex = 0;
    this.activeProductImages = [
      "haldi/imgi_140_yellow-organza-silk-embroidered-gorgeous-indowestern-skirt-set-iwsuscc48265562-u.jpg",
      "sangeet/imgi_131_purple-georgette-embroidered-sequins-lehenga-ghsads271-u.jpg",
      "indian wedding dresses for women photo - Google Search/imgi_180_golden-grace-in-red-silk-zari-embroidered-stone-sequins-lehenga-ghsli2574150-u.jpg"
    ];

    this.loadedImages = [];
    this.ringAngle = 0;
    this.particles = [];
    this.mode = '360'; // '360', 'fabric', 'aura', 'light'

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Drag interaction for 360 rotation
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
    });

    window.addEventListener('mouseup', () => this.isDragging = false);

    window.addEventListener('mousemove', (e) => {
      if (this.isDragging) {
        const deltaX = e.clientX - this.lastMouseX;
        this.rotationAngle += deltaX * 0.01;
        this.lastMouseX = e.clientX;
      }
    });

    // Touch support for mobile
    this.canvas.addEventListener('touchstart', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.touches[0].clientX;
    });
    window.addEventListener('touchend', () => this.isDragging = false);
    window.addEventListener('touchmove', (e) => {
      if (this.isDragging && e.touches.length > 0) {
        const deltaX = e.touches[0].clientX - this.lastMouseX;
        this.rotationAngle += deltaX * 0.01;
        this.lastMouseX = e.touches[0].clientX;
      }
    });

    this.preloadImages();
    this.createAuraParticles(60);
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = this.canvas.clientWidth || 600;
    this.height = this.canvas.height = this.canvas.clientHeight || 500;
  }

  preloadImages() {
    this.activeProductImages.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.loadedImages[idx] = img;
      };
    });
  }

  setProductImage(imageSrc) {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => {
      this.loadedImages[0] = img;
      this.activeImageIndex = 0;
    };
  }

  createAuraParticles(count) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 120 + Math.random() * 100,
        speed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 3 + 1,
        yOffset: (Math.random() - 0.5) * 200,
        alpha: Math.random() * 0.8 + 0.2
      });
    }
  }

  draw3DPedestal() {
    const centerX = this.width / 2;
    const centerY = this.height / 2 + 160;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    // Oval base
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 180, 50, 0, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(45, 10, 30, 0.9)';
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#D4AF37';
    this.ctx.stroke();

    // Inner glowing ring
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 150, 40, 0, 0, Math.PI * 2);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(230, 198, 135, 0.5)';
    this.ctx.stroke();

    this.ctx.restore();
  }

  drawRotating3DRings() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.ringAngle += 0.008;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);

    // Ring 1 (Gold)
    this.ctx.save();
    this.ctx.rotate(this.ringAngle + this.rotationAngle * 0.5);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 200, 70, Math.PI / 6, 0, Math.PI * 2);
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    this.ctx.stroke();
    this.ctx.restore();

    // Ring 2 (Rose Gold)
    this.ctx.save();
    this.ctx.rotate(-this.ringAngle * 0.8);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, 220, 80, -Math.PI / 4, 0, Math.PI * 2);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(224, 169, 175, 0.35)';
    this.ctx.stroke();
    this.ctx.restore();

    this.ctx.restore();
  }

  drawAuraParticles() {
    const centerX = this.width / 2;
    const centerY = this.height / 2;

    this.particles.forEach(p => {
      p.angle += p.speed + (this.isDragging ? 0.02 : 0);

      const x = centerX + Math.cos(p.angle + this.rotationAngle) * p.radius;
      const y = centerY + Math.sin(p.angle + this.rotationAngle) * (p.radius * 0.4) + p.yOffset;

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = '#E6C687';
      this.ctx.globalAlpha = p.alpha;
      this.ctx.shadowBlur = 8;
      this.ctx.shadowColor = '#D4AF37';
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawProduct3DFrame() {
    const img = this.loadedImages[this.activeImageIndex];
    if (!img) return;

    const centerX = this.width / 2;
    const centerY = this.height / 2 - 10;

    // Simulated 3D Y-axis rotation transform
    const scaleX = Math.cos(this.rotationAngle);
    const flip = scaleX < 0 ? -1 : 1;

    this.ctx.save();
    this.ctx.translate(centerX, centerY);
    this.ctx.scale(scaleX, 1);

    const imgWidth = 240;
    const imgHeight = 330;

    // Outer Gold Card Frame
    this.ctx.save();
    this.ctx.shadowBlur = 30;
    this.ctx.shadowColor = 'rgba(212, 175, 55, 0.4)';
    this.ctx.fillStyle = 'rgba(45, 10, 30, 0.85)';
    this.ctx.beginPath();
    this.ctx.roundRect(-imgWidth / 2 - 10, -imgHeight / 2 - 10, imgWidth + 20, imgHeight + 20, 16);
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#D4AF37';
    this.ctx.stroke();
    this.ctx.restore();

    // Actual Product Image (Unchanged Source of Truth)
    this.ctx.save();
    this.ctx.scale(flip, 1); // Maintain original image orientation
    this.ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
    this.ctx.restore();

    this.ctx.restore();
  }

  animate() {
    if (!this.isDragging) {
      this.rotationAngle += 0.003; // Gentle auto rotation
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.draw3DPedestal();
    this.drawRotating3DRings();
    this.drawAuraParticles();
    this.drawProduct3DFrame();

    requestAnimationFrame(() => this.animate());
  }
}

let atelierEngineInstance = null;
document.addEventListener('DOMContentLoaded', () => {
  atelierEngineInstance = new Royal3DAtelierEngine('atelier3dCanvas');
});
