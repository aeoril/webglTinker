/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, options ) {

  'use strict';

  // eliminate side effects and external interference
  options = simpleCopy(options);

  options.repeat = options.repeat || 0;
  options.render = options.render || 0;
  options.ms = options.ms || 0;

  return ( function () {

    var ID = null;

    function innerAnimateRAFed( optionsUpdates ) {

      Object.keys( optionsUpdates ).forEach( function( key ) {

        if ( key in options ) {

          options[key] = optionsUpdates[key];

        } else {

          throw new RangeError( key + ' is not a valid option' );

        }
      });

      if ( ID ) {

        window.cancelAnimationFrame(ID);

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        var outOptions = Object.keys( options ).reduce( function ( obj, key ) {

          if ( key === 'ms' || ( typeof options[ key ] !== 'number' ) ) {

            obj[key] = simpleCopy( options[key] );

            return obj;

          }

          obj[key] = !!options[key];

          if ( options[key] > 0 ) {

            options[key]--;

          }

          return obj;

        }, {});

        animate( timestamp, outOptions );

        if ( options.repeat ) {

          ID = window.requestAnimationFrame( rAFCallee );

        } else {

          ID = null;

        }
      } );
    }

    return innerAnimateRAFed;

  }() );
}
