// @author aeoril | https://www.ic3dimensions.com
// Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md

function rAFAnimate ( animate, options ) {

  'use strict';

  var startTime = -1;
  var prevTimestamp;
  var ticksLeftovers;

  // eliminate side effects and external interference
  options = simpleCopy(options);

  options.msPerTick = options.msPerTick || 1.0 / 60.0;
  options.run = options.run || 0;

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

      if ( ID !== null ) {

        window.cancelAnimationFrame(ID);

        ID = null;

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        var outOptions = { };
        var temp;

        outOptions.render = options.render;
        options.render = false;

        if ( startTime < 0 ) {

          startTime = timestamp;
          prevTimestamp = timestamp;
          ticksLeftovers = 0;

        }

        outOptions.startTime = startTime;
        outOptions.timestamp = timestamp;
        outOptions.deltaTime = timestamp - prevTimestamp;

        prevTimestamp = timestamp;

        temp = outOptions.deltaTime + ticksLeftovers;
        outOptions.ticks = Math.trunc( temp / options.msPerTick );
        ticksLeftovers = temp - outOptions.ticks * options.msPerTick;

        Object.keys( options ).forEach( function ( key ) {

          if ( key === 'msPerTick' || key === 'render' ) {

            return;

          }

          outOptions[ key ] = !!options[ key ];

          if ( key !== 'run' && outOptions[ key ] ) {

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

        if ( outOptions.run ) {

          animate( outOptions );

        }

        if ( options.run ) {

          ID = window.requestAnimationFrame( rAFCallee );

        } else {

          ID = null;

          startTime = -1;

        }
      } );

      return simpleCopy( options );

    }

    return innerAnimateRAFed;

  }( ) );
}
