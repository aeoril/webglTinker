/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, options ) {

  'use strict';

  // eliminate side effects and external interference
  options = simpleCopy(options);

  options.ms = options.MSPerTick || 0;
  options.repeat = options.repeat || false;

  return ( function () {

    var ID = null;

    function innerAnimateRAFed( optionsUpdates ) {

      var prevTimestamp;

      if ( optionsUpdates ) {

        Object.keys( optionsUpdates ).forEach( function( key ) {

          if ( !( key in options ) ) {

            throw new RangeError( key + ' is not a valid option' );

          }

          if ( optionsUpdates[ key ] === 'toggle' ) {

            options[ key ] = options[ key ] === Infinity ? 0 : Infinity;

          } else {

            options[key] = optionsUpdates[key];

          }
        });
      }

      if ( ID ) {

        window.cancelAnimationFrame(ID);

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        var outOptions = {};

        outOptions.render = false;

        outOptions.timeDelta = timestamp - ( prevTimestamp || timestamp );

        prevTimestamp = timestamp;

        outOptions.ticks = parseInt( outOptions.timeDelta / options.ms, 10 );

        Object.keys( options ).forEach( function ( key ) {

          if ( key === 'repeat' || key === 'ms' ) {

            return;

          }

          outOptions[ key ] = !!options[ key ];

          if ( outOptions[ key ] ) {

            outOptions.render = true;

          }

          if ( options [ key ] > 0 ) {

            options[ key ] -= options.ticks;

          }
        });

        animate( outOptions );

        if ( options.repeat ) {

          ID = window.requestAnimationFrame( rAFCallee );

        } else {

          ID = null;

        }
      } );

      return simpleCopy( options );

    }

    return innerAnimateRAFed;

  }() );
}
