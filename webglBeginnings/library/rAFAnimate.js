function rAFAnimate (animate, continuous) {
  'use strict';

  var self = rAFAnimate;

  if ('_ID' in self) {
    throw new Error('Only call rAFAnimate once.  Works with 1 function only');
  }

  self._ID = null;

  function innerAnimateRAFed() {
    if (self._ID === null) {
      self._ID = window.requestAnimationFrame(function rAFCallee(timestamp) {
        self._ID = null;
        animate(timestamp);
        if (innerAnimateRAFed.continuous) {
          self._ID = window.requestAnimationFrame(rAFCallee);
        }
      });
    }
  }
  
  innerAnimateRAFed.continuous = continuous;

  return innerAnimateRAFed;
}
