/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

( function () {

  'use strict';

  function setGeometry ( gl ) {

    var width  = Math.min( gl.canvas.clientWidth, gl.canvas.clientHeight);
    var height = width; // make a square frame

    var indices = [

      // x axis
      width * -0.1, height * 0.299, 0.0,
      width *  0.7, height * 0.299, 0.0,
      width *  0.7, height * 0.301, 0.0,

      width *  0.7, height * 0.301, 0.0,
      width * -0.1, height * 0.301, 0.0,
      width * -0.1, height * 0.299, 0.0,

      // y axis
      width * 0.299, height * -0.1, 0.0,
      width * 0.299, height *  0.7, 0.0,
      width * 0.301, height *  0.7, 0.0,

      width * 0.301, height *  0.7, 0.0,
      width * 0.301, height * -0.1, 0.0,
      width * 0.299, height * -0.1, 0.0,

      // z axis
      width * 0.299, height * 0.3, width * -0.4,
      width * 0.299, height * 0.3, width *  0.4,
      width * 0.301, height * 0.3, width *  0.4,

      width * 0.301, height * 0.3, width *  0.4,
      width * 0.301, height * 0.3, width * -0.4,
      width * 0.299, height * 0.3, width * -0.4,

      // top frame

      // Triangle 1
      width * 0.1, height * 0.0, width * 0.05,
      width * 0.1, height * 0.1, width * 0.05,
      width * 0.3, height * 0.0, width * 0.05,

      // Triangle 2
      width * 0.3, height * 0.0, width * 0.05,
      width * 0.1, height * 0.1, width * 0.05,
      width * 0.5, height * 0.1, width * 0.05,

      // ...
      width * 0.5, height * 0.1, width * 0.05,
      width * 0.3, height * 0.0, width * 0.05,
      width * 0.6, height * 0.0, width * 0.05,

      width * 0.6, height * 0.0, width * 0.05,
      width * 0.5, height * 0.1, width * 0.05,
      width * 0.6, height * 0.3, width * 0.05,

      width * 0.6, height * 0.3, width * 0.05,
      width * 0.5, height * 0.1, width * 0.05,
      width * 0.5, height * 0.5, width * 0.05,

      width * 0.5, height * 0.5, width * 0.05,
      width * 0.6, height * 0.3, width * 0.05,
      width * 0.6, height * 0.6, width * 0.05,

      width * 0.6, height * 0.6, width * 0.05,
      width * 0.5, height * 0.5, width * 0.05,
      width * 0.3, height * 0.6, width * 0.05,

      width * 0.3, height * 0.6, width * 0.05,
      width * 0.5, height * 0.5, width * 0.05,
      width * 0.1, height * 0.5, width * 0.05,

      width * 0.1, height * 0.5, width * 0.05,
      width * 0.3, height * 0.6, width * 0.05,
      width * 0.0, height * 0.6, width * 0.05,

      width * 0.0, height * 0.6, width * 0.05,
      width * 0.1, height * 0.5, width * 0.05,
      width * 0.0, height * 0.3, width * 0.05,

      width * 0.0, height * 0.3, width * 0.05,
      width * 0.1, height * 0.5, width * 0.05,
      width * 0.1, height * 0.1, width * 0.05,

      width * 0.1, height * 0.1, width * 0.05,
      width * 0.0, height * 0.3, width * 0.05,
      width * 0.0, height * 0.0, width * 0.05,

      // bottom frame

      // Triangle 1
      width * 0.1, height * 0.0, -width * 0.05,
      width * 0.1, height * 0.1, -width * 0.05,
      width * 0.3, height * 0.0, -width * 0.05,

      // Triangle 2
      width * 0.3, height * 0.0, -width * 0.05,
      width * 0.1, height * 0.1, -width * 0.05,
      width * 0.5, height * 0.1, -width * 0.05,

      // ...
      width * 0.5, height * 0.1, -width * 0.05,
      width * 0.3, height * 0.0, -width * 0.05,
      width * 0.6, height * 0.0, -width * 0.05,

      width * 0.6, height * 0.0, -width * 0.05,
      width * 0.5, height * 0.1, -width * 0.05,
      width * 0.6, height * 0.3, -width * 0.05,

      width * 0.6, height * 0.3, -width * 0.05,
      width * 0.5, height * 0.1, -width * 0.05,
      width * 0.5, height * 0.5, -width * 0.05,

      width * 0.5, height * 0.5, -width * 0.05,
      width * 0.6, height * 0.3, -width * 0.05,
      width * 0.6, height * 0.6, -width * 0.05,

      width * 0.6, height * 0.6, -width * 0.05,
      width * 0.5, height * 0.5, -width * 0.05,
      width * 0.3, height * 0.6, -width * 0.05,

      width * 0.3, height * 0.6, -width * 0.05,
      width * 0.5, height * 0.5, -width * 0.05,
      width * 0.1, height * 0.5, -width * 0.05,

      width * 0.1, height * 0.5, -width * 0.05,
      width * 0.3, height * 0.6, -width * 0.05,
      width * 0.0, height * 0.6, -width * 0.05,

      width * 0.0, height * 0.6, -width * 0.05,
      width * 0.1, height * 0.5, -width * 0.05,
      width * 0.0, height * 0.3, -width * 0.05,

      width * 0.0, height * 0.3, -width * 0.05,
      width * 0.1, height * 0.5, -width * 0.05,
      width * 0.1, height * 0.1, -width * 0.05,

      width * 0.1, height * 0.1, -width * 0.05,
      width * 0.0, height * 0.3, -width * 0.05,
      width * 0.0, height * 0.0, -width * 0.05

    ];

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( indices ), gl.STATIC_DRAW );

    return {

      count: indices.length / 3,
      center: { x: width * 0.3, y: height * 0.3, z: 0.0 }

    };

  }

  function setColors ( gl, count ) {

    var colors = [];

    for ( var ii = 0; ii < count; ii++ ) {

      colors.splice( colors.length, 0,
        mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
        mathExtras.randInt( 256 ), 255 );

    }

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

    return colors;

  }

  var triangleToUpdate = 0;

  function setSequentialColors( gl, colors, count ) {

    for ( var ii = 0; ii < count; ii++ ) {

      colors.splice( triangleToUpdate * 4, 4,
        mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
        mathExtras.randInt( 256 ), 255);

      triangleToUpdate = ( ++triangleToUpdate ) % Math.floor( colors.length / 4 );

    }

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

  }

  function setRandomColors( gl, colors, count ) {

    for ( var ii = 0; ii < count; ii++ ) {

      colors.splice( mathExtras.randInt( colors.length / 4 ) * 4, 4,
        mathExtras.randInt( 256 ), mathExtras.randInt( 256 ),
        mathExtras.randInt( 256 ), 255);

    }

    gl.bufferData( gl.ARRAY_BUFFER, new Uint8Array( colors ), gl.STATIC_DRAW );

  }

  window.addEventListener( 'load', function () {

    var vertexShaderSource;
    var fragmentShaderSource;

    var urlObjs = [

      {key: 'VSSource', url: 'glsl/wglb018_vs.glsl'},
      {key: 'FSSource', url: 'glsl/wglb018_fs.glsl'}

    ];

    var vertexShader;
    var fragmentShader;

    var program;

    var colorAttributeLocation;
    var colorBuffer;

    var positionAttributeLocation;
    var positionBuffer;

    var scaleX;
    var scaleY;
    var scaleZ;

    var XAngleInDegrees;
    var YAngleInDegrees;
    var ZAngleInDegrees;

    var translationX;
    var translationY;
    var translationZ;

    var projectionMatrix;
    var translationMatrix;
    var rotationMatrix;
    var scalingMatrix;
    var moveOriginMatrix;

    var matrixUniformLocation;

    var canvasElem;
    var gl;

    var colors;

    var setGeometryMeta;

    var first = true;

    var SPEED_FACTOR = 2;

    var MS_PER_TICK = ( SPEED_FACTOR / 60 ) * 1000;

    var TRANSLATE_DELTA = 1;
    var SCALE_DIVISOR = 100;
    var DEGREE_CHANGE_PER_MS = 5 / (SPEED_FACTOR * 1000);

    var resetElem;

    var scaleXElem;
    var scaleYElem;
    var scaleZElem;

    var rotateXElem;
    var rotateYElem;
    var rotateZElem;

    var translateXElem;
    var translateYElem;
    var translateZElem;

    var setSequentialColorsElem;
    var setRandomColorsElem;

    function animate ( options ) {

      var resized;

      var size;
      var type;
      var normalize;
      var stride;
      var offset;

      var primitiveType;

      var transformMatrix;

      var ii;

      resized = webglUtils.resizeCanvasToDisplaySize( gl );

      if ( resized || first ) {

        gl.viewport( 0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight );

        gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );

        setGeometryMeta = setGeometry( gl );

        size = 3;
        type = gl.FLOAT;
        normalize = false;
        stride = 0;
        offset = 0;

        gl.vertexAttribPointer(
          positionAttributeLocation, size, type, normalize, stride, offset );

        translateXElem.max = gl.canvas.clientWidth;

        translationX = Math.min( translationX, translateXElem.max );
        translateXElem.value = translationX;

        translateYElem.max = gl.canvas.clientHeight;

        translationY = Math.min( translationY, translateYElem.max );
        translateYElem.value = translationY;

        translateZElem.max = Math.min( gl.canvas.clientWidth, gl.canvas.clientHeight );

        translationZ = Math.min( translationZ, translateZElem.max );
        translateZElem.value = translationZ;

      }

      if ( options.setColors || options.setSequentialColors || options.setRandomColors || first ) {

        gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );

        if ( options.setSequentialColors ) {

          setSequentialColors( gl, colors, options.ticks );

        } else if ( options.setRandomColors ) {

          setRandomColors( gl, colors, options.ticks );

        } else {

          colors = setColors( gl, setGeometryMeta.count );

        }

        size = 4;
        type = gl.UNSIGNED_BYTE;
        normalize = true;
        stride = 0;
        offset = 0;

        gl.vertexAttribPointer(
          colorAttributeLocation, size, type, normalize, stride, offset );

      }

      if ( options.translateX ) {

        translationX += mathExtras.repeatAdd( mathExtras.randIntInc,
          options.ticks, -TRANSLATE_DELTA, TRANSLATE_DELTA );

      }

      if ( options.translateY ) {

        translationY += mathExtras.repeatAdd( mathExtras.randIntInc,
          options.ticks, -TRANSLATE_DELTA, TRANSLATE_DELTA );

      }

      if ( options.translateZ ) {

        translationZ += mathExtras.repeatAdd( mathExtras.randIntInc,
          options.ticks, -TRANSLATE_DELTA, TRANSLATE_DELTA );

      }

      if ( options.scaleX ) {

        scaleX += mathExtras.repeatAdd ( function ( ) { return ( Math.random() - 0.5 ) / SCALE_DIVISOR; },
          options.ticks);

      }

      if ( options.scaleY ) {

        scaleY += mathExtras.repeatAdd ( function ( ) { return ( Math.random() - 0.5 ) / SCALE_DIVISOR; },
          options.ticks);

      }

      if ( options.scaleZ ) {

        scaleZ += mathExtras.repeatAdd ( function ( ) { return ( Math.random() - 0.5 ) / SCALE_DIVISOR; },
          options.ticks);

      }

      if ( options.rotateX ) {

        XAngleInDegrees += DEGREE_CHANGE_PER_MS * options.deltaTime;

      }

      if ( options.rotateY ) {

        YAngleInDegrees += DEGREE_CHANGE_PER_MS * options.deltaTime;

      }

      if ( options.rotateZ ) {

        ZAngleInDegrees += DEGREE_CHANGE_PER_MS * options.deltaTime;

      }

      if ( resized || options.render ) {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        projectionMatrix = m4.projection(
          gl.canvas.clientWidth,
          gl.canvas.clientHeight,
          Math.min( gl.canvas.clientWidth, gl.canvas.clientHeight ) );

        transformMatrix = m4.translate( projectionMatrix,
          translationX, translationY, translationZ );
        transformMatrix = m4.XRotateDeg( transformMatrix, XAngleInDegrees );
        transformMatrix = m4.YRotateDeg( transformMatrix, YAngleInDegrees );
        transformMatrix = m4.ZRotateDeg( transformMatrix, 360 - ZAngleInDegrees );
        transformMatrix = m4.scale( transformMatrix, scaleX, scaleY, scaleZ );
        transformMatrix = m4.translate( transformMatrix,
          -setGeometryMeta.center.x, -setGeometryMeta.center.y, -setGeometryMeta.center.z );

        gl.uniformMatrix4fv( matrixUniformLocation, false, transformMatrix );

        primitiveType = gl.TRIANGLES;
        offset = 0;

        gl.drawArrays( primitiveType, offset, setGeometryMeta.count );

      }

      first = false;

    }

    function finish ( responsesObj ) {

      if ( responsesObj.badStatus ) {

        throw new Error( '1 or more get loads had a bad status' );

      }

      canvasElem = document.getElementById( 'canvas' );

      gl = webglUtils.initWebGL( canvasElem );

      vertexShader = webglUtils.createShader(
        gl, gl.VERTEX_SHADER, responsesObj.VSSource );

      fragmentShader = webglUtils.createShader(
        gl, gl.FRAGMENT_SHADER, responsesObj.FSSource );

      program = webglUtils.createProgram( gl, vertexShader, fragmentShader );

      positionAttributeLocation = gl.getAttribLocation( program, 'a_position' );
      colorAttributeLocation    = gl.getAttribLocation( program, 'a_color' );

      matrixUniformLocation = gl.getUniformLocation( program, 'u_matrix');

      colorBuffer    = gl.createBuffer();
      positionBuffer = gl.createBuffer();

      gl.useProgram( program );

      gl.enableVertexAttribArray( positionAttributeLocation );

      gl.enableVertexAttribArray( colorAttributeLocation );

      gl.clearColor( 0, 0, 0, 0 );

      gl.enable( gl.DEPTH_TEST );

      var animateRAFed = rAFAnimate( animate,
      {

        repeat: Infinity,
        msPerTick: MS_PER_TICK,
        setColors: 0,
        setSequentialColors: 0,
        setRandomColors: 0,
        scaleY: 0,
        scaleX: 0,
        scaleZ: 0,
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0

      } );

      translateXElem = document.getElementById('translateX');

      translateXElem.min = 0;
      translateXElem.max = gl.canvas.clientWidth;
      translateXElem.value = Math.floor( gl.canvas.clientWidth / 2 );
      translationX = parseInt(translateXElem.value, 10);

      translateXElem.addEventListener('input', function () {

        translationX = parseInt( translateXElem.value, 10 );

        animateRAFed( { translateX: "immediate" } );

      });

      translateYElem = document.getElementById('translateY');

      translateYElem.min = 0;
      translateYElem.max = gl.canvas.clientHeight;
      translateYElem.value = Math.floor( gl.canvas.clientHeight / 2 );
      translationY = parseInt( translateYElem.value, 10 );

      translateYElem.addEventListener('input', function () {

        translationY = parseInt( translateYElem.value, 10 );

        animateRAFed( { translateY: "immediate" } );

      }, false);

      translateZElem = document.getElementById('translateZ');

      translateZElem.min = -Math.min( gl.canvas.clientWidth, gl.canvas.clientHeight ) / 2;
      translateZElem.max = -translateZElem.min;
      translateZElem.value = 0;
      translationZ = parseInt( translateZElem.value, 10 );

      translateZElem.addEventListener('input', function () {

        translationZ = parseInt( translateZElem.value, 10 );

        animateRAFed( { translateZ: "immediate" } );

      }, false);

      scaleXElem = document.getElementById('scaleX');

      scaleXElem.min = -200;
      scaleXElem.max = 200;
      scaleXElem.value = 100;

      scaleXElem.addEventListener('input', function () {

        scaleX = parseInt( scaleXElem.value, 10 ) / 100;

        animateRAFed( { scaleX: "immediate" } );

      }, false);

      scaleYElem = document.getElementById('scaleY');

      scaleYElem.min = -200;
      scaleYElem.max = 200;
      scaleYElem.value = 100;

      scaleYElem.addEventListener('input', function () {

        scaleY = parseInt( scaleYElem.value, 10 ) / 100;

        animateRAFed( { scaleY: "immediate" } );

      }, false);

      scaleZElem = document.getElementById('scaleZ');

      scaleZElem.min = -200;
      scaleZElem.max = 200;
      scaleZElem.value = 100;

      scaleZElem.addEventListener('input', function () {

        scaleZ = parseInt( scaleZElem.value, 10 ) / 100;

        animateRAFed( { scaleZ: "immediate" } );

      }, false);

      rotateXElem = document.getElementById('rotateX');

      rotateXElem.min = 0;
      rotateXElem.max = 360;
      rotateXElem.value = 0;

      rotateXElem.addEventListener('input', function () {

        XAngleInDegrees = parseInt( rotateXElem.value, 10 );

        animateRAFed( { rotateX: "immediate" } );

      }, false);

      rotateYElem = document.getElementById('rotateY');

      rotateYElem.min = 0;
      rotateYElem.max = 360;
      rotateYElem.value = 0;

      rotateYElem.addEventListener('input', function () {

        YAngleInDegrees = parseInt( rotateYElem.value, 10 );

        animateRAFed( { rotateY: "immediate" } );

      }, false);

      rotateZElem = document.getElementById('rotateZ');

      rotateZElem.min = 0;
      rotateZElem.max = 360;
      rotateZElem.value = 0;

      rotateZElem.addEventListener('input', function () {

        ZAngleInDegrees = parseInt( rotateZElem.value, 10 );

        animateRAFed( { rotateZ: "immediate" } );

      }, false);

      var animateScaleXElem = document.getElementById( 'animateScaleX' );

      animateScaleXElem.addEventListener( 'click', function () {

        if ( animateRAFed( { scaleX: 'toggle' } ).scaleX ) {

          animateScaleXElem.style.borderStyle = 'inset';

        } else {

          animateScaleXElem.style.borderStyle = '';

        }
      }, false );

      var animateScaleYElem = document.getElementById( 'animateScaleY' );

      animateScaleYElem.addEventListener( 'click', function () {

        if ( animateRAFed( { scaleY: 'toggle' } ).scaleY ) {

          animateScaleYElem.style.borderStyle = 'inset';

        } else {

          animateScaleYElem.style.borderStyle = '';

        }
      }, false );

      var animateScaleZElem = document.getElementById( 'animateScaleZ' );

      animateScaleZElem.addEventListener( 'click', function () {

        if ( animateRAFed( { scaleZ: 'toggle' } ).scaleZ ) {

          animateScaleZElem.style.borderStyle = 'inset';

        } else {

          animateScaleZElem.style.borderStyle = '';

        }
      }, false );

      var animateTranslateXElem = document.getElementById( 'animateTranslateX' );

      animateTranslateXElem.addEventListener( 'click', function () {

        if ( animateRAFed( { translateX: 'toggle' } ).translateX ) {

          animateTranslateXElem.style.borderStyle = 'inset';

        } else {

          animateTranslateXElem.style.borderStyle = '';

        }
      }, false );

      var animateTranslateYElem = document.getElementById( 'animateTranslateY' );

      animateTranslateYElem.addEventListener( 'click', function () {

        if ( animateRAFed( { translateY: 'toggle' } ).translateY ) {

          animateTranslateYElem.style.borderStyle = 'inset';

        } else {

          animateTranslateYElem.style.borderStyle = '';

        }
      }, false );

      var animateTranslateZElem = document.getElementById( 'animateTranslateZ' );

      animateTranslateZElem.addEventListener( 'click', function () {

        if ( animateRAFed( { translateZ: 'toggle' } ).translateZ ) {

          animateTranslateZElem.style.borderStyle = 'inset';

        } else {

          animateTranslateZElem.style.borderStyle = '';

        }
      }, false );

      var animateRotateXElem = document.getElementById( 'animateRotateX' );

      animateRotateXElem.addEventListener( 'click', function () {

        if ( animateRAFed( { rotateX: 'toggle' } ).rotateX ) {

          animateRotateXElem.style.borderStyle = 'inset';

        } else {

          animateRotateXElem.style.borderStyle = '';

        }
      }, false );

      var animateRotateYElem = document.getElementById( 'animateRotateY' );

      animateRotateYElem.addEventListener( 'click', function () {

        if ( animateRAFed( { rotateY: 'toggle' } ).rotateY ) {

          animateRotateYElem.style.borderStyle = 'inset';

        } else {

          animateRotateYElem.style.borderStyle = '';

        }
      }, false );

      var animateRotateZElem = document.getElementById( 'animateRotateZ' );

      animateRotateZElem.addEventListener( 'click', function () {

        if ( animateRAFed( { rotateZ: 'toggle' } ).rotateZ ) {

          animateRotateZElem.style.borderStyle = 'inset';

        } else {

          animateRotateZElem.style.borderStyle = '';

        }
      }, false );

      var setSequentialColorsElem = document.getElementById( 'setSequentialColors' );

      setSequentialColorsElem.addEventListener( 'click', function () {

        var options = animateRAFed( { setSequentialColors: 'toggle' } );

        if (options.setSequentialColors ) {

          setSequentialColorsElem.style.borderStyle = 'inset';

          if ( options.setRandomColors ) {

            animateRAFed( { setRandomColors: 0 } );
            setRandomColorsElem.style.borderStyle = '';

          }
        } else {

          setSequentialColorsElem.style.borderStyle = '';

        }
      }, false );

      var setRandomColorsElem = document.getElementById( 'setRandomColors' );

      setRandomColorsElem.addEventListener( 'click', function () {

        var options = animateRAFed( { setRandomColors: 'toggle' } );

        if (options.setRandomColors ) {

          setRandomColorsElem.style.borderStyle = 'inset';

          if ( options.setSequentialColors ) {

            animateRAFed( { setSequentialColors: 0 } );
            setSequentialColorsElem.style.borderStyle = '';

          }
        } else {

          setRandomColorsElem.style.borderStyle = '';

        }
      }, false );

      var resetElem = document.getElementById('reset');

      function reset () {

        translationX = Math.floor( gl.canvas.clientWidth / 2 );
        translationY = Math.floor( gl.canvas.clientHeight / 2 );
        translationZ = 0;

        translateXElem.value = translationX;
        translateYElem.value = translationY;
        translateZElem.value = translationZ;

        scaleX = 1;
        scaleY = 1;
        scaleZ = 1;

        scaleXElem.value = 100;
        scaleYElem.value = 100;
        scaleZElem.value = 100;

        XAngleInDegrees = 0;
        YAngleInDegrees = 0;
        ZAngleInDegrees = 0;

        rotateXElem.value = 0;
        rotateYElem.value = 0;
        rotateZElem.value = 0;

        animateScaleXElem.style.borderStyle = '';
        animateScaleYElem.style.borderStyle = '';
        animateScaleZElem.style.borderStyle = '';
        animateTranslateXElem.style.borderStyle = '';
        animateTranslateYElem.style.borderStyle = '';
        animateTranslateZElem.style.borderStyle = '';
        animateRotateXElem.style.borderStyle = '';
        animateRotateYElem.style.borderStyle = '';
        animateRotateZElem.style.borderStyle = '';
        setSequentialColorsElem.style.borderStyle = '';
        setRandomColorsElem.style.borderStyle = '';

        animateRAFed(
        {

          setColors: 'immediate',
          setSequentialColors: 0,
          setRandomColors: 0,
          scaleX: 0,
          scaleY: 0,
          scaleZ: 0,
          translateX: 0,
          translateY: 0,
          translateZ: 0,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0

        } );
      }

      resetElem.addEventListener( 'click', reset, false );

      reset();

    }

    xhr.textGets( urlObjs, finish );

  }, false);
}() );
