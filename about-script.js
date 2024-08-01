// Dropdown functionality
function toggleDropdown() {
  var dropdown = document.getElementById("myDropdown");
  dropdown.classList.toggle("show");

  var dropbtn = document.querySelector(".dropbtn");
  dropbtn.classList.toggle("change");
}

window.onclick = function (event) {
  if (!event.target.matches(".dropbtn") && !event.target.matches(".bar")) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var dropbtns = document.getElementsByClassName("dropbtn");

    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
        dropbtns[i].classList.remove("change");
      }
    }
  }
};

// Interactive Fluid Animation
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let particleCount = getParticleCount();
let mouse = { x: null, y: null, radius: 100 };
let hue = 0;
let isScrolling = false;
let scrollTimeout;

function getParticleCount() {
  if (window.innerWidth <= 768) {
    return 25; // Slightly increased for mobile
  } else if (window.innerWidth <= 1024) {
    return 60; // Slightly increased for tablets
  } else {
    return 120; // Slightly increased for desktop
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 4 + 2; // Increased particle size
    this.speedX = Math.random() * 2 - 1; // Slightly faster
    this.speedY = Math.random() * 2 - 1; // Slightly faster
    this.color = `hsla(${hue}, 100%, 50%, 0.7)`; // Increased opacity
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > 0.2) this.size -= 0.05; // Slightly faster size reduction
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  particles = [];
}

function animate() {
  ctx.fillStyle = "rgba(224, 224, 224, 0.1)"; // Semi-transparent background
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  handleParticles();

  hue += 0.5; // Slower color change
  requestAnimationFrame(animate);
}

function handleParticles() {
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    for (let j = i; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        // Increased connection distance
        ctx.beginPath();
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = particles[i].size / 8; // Slightly thicker lines
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }

    if (particles[i].size <= 0.3) {
      particles.splice(i, 1);
      i--;
    }
  }
}

function createParticles() {
  if (mouse.x !== null && mouse.y !== null && !isScrolling) {
    for (let i = 0; i < 3; i++) {
      // Create three particles at a time
      particles.push(new Particle(mouse.x, mouse.y));
    }
  }
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const throttledCreateParticles = throttle(createParticles, 50);

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  throttledCreateParticles();
});

window.addEventListener(
  "touchstart",
  function (event) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    throttledCreateParticles();
  },
  { passive: true }
);

window.addEventListener(
  "touchmove",
  function (event) {
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    throttledCreateParticles();
  },
  { passive: true }
);

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = getParticleCount();
});

window.addEventListener("scroll", function () {
  isScrolling = true;
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(function () {
    isScrolling = false;
  }, 100);
});

init();
animate();
