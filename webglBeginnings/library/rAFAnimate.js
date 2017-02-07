function rAFAnimate (animate, continuous) {
  'use strict';

  return (function () {

    var ID = null;

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

  }());
}
