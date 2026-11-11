// Inside src/js/orb.js (Canvas orb initialization):

function getInitialOrbPosition() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // Align orb center to 70% of screen width on initial load (right side framing)
  return {
    x: width > 900 ? width * 0.70 : width * 0.50,
    y: height * 0.45
  };
}

// Set initial orb target coordinates:
const initialPos = getInitialOrbPosition();
orbTargetX = initialPos.x;
orbCurrentX = initialPos.x;
orbTargetY = initialPos.y;
orbCurrentY = initialPos.y;