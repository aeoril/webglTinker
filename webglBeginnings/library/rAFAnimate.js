/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, continuous ) {

  'use strict';

  return ( function () {

    var ID = null;
    var prevContinuous = continuous;

    function innerAnimateRAFed( evt, options ) {

      if ( !options ) {

        if ( !evt || evt instanceof Event ) {

            options = { evt: evt };

        } else {

          options = evt;
          options.evt = undefined;

        }
      } else {

        options.evt = evt;

      }

      if ( ID === null || innerAnimateRAFed.continuous !== prevContinuous) {

        prevContinuous = continuous;

        if ( ID ) {

          window.cancelAnimationFrame(ID);

        }

        ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

          animate( timestamp, options );

          if ( innerAnimateRAFed.continuous ) {

            ID = window.requestAnimationFrame( rAFCallee );

          } else {

            ID = null;

          }
        } );
      }
    }

    innerAnimateRAFed.continuous = continuous;

    return innerAnimateRAFed;

  }() );
}
