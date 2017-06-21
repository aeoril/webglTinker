// @author aeoril | https://www.ic3dimensions.com
// Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md

function rAFAnimate ( animate, options ) {

  'use strict';

  // startTime < 0 resets time (these three variables - see below)
  var startTime = -1;
  var prevTimestamp;
  var ticksLeftovers;

  // eliminate side effects and external interference
  options = simpleCopy(options);

  // options parameter (an object) defines which options exist

  // Valid values for options (except msPerTick and render) are:
  //  - 0: do not execute this option in animate
  //  - Positive integer: execute this option for [integer] ticks
  //  - Infinity - execute this option forever, until changed using optionsUpdates
  //  - 'toggle' - toggle option between 0 and Infinity
  //  - 'immediate' - cause a 1-off execution of the option, even if run === 0

  // msPerTick is a float, indicating how many milliseconds for each tick

  // render is true or false.  It indicates whether to render the animation.
  // render can be explicity set to cause a render even if no options are active
  // otherwise, if any option is active it will automatically be set true

  // the following three always exist
  options.msPerTick = options.msPerTick || 1.0 / 60.0;
  options.run = options.run || 0;
  options.render = false;

  return ( function () {

    var id = null;

    // This function is returned.  It is normally saved to initiate running
    // the animate function via rAF, either with or without updating options
    function innerAnimateRAFed( optionsUpdates ) {

      var immediates = { };

      if ( optionsUpdates ) {

        if ( optionsUpdates.render ) {

          optionsUpdates.run = optionsUpdates.run || 'immediate';

        }

        Object.keys( optionsUpdates ).forEach( function( key ) {

          // Only default options or options explicitly set initially allowed
          if ( !( key in options ) ) {

            throw new RangeError( key + ' is not a valid option' );

          }

          if ( optionsUpdates[ key ] === 'toggle' ) {

            options[ key ] = options[ key ] === Infinity ? 0 : Infinity;

          } else if ( optionsUpdates [ key ] === 'immediate' ) {

            immediates[ key ] = options[ key ];
            options[ key ] = optionsUpdates[ key ];

          } else {

            options[ key ] = optionsUpdates[ key ];

          }
        });
      }

      if ( id !== null ) {

        window.cancelAnimationFrame(id);

        id = null;

      }

      id = window.requestAnimationFrame( function rAFCallee( timestamp ) {

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

          if ( options[ key ] === 'immediate' ) {

            options[ key ] = immediates[ key ];

            outOptions[ key ] = true;

            if ( outOptions.run !== 'immediate' ) {

              outOptions.run = !!options.run || 'immediate';

            }

          } else if ( outOptions[ key ] !== 'immediate' ) {

            outOptions[ key ] = !!options[ key ] && !!options.run;

          }

          if ( key !== 'run' && outOptions[ key ] ) {

            outOptions.render = true;

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

          id = window.requestAnimationFrame( rAFCallee );

        } else {

          id = null;

          // reset time
          startTime = -1;

        }
      } );

      return simpleCopy( options );

    }

    return innerAnimateRAFed;

  }( ) );
}
