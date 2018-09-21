// Search

export default function searchClear(inputSelector, clearSelector) {
  const inputElem = document.querySelector(inputSelector);
  const clearElem = document.querySelector(clearSelector);
  inputElem.addEventListener('keyup', (event) => {
    event.preventDefault();
    if (event.currentTarget.value.length > 0) {
      clearElem.classList.remove('hide');
    } else {
      clearElem.classList.add('hide');
    }
  });

  // Clear text and hide button.
  clearElem.addEventListener('click', (event) => {
    event.preventDefault();
    event.currentTarget.classList.add('hide');
    inputElem.value = '';
  });
}
