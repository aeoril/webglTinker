/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, options ) {

  'use strict';

  var prevTimestamp;
  var ticksLeftovers = 0;

  // eliminate side effects and external interference
  options = simpleCopy(options);

  options.ms = options.ms || 0;
  options.repeat = options.repeat || false;

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

            options[key] = optionsUpdates[key];

          }
        });
      }

      if ( ID ) {

        window.cancelAnimationFrame(ID);

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        var outOptions = {};
        var temp;

        outOptions.render = false;

        outOptions.deltaTime = timestamp - ( prevTimestamp || timestamp );

        prevTimestamp = timestamp;

        if ( outOptions.deltaTime === 0 ) {

          outOptions.ticks = 0;

        } else {

          temp = outOptions.deltaTime + ticksLeftovers;

          outOptions.ticks = Math.trunc( temp / options.ms );

          ticksLeftovers = temp - outOptions.ticks * options.ms;

        }

        Object.keys( options ).forEach( function ( key ) {

          if ( key === 'repeat' || key === 'ms' ) {

            return;

          }

          if ( options[ key ] === 'immediate' ) {

            options[ key ] = 0;

            outOptions [ key ] = true;

            outOptions.render = true;

            return;

          }

          outOptions[ key ] = !!options[ key ];

          if ( outOptions[ key ] ) {

            outOptions.render = true;

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

  }() );
}
