/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, options ) {

  'use strict';

  // eliminate side effects and external interference
  options = simpleCopy(options);

  options.repeat = options.repeat || 0;
  options.immediate = options.immediate || 0;
  options.render = options.render || 0;
  options.ms = options.ms || 0;

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
            options.immediate = options.immediate || 1;

          } else {

            options[key] = optionsUpdates[key];

          }
        });
      }

      options.render = 0;

      Object.keys( options ).forEach( function ( key ) {

        if ( key === 'repeat' ) {

          return;

        }

        if ( key !== 'render' && key !== 'immediate' ) {

          if ( options[ key ] !== Infinity ) {

            options.immediate = Math.max( options.immediate, options[ key ]);

            options.render = Math.max( options.render, options.immediate );

          } else {

            options.render = Infinity;

          }
        }
      });

      if ( ID ) {

        window.cancelAnimationFrame(ID);

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        var outOptions = {};

        Object.keys( options ).forEach( function ( key ) {

          if ( key === 'ms' ) {

            outOptions.ms = options.ms;

          } else {

            outOptions[ key ] = !!options[ key ];

            if ( options [ key ] > 0 ) {

              options[ key ]--;

            }
          }
        });

        animate( timestamp, outOptions );

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
