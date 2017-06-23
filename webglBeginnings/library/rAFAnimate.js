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

  // options parameter (an object) defines which options exist.  options are
  // changed by calling the below returned function with optionsUpdates object.
  // options will cause the outOptions argument passed to animate() to be set
  // true to execute or false to not execute.  Timing values are also passed
  // to animate in outOptions.  All options can be changed, but no new options
  // added that were not initially passed in the instantiation call to rAFAnimate()

  // Valid values for options (except msPerTick and render) are:
  //  - 0: do not execute this option in animate
  //  - Positive integer: execute this option for [integer] ticks
  //  - Infinity - execute this option forever, until changed using optionsUpdates
  //  - 'immediate' - cause a 1-off execution of the option, even if run === 0
  //    if run is 0 and any immediate options are passed, all other options will
  //    be temporarily turned off, run set to "immediate" and animate called

  // if optionsUpdates passes 'toggle' for an option, it will toggle the option
  // between 0 and Infinity

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

      // immediates stores existing values of options which have been set to
      // 'immediate' so they can be restored and processed as if the 'immediate'
      // was never passed.  'immediate' in optionsUpdates will just guarantee the
      // outOptions.optionName will be true even if options.optionName is
      // zero, and cause animate() to be called with outOptions.run set to
      // 'immediate' if run === 0, guaranteeing this call to innerAnimateRAFed
      // will cause the immediate option to be executed once and rendered
      var immediates = { };

      // update any options passed in optionsUpdates
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

      // Cancel any pending rAF call since since we are queueing up one below
      if ( id !== null ) {

        window.cancelAnimationFrame(id);

        id = null;

      }

      // queue up rAF to process the options and call animate() if necessary
      // rAFCallee is the actual callback for rAF that may get called repeatedly
      // without another explicit call to innerAnimateRAFed() if run option > ticks
      id = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        // outOptions is formed by processing options is passed to animate()
        var outOptions = { };
        var temp;

        outOptions.render = options.render;
        options.render = false;

        // reset time if startTime has been set < 0
        if ( startTime < 0 ) {

          startTime = timestamp;
          prevTimestamp = timestamp;
          ticksLeftovers = 0;

        }

        // outOptions time related options
        outOptions.startTime = startTime;
        outOptions.timestamp = timestamp;
        outOptions.deltaTime = timestamp - prevTimestamp;

        prevTimestamp = timestamp;

        temp = outOptions.deltaTime + ticksLeftovers;
        outOptions.ticks = Math.trunc( temp / options.msPerTick );
        ticksLeftovers = temp - outOptions.ticks * options.msPerTick;

        // Process options, updating outOptions appropriately
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

        // Only call animate() if run true or 'immediate'
        if ( outOptions.run ) {

          animate( outOptions );

        }

        // Queue up rAFCallee again (this function) if further run ticks remain
        // if run === 0, animate() may have been called above but since ticks were
        // subtracted after outOptions.run was set true or 'immediate', no ticks
        // are left for further runs, meaning no need to queue up another rAF
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
