function renderThrottle (render) {

  'use strict';

  var self = renderThrottle;

  if ('_ID' in self) {
    throw new Error('Only call renderThrottle once.  Works with 1 function only');
  }

  self._ID = null;

  return function (timestamp) {
    if (self._ID === null) {
      self._ID = window.requestAnimationFrame(function (timestamp) {
        render(timestamp);
        self._ID = null;
      });
    }
  };
}
