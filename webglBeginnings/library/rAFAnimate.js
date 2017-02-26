/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

function rAFAnimate ( animate, continuous ) {

  'use strict';

  return ( function () {

    var ID = null;

    function innerAnimateRAFed( evt, optionsAry ) {

      if ( !optionsAry ) {

        if ( !evt || evt instanceof Event ) {

            optionsAry = [ { evt: evt } ];

        } else {

          optionsAry = evt;
          optionsAry.forEach( function ( options ) {
            options.evt = undefined;
          });

        }
      } else {

        optionsAry.forEach( function ( options ) {
          options.evt = evt;
        });

      }

      if ( ID ) {

        window.cancelAnimationFrame(ID);

      }

      ID = window.requestAnimationFrame( function rAFCallee( timestamp ) {

        animate( timestamp, optionsAry[0] );

        if ( innerAnimateRAFed.continuous || optionsAry.length > 1 ) {

          if ( optionsAry.length > 1 ) {

            optionsAry.shift();

          }

          ID = window.requestAnimationFrame( rAFCallee );

        } else {
          
          ID = null;

        }
      } );
    }

    innerAnimateRAFed.continuous = continuous;

    return innerAnimateRAFed;

  }() );
}
