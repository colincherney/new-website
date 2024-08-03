// Dropdown functionality
function toggleDropdown() {
  var dropdown = document.getElementById("myDropdown");
  dropdown.classList.toggle("show");

  var dropbtn = document.querySelector(".dropbtn");
  dropbtn.classList.toggle("change");

  if (dropdown.classList.contains("show")) {
    const buttons = dropdown.querySelectorAll("button");
    buttons.forEach((button, index) => {
      setTimeout(() => {
        button.style.transform = "translateY(0)";
        button.style.opacity = "1";
      }, 100 * index);
    });
  } else {
    const buttons = dropdown.querySelectorAll("button");
    buttons.forEach((button) => {
      button.style.transform = "translateY(20px)";
      button.style.opacity = "0";
    });
  }
}

function resetMenuItems() {
  const dropdown = document.getElementById("myDropdown");
  const buttons = dropdown.querySelectorAll("button");
  buttons.forEach((button) => {
    button.style.transform = "translateY(20px)";
    button.style.opacity = "0";
  });
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
        resetMenuItems();
      }
    }
  }
};

// Content switching functionality
let isNameVisible = true;
let isTransitioning = false;
let scrollIndicator;

function switchContent(toName) {
  if (isTransitioning) return;
  if (toName === isNameVisible) return;

  isTransitioning = true;

  var content = document.getElementById("content");
  var name = document.getElementById("name");
  var timeline = document.getElementById("timeline");

  if (toName) {
    window.removeEventListener("scroll", animateTimelineItems);
    content.style.justifyContent = "center";
    timeline.style.opacity = "0";
    setTimeout(() => {
      timeline.classList.add("hidden");
      name.classList.remove("hidden");
      name.style.display = "block";
      scrollIndicator.style.display = "block";
      setTimeout(() => {
        name.style.opacity = "1";
        scrollIndicator.style.opacity = "1";
        isTransitioning = false;
        isNameVisible = true;
      }, 50);
    }, 500);
  } else {
    content.style.justifyContent = "flex-start";
    name.style.opacity = "0";
    scrollIndicator.style.opacity = "0";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setTimeout(() => {
      name.classList.add("hidden");
      scrollIndicator.style.display = "none";
      timeline.classList.remove("hidden");
      timeline.style.display = "block";
      setTimeout(() => {
        timeline.style.opacity = "1";
        isTransitioning = false;
        isNameVisible = false;

        // Animate timeline items
        animateTimelineItems();
        // Add event listener for scroll
        window.addEventListener("scroll", animateTimelineItems);
      }, 50);
    }, 500);
  }
}

function scrollDown() {
  if (isNameVisible && !isTransitioning) {
    switchContent(false);
  }
}

function animateTimelineItems() {
  const timelineItems = document.querySelectorAll(".timeline-item");
  const triggerBottom = window.innerHeight * 0.8;

  timelineItems.forEach((item) => {
    const itemTop = item.getBoundingClientRect().top;

    if (itemTop < triggerBottom) {
      item.classList.add("animate");
    } else {
      item.classList.remove("animate");
    }
  });
}

// Scroll event listeners
window.addEventListener(
  "wheel",
  function (event) {
    event.preventDefault();
    if (event.deltaY > 0) {
      switchContent(false);
    } else {
      switchContent(true);
    }
  },
  { passive: false }
);

let touchStartY = 0;
let touchEndY = 0;

window.addEventListener(
  "touchstart",
  function (e) {
    touchStartY = e.touches[0].clientY;
  },
  { passive: false }
);

window.addEventListener(
  "touchmove",
  function (e) {
    e.preventDefault();
    touchEndY = e.touches[0].clientY;
    if (touchStartY > touchEndY + 5) {
      switchContent(false);
    } else if (touchStartY < touchEndY - 5) {
      switchContent(true);
    }
  },
  { passive: false }
);

