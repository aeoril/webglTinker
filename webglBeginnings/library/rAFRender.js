function rAFRender (render, continuous) {

  'use strict';

  var self = rAFRender;

  if ('_ID' in self) {
    throw new Error('Only call rAFRender once.  Works with 1 function only');
  }

  self._ID = null;

  function innerRenderRAFed() {
    if (self._ID === null) {
      self._ID = window.requestAnimationFrame(function rAFCallee(timestamp) {
        self._ID = null;
        render(timestamp);
        if (innerRenderRAFed.continuous) {
          self._ID = window.requestAnimationFrame(rAFCallee);
        }
      });
    }
  }
  
  innerRenderRAFed.continuous = continuous;

  return innerRenderRAFed;
}
