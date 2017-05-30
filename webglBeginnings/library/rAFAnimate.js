/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, options ) {

  'use strict';

  var startTime = -1;
  var prevTimestamp;
  var ticksLeftovers = 0;

  // eliminate side effects and external interference
  options = simpleCopy(options);

  options.msPerTick = options.msPerTick || 1.0 / 60.0;
  options.repeat = options.repeat || false;
  options.render = false;

  return ( function () {

    var ID = null;

    function innerAnimateRAFed( optionsUpdates ) {

      if ( optionsUpdates ) {

        Object.keys( optionsUpdates ).forEach( function( key ) {

          if ( !( key in options ) ) {

            throw new RangeError( key + ' is not a valid option' );

          }

          if ( optionsUpdates[ key ] === 'toggle' ) {

            options[ key ] = options[ key ] === Infinity ? 0 : Infinity;

          } else {

            options[ key ] = optionsUpdates[ key ];

          }
        });
      }

      if ( ID ) {

        window.cancelAnimationFrame(ID);

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        var outOptions = {};
        var temp;

        outOptions.render = options.render;
        options.render = false;

        if ( startTime < 0 ) {

          startTime = timestamp;

        }

        outOptions.startTime = startTime;
        outOptions.timestamp = timestamp;
        outOptions.deltaTime = timestamp - ( prevTimestamp || timestamp );

        prevTimestamp = timestamp;

        if ( outOptions.deltaTime === 0 ) {

          outOptions.ticks = 0;

        } else {

          temp = outOptions.deltaTime + ticksLeftovers;

          outOptions.ticks = Math.trunc( temp / options.msPerTick );

          ticksLeftovers = temp - outOptions.ticks * options.msPerTick;

        }

        Object.keys( options ).forEach( function ( key ) {

          if ( key === 'repeat' || key === 'msPerTick' || key === 'render' ) {

            return;

          }

          outOptions[ key ] = !!options[ key ];

          if ( outOptions[ key ] ) {

            outOptions.render = true;

          }

          if ( options[ key ] === 'immediate' ) {

            options[ key ] = 0;

          }
          
          if ( options [ key ] > 0 ) {

            options[ key ] -= outOptions.ticks;

            if ( options[ key ] < 0 ) {

              options[ key ] = 0;

            }

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

  }( ) );
}