window.addEventListener(
  "scroll",
  function (e) {
    e.preventDefault();
    window.scrollTo(0, 0);
  },
  { passive: false }
);

// Simulate scroll up effect
function simulateScrollUp() {
  let scrollDuration = 1000;
  let scrollStep = -window.scrollY / (scrollDuration / 15);

  function scrollAnimation() {
    if (window.scrollY !== 0) {
      window.scrollBy(0, scrollStep);
      requestAnimationFrame(scrollAnimation);
    } else {
      switchContent(true);
    }
  }

  requestAnimationFrame(scrollAnimation);
}

// Initialize page
window.addEventListener("load", (event) => {
  var content = document.getElementById("content");
  content.style.justifyContent = "center";

  scrollIndicator = document.getElementById("scroll-indicator");
  scrollIndicator.style.opacity = "1";

  window.scrollTo(0, document.body.scrollHeight);

  setTimeout(() => {
    simulateScrollUp();
  }, 100);

  // Initialize new features
  handleParallax();
  const nameElement = document.getElementById("name");
  typeWriter(nameElement, nameElement.textContent);
});

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
    // Mobile devices
    return 50;
  } else if (window.innerWidth <= 1024) {
    // Tablets
    return 100;
  } else {
    // Larger screens
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

// New functions for added features

// Parallax Effect
function handleParallax() {
  const parallaxElements = document.querySelectorAll(".parallax");
  window.addEventListener("scroll", () => {
    let scrollY = window.pageYOffset;
    parallaxElements.forEach((el) => {
      const speed = el.dataset.speed || 0.5;
      el.style.transform = `translateY(${scrollY * speed}px)`;
    });
  });

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
      const tiltX = event.beta;
      const tiltY = event.gamma;
      parallaxElements.forEach((el) => {
        const speed = el.dataset.speed || 0.5;
        el.style.transform = `translate(${tiltY * speed}px, ${
          tiltX * speed
        }px)`;
      });
    });
  }
}

// Typing Effect
function typeWriter(element, text, speed = 100) {
  element.textContent = ""; // Clear existing text
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// Blue Quantum Entanglement Network Cursor with Enhanced Visibility
const entanglementCanvas = document.getElementById("quantum-cursor");
const entanglementCtx = entanglementCanvas.getContext("2d");

let canvasWidth = (entanglementCanvas.width = window.innerWidth);
let canvasHeight = (entanglementCanvas.height = window.innerHeight);

let entanglementCursorX = canvasWidth / 2;
let entanglementCursorY = canvasHeight / 2;

// Blue-centric color palette
const colorPalette = [
  "rgba(52, 152, 219, 0.8)", // Light blue
  "rgba(41, 128, 185, 0.8)", // Medium blue
  "rgba(27, 79, 114, 0.8)", // Dark blue
  "rgba(93, 173, 226, 0.8)", // Sky blue
  "rgba(52, 73, 94, 0.8)", // Blue-gray
];

const cursorColor = "rgba(255, 255, 255, 1)"; // Solid white for better visibility
const cursorGlowColor = "rgba(255, 255, 255, 0.5)"; // White glow

let isHovering = false;
let pulseSize = 0;

class EntangledParticle {
  constructor() {
    this.posX = Math.random() * canvasWidth;
    this.posY = Math.random() * canvasHeight;
    this.radius = Math.random() * 3 + 2;
    this.baseRadius = this.radius;
    this.velocity = Math.random() * 0.7 + 0.3;
    this.direction = Math.random() * Math.PI * 2;
    this.isEntangled = false;
    this.particleColor =
      colorPalette[Math.floor(Math.random() * colorPalette.length)];
  }

  updatePosition() {
    this.posX += Math.cos(this.direction) * this.velocity;
    this.posY += Math.sin(this.direction) * this.velocity;

    if (this.posX < 0 || this.posX > canvasWidth)
      this.direction = Math.PI - this.direction;
    if (this.posY < 0 || this.posY > canvasHeight)
      this.direction = -this.direction;

    const deltaX = this.posX - entanglementCursorX;
    const deltaY = this.posY - entanglementCursorY;
    const distanceToCursor = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distanceToCursor < 180) {
      this.isEntangled = true;
      this.radius = this.baseRadius * (1 + (180 - distanceToCursor) / 180);
      if (isHovering) {
        this.radius *= 1.5; // Increase size when hovering
      }
    } else {
      this.isEntangled = false;
      this.radius = this.baseRadius;
    }
  }

  render() {
    entanglementCtx.beginPath();
    entanglementCtx.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2);
    entanglementCtx.fillStyle = this.particleColor;
    entanglementCtx.fill();
  }
}

