/**
 * @author greggman | https://webglfundamentals.org
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License. See LICENSE.md
 */

var mathExtras = ( function () {

  'use strict';

  return {

    translation: function ( tx, ty ) {

      return [

        1,  0,  0,
        0,  1,  0,
        tx, ty, 1

      ];
    },

    rotation: function ( angleInRadians ) {

      var c = Math.cos( angleInRadians );
      var s = Math.sin( angleInRadians );

      return [

        c, -s, 0,
        s,  c, 0,
        0,  0, 1

      ];
    },

    scale: function ( sx, sy ) {

      return [

        sx, 0, 0,
        0, sy, 0,
        0,  0, 1

      ];
    }
  };
}() );
