// @author aeoril | https://www.ic3dimensions.com
// Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md

window.addEventListener('load', function ( ) {

  'use strict';

  var outputElem = document.getElementById( 'output' );
  var showTimesElem = document.getElementById( 'showTimes' );
  var showTicksElem = document.getElementById( 'showTicks' );
  var runElem = document.getElementById( 'run' );
  var msPerTickElem = document.getElementById( 'msPerTick');
  var msElem = document.getElementById( 'ms' );
  var framesElem = document.getElementById( 'frames' );
  var submitElem = document.getElementById( 'submit' );


  var fps = 0;
  var ticks = 0;
  var ticksTTL = 0;
  var framesPerTickCounter = -1;
  var framesPerTick = 0;
  var ticksPerFrame = 0;
  var msPerTickImmediate = 0;
  var msPerTickAverage = 0;
  var timeSinceLastTick = 0;

  var animateRAFed = rAFAnimate(animate, {

    showTimes: 0,
    showTicks: 0

  } );

  function animate ( options ) {

    var outputString;

    if ( options.run !== 'immediate' ) {

      ticksTTL += options.ticks;

      if (options.ticks) {

        framesPerTickCounter++;

        fps = 1000 / options.deltaTime;
        ticks = options.ticks;
        ticksPerFrame = ticks / framesPerTickCounter;
        framesPerTick = framesPerTickCounter / options.ticks;
        timeSinceLastTick += options.deltaTime;
        msPerTickImmediate = timeSinceLastTick / options.ticks;
        msPerTickAverage = ( options.timestamp - options.startTime ) / ticksTTL;
        timeSinceLastTick = 0;
        framesPerTickCounter = 0;

      } else {

        timeSinceLastTick += options.deltaTime;
        framesPerTickCounter++;

      }
    }

    if ( options.showTimes) {

      outputString =
        'timestamp ......................: ' + options.timestamp.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'startTime ......................: ' + options.startTime.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'deltaTime ......................: ' + options.deltaTime.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'fps ............................: ' + fps.toFixed( 2 ).padStart( 9, '0' ) + '\n\n';

    } else {

      outputString = '';

    }

    if ( options.showTicks ) {

      outputString +=
        'ticks at Sample Time ...........: ' + ticks.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'ticksTTL .......................: ' + ticksTTL.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'ticksPerFrame (calculated) .....: ' + ticksPerFrame.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'framesPerTick (calculated) .....: ' + framesPerTick.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'average msPerTick (calculated) .: ' + msPerTickAverage.toFixed( 2 ).padStart( 9, '0' ) + '\n' +
        'immediate msPerTick (calculated): ' + msPerTickImmediate.toFixed( 2 ).padStart( 9, '0' );
    }

    if ( options.render ) {

      outputElem.innerText = outputString;

    }
  }

  function toggle ( elem, key ) {

    var options = { };
    var showOptions = { };

    options[ key ] = 'toggle';

    if ( ( options = animateRAFed( options ) )[ key ] ) {

      elem.style.borderStyle = 'inset';

    } else {

      elem.style.borderStyle = '';

    }

    if ( key !== 'run' ) {

      if ( options.showTimes ) {

        showOptions.showTimes = 'immediate';

      }

      if ( options.showTicks ) {

        showOptions.showTicks = 'immediate';

      }

      if ( !( options.showTimes || options.showTicks || options.run ) ) {

        showOptions.render = true;

      }

      animateRAFed( showOptions );

    }

    return simpleCopy( options );

  }

  showTimesElem.addEventListener( 'click', function ( ) { toggle( this, 'showTimes' ); }, false );
  showTicksElem.addEventListener( 'click', function ( ) { toggle( this, 'showTicks' ); }, false );
  runElem.addEventListener( 'click', function ( ) {

    if ( toggle( this, 'run' ).run ) {

      ticks = 0;
      ticksTTL = 0;
      framesPerTickCounter = -1;
      ticksPerFrame = 0;
      framesPerTick = 0;
      msPerTickImmediate = 0;
      msPerTickAverage = 0;
      timeSinceLastTick = 0;
    }
  }, false );

  function submitMsPerTick ( ) {

    var ms = parseFloat( msElem.value );
    var frames = parseFloat( framesElem.value );
    var msPerTick = ms / frames;

    animateRAFed( { msPerTick: msPerTick } );

    return false;

  }

  msPerTickElem.addEventListener( 'submit', submitMsPerTick, false );
  submitElem.addEventListener( 'submit', submitMsPerTick, false );

  submitMsPerTick( );

} );
