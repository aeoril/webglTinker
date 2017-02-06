function tinyThrottle (render) {

  'use strict';

  var self = tinyThrottle;

  if ("_ID" in self) {
    throw new Error('Only call tinyThrottle once.  Works with 1 function only');
  }

  self._ID = null;

  return function () {
    if (self._ID === null) {
      self._ID = window.requestAnimationFrame(function () {
        render();
        self._ID = null;
      });
    }
  };
}
