// Grid Builder
// Bootstrap Grid/Baseline Overlay
import _ from 'underscore';

/* eslint-disable function-paren-newline */
const gridTemplate = _.template(
  `<div class="show-grid baseline-8-black">
      <div class="container">
          <div class="row">
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
              <div class="span1 col-xs-1"></div>
          </div>
      </div>
  </div>`,
);
/* eslint-enable function-paren-newline */

const buildGrid = () => {
  const compiled = gridTemplate();
  const d = document.createElement('div');
  d.innerHTML = compiled;
  document.body.appendChild(d.firstChild);
};

const removeGrid = () => {
  const grid = document.querySelector('.show-grid');
  document.body.removeChild(grid);
};

const init = () => {
  window.buildGrid = buildGrid;
  window.removeGrid = removeGrid;
};

export default {
  buildGrid,
  removeGrid,
  init,
};
