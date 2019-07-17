/**
 * @author Xitalogy | https://www.xitalogy.com
 * Copyright © 2019 by Xitalogy.  MIT License. http://opensource.org/licenses/MIT
 */

var mathExtras = ( function () {

  'use strict';

  var self = {

    // Random integer from 0 to numInts - 1, inclusive
    // numInts may be negative - gives numInts + 1 to 0, inclusive
    randInt: function ( numInts ) {

      return Math.trunc( Math.random() * Math.trunc( numInts ) );

    },

    // min must be less than max. min or min and max may be negative. Inclusive
    randIntInc: function ( min, max ) {

      min = Math.ceil( min );
      max = Math.floor( max );

      return Math.floor( Math.random() * ( max - min + 1 ) ) + min;

    },

    // min must be less than max. min or min and max may be negative.
    // Inclusive on min, exclusive on max
    randIntExc: function ( min, max ) {

      min = Math.ceil( min );
      max = Math.floor( max );

      return Math.floor( Math.random() * ( max - min ) ) + min;

    },

    repeat: function ( fun1, fun2, count /*, ... */ ) {

      var total = 0;

      var args = [ ].slice.call( arguments, 3 );

      for ( var ii = 0; ii < count; ii++ ) {

        total = fun1( fun2, total, args );

      }

      return total;

    },

    clamp:  function ( val, min, max ) {

      if ( typeof min === 'string' ) {
        min = parseFloat( min );
      }

      if ( typeof max === 'string' ) {
        max = parseFloat( max );
      }

      if ( val < min ) {

        val = min;

      } else if ( val > max ) {

        val = max;

      }

      return val;

    },

    clampWrap:  function ( val, min, max ) {

      if ( typeof min === 'string' ) {
        min = parseFloat( min );
      }

      if ( typeof max === 'string' ) {
        max = parseFloat( max );
      }

      if ( val < min ) {

        val = min;

        return val;

      }

      while ( val > max ) {

        val -= ( max - min );

      }

      return val;

    }
  };

  self.repeatAdd = self.repeat.bind( null, function ( fun, left, args ) {

    return left + fun.apply( null, args );

  });

  self.repeatSub = self.repeat.bind( null, function ( fun, left, args ) {

    return left - fun.apply( null, args );

  });

  self.repeatMul = self.repeat.bind( null, function ( fun, left, args ) {

    return left * fun.apply( null, args );

  });

  self.repeatDiv = self.repeat.bind( null, function ( fun, left, args ) {

    if ( left === 0 ) {

      left = 1;

    }

    return left / fun.apply( null, args );

  });

  return self;

}() );
