# Star Wars Hyperspace Starfield

An interactive Star Wars-themed hyperspace particle system with TIE fighter cockpit overlay. Experience the classic hyperspace jump effect with long, streaking stars zooming past your viewport.

## Features

- **Realistic Hyperspace Effect**: Long, smooth particle trails that mimic the iconic Star Wars hyperspace jump
- **TIE Fighter Cockpit Overlay**: View the hyperspace through an authentic TIE fighter viewport
- **Hyperdrive Mode**: Press and hold SPACE to engage hyperdrive for extra speed
- **Interactive Controls**: Adjust parameters in real-time
  - Trail Length (50-300)
  - Star Count (100-1000)
  - Star Speed (1-20)
  - Spawn Radius (20-200)
- **Star Wars Themed UI**: News Cycle font and blue accent colors matching the Star Wars aesthetic
- **Responsive Design**: Adapts to any screen size

## Getting Started

Simply open `starfield.html` in any modern web browser.

### Controls

- **SPACE**: Hold to activate hyperdrive mode
- **Toggle Button**: Show/hide the control panel
- **Sliders**: Adjust starfield parameters in real-time

## Files

- `starfield.html` - Main HTML file with embedded CSS
- `starfield.js` - JavaScript particle system and animation logic
- `tiefighter.png` - TIE fighter cockpit overlay image
- `.gitignore` - Git ignore configuration

## Technical Details

The starfield uses HTML5 Canvas for rendering with:
- Radial particle spawning in a configurable ring
- Gradient-based trail rendering for smooth streaks
- Dynamic speed adjustment for hyperdrive effect
- Optimized animation loop with requestAnimationFrame

## Credits

Created for a coding class project with assistance from Claude Sonnet 4.5.

## License

This project is for educational purposes.
