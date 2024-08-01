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

function getParticleCount() {
  if (window.innerWidth <= 768) {
    return 50;
  } else if (window.innerWidth <= 1024) {
    return 100;
  } else {
    return 150;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.size > 0.2) this.size -= 0.1;
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
  ctx.fillStyle = "rgba(0, 0, 0, 0.02)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  handleParticles();

  hue += 2;
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
        ctx.beginPath();
        ctx.strokeStyle = particles[i].color;
        ctx.lineWidth = particles[i].size / 10;
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
  if (mouse.x !== null && mouse.y !== null) {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(mouse.x, mouse.y));
    }
  }
}

window.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  createParticles();
});

window.addEventListener(
  "touchmove",
  function (event) {
    event.preventDefault();
    mouse.x = event.touches[0].clientX;
    mouse.y = event.touches[0].clientY;
    createParticles();
  },
  { passive: false }
);

window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particleCount = getParticleCount();
});

init();
animate();
