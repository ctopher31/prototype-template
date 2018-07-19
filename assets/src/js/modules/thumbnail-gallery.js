// Thumbnail Gallery
const setupGallery = () => {
  const controls = document.querySelectorAll('.thumbnail-control');
  let thumbToggles = document.querySelectorAll('.thumbnail-item');
  let thumbs = document.querySelectorAll('.display-thumbnail');
  const leftButton = document.querySelector('.thumbnail-container .left');
  const rightButton = document.querySelector('.thumbnail-container .right');
  if (thumbs[0].previousElementSibling !== null) {
    leftButton.classList.remove('hide');
  } else {
    leftButton.classList.add('hide');
  }
  if (thumbs[2] && thumbs[2].nextElementSibling !== null) {
    rightButton.classList.remove('hide');
  } else {
    rightButton.classList.add('hide');
  }

  Array.prototype.map.call(controls, control => control.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (control.classList.contains('left') && thumbs[0].previousElementSibling !== null) {
      thumbs[0].previousElementSibling.classList.add('display-thumbnail');
      thumbs[2].classList.remove('display-thumbnail');
      thumbs = document.querySelectorAll('.display-thumbnail');
      if (thumbs[0].previousElementSibling === null) {
        leftButton.classList.add('hide');
      } else {
        leftButton.classList.remove('hide');
      }
      if (thumbs[2].nextElementSibling === null) {
        rightButton.classList.add('hide');
      } else {
        rightButton.classList.remove('hide');
      }
    } else if (control.classList.contains('right') && thumbs[2].nextElementSibling !== null) {
      thumbs[0].classList.remove('display-thumbnail');
      thumbs[2].nextElementSibling.classList.add('display-thumbnail');
      thumbs = document.querySelectorAll('.display-thumbnail');
      if (thumbs[0].previousElementSibling === null) {
        leftButton.classList.add('hide');
      } else {
        leftButton.classList.remove('hide');
      }
      if (thumbs[2].nextElementSibling === null) {
        rightButton.classList.add('hide');
      } else {
        rightButton.classList.remove('hide');
      }
    } else {
      return false;
    }
    return false;
  }));

  Array.prototype.map.call(thumbToggles, thumbToggle => thumbToggle.addEventListener('click', () => {
    thumbToggles = document.querySelectorAll('.thumbnail-item');
    Array.prototype.map.call(thumbToggles, (item) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active');
      }
    });
    thumbToggle.classList.add('active');
  }));
};

export default {
  setupGallery,
};
