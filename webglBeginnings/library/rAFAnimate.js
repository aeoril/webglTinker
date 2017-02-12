function rAFAnimate (animate, continuous) {
  'use strict';

  return (function () {

    var ID = null;

    function innerAnimateRAFed(evt, options) {
      if (!options) {
        options = {};
      }
      if (ID === null) {
        ID = window.requestAnimationFrame(function rAFCallee(timestamp) {
          ID = null;
          animate(timestamp, evt, options);
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
