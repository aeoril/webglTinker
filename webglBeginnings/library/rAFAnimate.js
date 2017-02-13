function rAFAnimate (animate, continuous) {
  'use strict';

  return (function () {

    var ID = null;

    function innerAnimateRAFed(evt, options) {
      if (!options) {
        if (!evt || evt instanceof Event) {
            options = {evt: evt};
        } else {
          options = evt;
          options.evt = undefined;
        }
      } else {
        options.evt = evt;
      }
      if (ID === null) {
        ID = window.requestAnimationFrame(function rAFCallee(timestamp) {
          ID = null;
          animate(timestamp, options);
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
