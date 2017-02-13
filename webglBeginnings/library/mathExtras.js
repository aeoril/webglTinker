var mathExtras = (function () {
  'use strict';

  return {
    randomInt: function (min, max) {
      if (arguments.length === 1) {
        max = Math.floor(min) - 1;
        min = 0;
      } else {
        min = Math.ceil(min);
        max = Math.floor(max);
      }
      return Math.floor(Math.random() * (max - min + 1) - min);
    },
  };
}());
