var mathExtras = (function () {
  'use strict';

  return {

    // Random integer from 0 to numInts - 1
    // numInts may be negative - gives slots + 1 to 0
    randInt: function (numInts) {

      return Math.trunc(Math.random() * Math.trunc(numInts));

    },

    // min must be less than max, but min, max or both may be negative
    randIntMM: function (min, max) {

      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min + 1)) + min;

    }
  };
}());
