/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License.
 */

function rAFAnimate ( animate, continuous ) {

  'use strict';

  return ( function () {

    var ID = null;

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

      if ( ID === null ) {

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
