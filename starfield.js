// Star Wars Hyperspace Starfield
// Get canvas and context
const canvas = document.getElementById('starfield');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Hyperspace configuration
const config = {
    numStars: 500,
    speed: 8,
    baseSpeed: 8, // Store the base speed for hyperdrive
    hyperdriveMultiplier: 3.5, // Speed multiplier during hyperdrive
    maxSpeed: 40,
    acceleration: 0.05,
    centerX: canvas.width / 2,
    centerY: canvas.height / 2,
    trailLength: 150,
    baseTrailLength: 150, // Store base trail length
    spawnRadius: 80
};

// Hyperdrive state
let hyperdriveActive = false;

// Star class for individual particles
class Star {
    constructor() {
        this.reset();
    }

    reset() {
        // Random angle from center
        this.angle = Math.random() * Math.PI * 2;

        // Random distance from center - start in a ring (use spawn radius from config)
        this.distance = config.spawnRadius + Math.random() * 50;

        // Calculate position based on polar coordinates
        this.x = config.centerX + Math.cos(this.angle) * this.distance;
        this.y = config.centerY + Math.sin(this.angle) * this.distance;

        // Individual speed multiplier for variation
        this.speedMultiplier = 0.5 + Math.random() * 0.5;

        // Much smaller particle size
        this.size = 0.5 + Math.random() * 0.5;

        // Color variation (blue-white spectrum like hyperspace)
        this.colorVariation = Math.random();

        // Trail history for smooth long streaks
        this.trailPoints = [];
    }

    update() {
        // Add current position to trail history
        this.trailPoints.push({ x: this.x, y: this.y });

        // Limit trail length for performance
        if (this.trailPoints.length > 20) {
            this.trailPoints.shift();
        }

        // Accelerate outward from center
        this.distance += config.speed * this.speedMultiplier;

        // Update position
        this.x = config.centerX + Math.cos(this.angle) * this.distance;
        this.y = config.centerY + Math.sin(this.angle) * this.distance;

        // Reset if star goes off screen
        const margin = 100;
        if (this.x < -margin || this.x > canvas.width + margin ||
            this.y < -margin || this.y > canvas.height + margin) {
            this.reset();
        }
    }

    draw() {
        // Color gradient from blue to white based on variation
        let r, g, b;
        if (this.colorVariation < 0.3) {
            // Blue-white stars
            r = 150 + Math.floor(this.colorVariation * 350);
            g = 180 + Math.floor(this.colorVariation * 250);
            b = 255;
        } else if (this.colorVariation < 0.7) {
            // Pure white stars
            r = g = b = 255;
        } else {
            // Slight cyan tint
            r = 200;
            g = 230;
            b = 255;
        }

        // Calculate opacity based on distance (fade in effect)
        const opacity = Math.min(this.distance / 100, 1);

        // Draw long solid trail from center
        if (this.distance > 10) {
            // Calculate trail start position (much further back for long streaks)
            // But keep it outside the center hole (minimum spawn radius from center)
            const trailDistance = Math.max(config.spawnRadius, this.distance - config.trailLength);
            const trailStartX = config.centerX + Math.cos(this.angle) * trailDistance;
            const trailStartY = config.centerY + Math.sin(this.angle) * trailDistance;

            // Draw solid trail line
            ctx.beginPath();
            ctx.moveTo(trailStartX, trailStartY);
            ctx.lineTo(this.x, this.y);

            // Create gradient along the entire trail
            const gradient = ctx.createLinearGradient(
                trailStartX, trailStartY,
                this.x, this.y
            );
            gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);
            gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, ${opacity})`);

            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Draw bright point at the head
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.fill();
        }
    }
}

// Create star array
const stars = [];
for (let i = 0; i < config.numStars; i++) {
    stars.push(new Star());
}

// Animation loop
function animate() {
    // Clear the canvas completely for crisp trails
    ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw each star
    stars.forEach(star => {
        star.update();
        star.draw();
    });

    requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    config.centerX = canvas.width / 2;
    config.centerY = canvas.height / 2;
});

// Start animation
animate();

// Control panel event listeners
document.getElementById('trailLength').addEventListener('input', (e) => {
    config.baseTrailLength = parseInt(e.target.value);
    config.trailLength = parseInt(e.target.value);
    document.getElementById('trailLengthValue').textContent = e.target.value;
});

document.getElementById('starCount').addEventListener('input', (e) => {
    const newCount = parseInt(e.target.value);
    document.getElementById('starCountValue').textContent = e.target.value;

    // Add or remove stars to match the new count
    if (newCount > stars.length) {
        // Add stars
        for (let i = stars.length; i < newCount; i++) {
            stars.push(new Star());
        }
    } else {
        // Remove stars
        stars.length = newCount;
    }
    config.numStars = newCount;
});

document.getElementById('starSpeed').addEventListener('input', (e) => {
    config.baseSpeed = parseInt(e.target.value);
    if (!hyperdriveActive) {
        config.speed = parseInt(e.target.value);
    }
    document.getElementById('starSpeedValue').textContent = e.target.value;
});

document.getElementById('spawnRadius').addEventListener('input', (e) => {
    config.spawnRadius = parseInt(e.target.value);
    document.getElementById('spawnRadiusValue').textContent = e.target.value;
});

// Toggle button functionality
const toggleButton = document.getElementById('toggleButton');
const controlsPanel = document.getElementById('controls');
let controlsVisible = true;

toggleButton.addEventListener('click', () => {
    controlsVisible = !controlsVisible;

    if (controlsVisible) {
        controlsPanel.classList.remove('hidden');
        toggleButton.classList.add('shifted');
        toggleButton.textContent = 'Hide Controls';
    } else {
        controlsPanel.classList.add('hidden');
        toggleButton.classList.remove('shifted');
        toggleButton.textContent = 'Show Controls';
    }
});

// Hyperdrive controls - spacebar activation
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !hyperdriveActive) {
        e.preventDefault(); // Prevent page scroll
        hyperdriveActive = true;
        config.speed = config.baseSpeed * config.hyperdriveMultiplier;
        config.trailLength = config.baseTrailLength * 1.5; // Longer trails during hyperdrive
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space' && hyperdriveActive) {
        e.preventDefault();
        hyperdriveActive = false;
        config.speed = config.baseSpeed;
        config.trailLength = config.baseTrailLength;
    }
});
