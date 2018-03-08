// App
import GridBuilder from './modules/grid-builder';

// Grid Overlay for dev
GridBuilder.init();

// Drag framed Element
const vizImage = document.getElementById('viz-image');

const dragFramedElement = (elem) => {
  let startX = 0;
  let startY = 0;

  elem.addEventListener('dragstart', (event) => {
    startX = event.clientX;
    startY = event.clientY;
  });

  elem.addEventListener('drag', (event) => {
    event.preventDefault();
    if (event.clientX > 0 && event.clientY > 0) {
      elem.parentElement.scrollLeft += -(event.clientX - startX);
      elem.parentElement.scrollTop += -(event.clientY - startY);
      startX = event.clientX;
      startY = event.clientY;
    }
  });
};

dragFramedElement(vizImage);

// Zoom framed Element
const zoomFramedElement = (zoomedImage) => {
  const maxImageSize = 2400;
  const zoomSlider = document.getElementById('zoom-range-slider');
  const originalHeight = zoomedImage.style.height;
  let computedValue;
  zoomSlider.addEventListener('input', () => {
    if (parseFloat(zoomSlider.value) === 1) {
      zoomedImage.style.height = originalHeight;
      zoomedImage.parentElement.style.overflow = 'hidden';
      console.log('Zoom is 1', zoomedImage, zoomedImage.style.height);
    } else {
      computedValue = `${zoomedImage.parentElement.clientHeight * parseFloat(zoomSlider.value)}`;
      if (computedValue >= maxImageSize) {
        zoomedImage.style.height = '2400px';
        zoomedImage.parentElement.scrollLeft = `${(1200 - zoomedImage.parentElement.clientWidth) / 2}px`;
      } else {
        zoomedImage.style.height = `${computedValue}px`;
        zoomedImage.parentElement.scrollLeft = (computedValue - zoomedImage.parentElement.clientWidth) / 2;
      }
      zoomedImage.parentElement.style.overflow = 'auto';
      console.log('Zoomed', zoomedImage, zoomedImage.style.height, zoomedImage.parentElement, zoomedImage.parentElement.scrollLeft, zoomedImage.parentElement.clientWidth);
    }
  });
};

zoomFramedElement(vizImage);
