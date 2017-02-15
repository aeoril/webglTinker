var mathExtras = (function () {
  'use strict';

  return {

    // Random integer from 0 to numInts - 1, inclusive
    // numInts may be negative - gives numInts + 1 to 0, inclusive
    randInt: function (numInts) {

      return Math.trunc(Math.random() * Math.trunc(numInts));

    },

    // min must be less than max. min or min and max may be negative. Inclusive
    randIntInc: function (min, max) {

      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;

    },

    // min must be less than max. min or min and max may be negative. Exclusive
    randIntExc: function (min, max) {

      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min)) + min;

    }
  };
}());