const entangledParticles = Array(60)
  .fill()
  .map(() => new EntangledParticle());

function renderEntanglements() {
  entangledParticles.forEach((particle) => {
    if (particle.isEntangled) {
      entanglementCtx.beginPath();
      entanglementCtx.moveTo(particle.posX, particle.posY);
      entanglementCtx.lineTo(entanglementCursorX, entanglementCursorY);
      entanglementCtx.strokeStyle = particle.particleColor.replace(
        "0.8",
        "0.3"
      );
      entanglementCtx.lineWidth = 1.5;
      entanglementCtx.stroke();
    }
  });
}

function animateEntanglementCursor() {
  entanglementCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  entangledParticles.forEach((particle) => {
    particle.updatePosition();
    particle.render();
  });

  renderEntanglements();

  // Draw enhanced cursor
  // Outer glow
  entanglementCtx.beginPath();
  entanglementCtx.arc(
    entanglementCursorX,
    entanglementCursorY,
    12,
    0,
    Math.PI * 2
  );
  const gradient = entanglementCtx.createRadialGradient(
    entanglementCursorX,
    entanglementCursorY,
    6,
    entanglementCursorX,
    entanglementCursorY,
    12
  );
  gradient.addColorStop(0, cursorGlowColor);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
  entanglementCtx.fillStyle = gradient;
  entanglementCtx.fill();

  // Inner cursor
  entanglementCtx.beginPath();
  entanglementCtx.arc(
    entanglementCursorX,
    entanglementCursorY,
    8,
    0,
    Math.PI * 2
  );
  entanglementCtx.fillStyle = cursorColor;
  entanglementCtx.fill();

  // Draw hover effect
  if (isHovering) {
    entanglementCtx.beginPath();
    entanglementCtx.arc(
      entanglementCursorX,
      entanglementCursorY,
      pulseSize,
      0,
      Math.PI * 2
    );
    entanglementCtx.strokeStyle = cursorGlowColor;
    entanglementCtx.lineWidth = 3;
    entanglementCtx.stroke();

    pulseSize += 1;
    if (pulseSize > 40) pulseSize = 0;
  }

  requestAnimationFrame(animateEntanglementCursor);
}

function updateEntanglementCursor(e) {
  entanglementCursorX = e.clientX;
  entanglementCursorY = e.clientY;
}

function handleEntanglementResize() {
  canvasWidth = entanglementCanvas.width = window.innerWidth;
  canvasHeight = entanglementCanvas.height = window.innerHeight;
}

const isEntanglementTouchDevice =
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

if (!isEntanglementTouchDevice) {
  document.addEventListener("mousemove", updateEntanglementCursor);
  window.addEventListener("resize", handleEntanglementResize);
  animateEntanglementCursor();

  // Interaction with elements
  const entanglementInteractiveElements = document.querySelectorAll(
    "a, button, .dropdown, #scroll-indicator"
  );

  entanglementInteractiveElements.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      isHovering = true;
      entangledParticles.forEach((particle) => {
        particle.velocity *= 1.5;
      });
    });

    el.addEventListener("mouseleave", () => {
      isHovering = false;
      pulseSize = 0;
      entangledParticles.forEach((particle) => {
        particle.velocity /= 1.5;
      });
    });
  });
}
