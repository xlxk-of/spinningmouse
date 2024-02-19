<!-- Calculate cursor position Starlight.Money -->

let circle = document.getElementById('home-hero-glow');

const onMouseMove = (e) => {
  // Calculate the center coordinates of the circle
  let centerX = e.pageX - (circle.offsetWidth / 2);
  let centerY = e.pageY - (circle.offsetHeight / 2);

  // Update the position of the circle based on the center coordinates
  circle.style.left = centerX + 'px';
  circle.style.top = centerY + 'px';
}

document.addEventListener('mousemove', onMouseMove);