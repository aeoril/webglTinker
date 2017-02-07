var rAFAnimate = (function () {
  'use strict';

  var ID;

  return function (animate, continuous) {

    if (ID !== undefined) {
      throw new Error('Only call rAFAnimate once.  Works with 1 function only');
    }

    ID = null;

    function innerAnimateRAFed() {
      if (ID === null) {
        ID = window.requestAnimationFrame(function rAFCallee(timestamp) {
          ID = null;
          animate(timestamp);
          if (innerAnimateRAFed.continuous) {
            ID = window.requestAnimationFrame(rAFCallee);
          }
        });
      }
    }

    innerAnimateRAFed.continuous = continuous;

    return innerAnimateRAFed;
  };
}());
