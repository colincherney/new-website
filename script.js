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

        const items = document.querySelectorAll(".timeline-item");
        items.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add("show");
          }, index * 200);
        });
      }, 50);
    }, 500);
  }
}

function scrollDown() {
  if (isNameVisible && !isTransitioning) {
    switchContent(false);
  }
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
    let touchEndY = e.touches[0].clientY;
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
