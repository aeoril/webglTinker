/**
 * @author greggman | https://webglfundamentals.org
 * @author Xitalogy | https://www.xitalogy.com
 *
 * Copyright © 2019 by Xitalogy.  MIT License. https://opensource.org/licenses/MIT
 * Portions Copyright © 2012 by Gregg Tavares.  See LICENSE-webfundamentals.md
 */

var webglUtils = ( function () {

  'use strict';

  return {

    initWebGL: function ( canvasElem ) {

      var gl = null;

      gl = canvasElem.getContext( 'webgl' ) ||
           canvasElem.getContext( 'experimental-webgl' );

      if ( !gl ) {

        throw new Error('canvasElem.getContext("webgl") returned ' + gl +
         ' - webgl may not be supported');

      }

      return gl;

    },

    createShader:  function ( gl, type, source ) {

      var success;
      var shaderInfoLog;

      var shader = gl.createShader( type );

      gl.shaderSource( shader, source );
      gl.compileShader( shader );

      success = gl.getShaderParameter( shader, gl.COMPILE_STATUS );

      if ( !success ) {

        shaderInfoLog = gl.getShaderInfoLog( shader );

        gl.deleteShader( shader );

        throw new Error( shaderInfoLog );

      }

      return shader;

    },


    createProgram: function ( gl, vertexShader, fragmentShader ) {

      var success;
      var programInfoLog;

      var program = gl.createProgram();

      gl.attachShader( program, vertexShader );
      gl.attachShader( program, fragmentShader );

      gl.linkProgram( program );

      success = gl.getProgramParameter( program, gl.LINK_STATUS );

      if ( !success ) {

        programInfoLog = gl.getProgramInfoLog( program );

        gl.deleteProgram( program );

        throw new Error( programInfoLog );

      }

      return program;

    },

    ////////////////////////////////////////////////////
    // todo: reminder of anti-pattern - don't do this!!!
    ////////////////////////////////////////////////////
    resizeCanvasToWindowSize: function ( gl ) {

      // window.innerWidth and window.innerHeight are the problem
      var windowWidth  = window.innerWidth;
      var windowHeight = window.innerHeight;

      if ( gl.canvas.width !== windowWidth ||
           gl.canvas.height !== windowHeight ) {

        gl.canvas.width  = windowWidth;
        gl.canvas.height = windowHeight;

        return true;

      }

      return false;

    },
    ////////////////////////////////////////////////////
    // todo: end of anti-pattern reminder
    ////////////////////////////////////////////////////

    resizeCanvasToDisplaySize: function ( gl ) {

      var realToCSSPixels = window.devicePixelRatio;

      var displayWidth  = Math.floor( gl.canvas.clientWidth * realToCSSPixels );
      var displayHeight = Math.floor( gl.canvas.clientHeight * realToCSSPixels );

      if ( gl.canvas.width !== displayWidth ||
           gl.canvas.height !== displayHeight ) {

        gl.canvas.width  = displayWidth;
        gl.canvas.height = displayHeight;

        return true;

      }

      return false;

    }
  };
}() );
