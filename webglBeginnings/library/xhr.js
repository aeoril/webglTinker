/**
 * @author aeoril | https://www.ic3dimensions.com
 * Copyright © 2017 by IC3 Dimensions.  MIT License.
 */

var xhr = ( function () {

  'use strict';

  var self = {

    debug: false,

    log: function ( evt, that ) {

      if ( self.debug ) {

        console.log( 'textGets Event log: type: ' + evt.type );
        console.log( that || this );
        console.log( evt );

      }
    },

    load: function ( evt, that, key, length, responsesObj, finish ) {

      //self.log(evt, that);

      if ( that.status !== 200 || !that.responseText ) {

        console.log('textGets: load event for key ' + key +
         ' returned bad status or empty response text');

        responsesObj.badStatus = true;

      }

      responsesObj[ key ] = that.responseText;

      if ( Object.keys( responsesObj ).length - 1 === length) {

        finish( responsesObj );

      }
    },

    get: function ( url, load, progress, error, abort ) {

      var req = new XMLHttpRequest();

      load = load || self.log;
      progress = progress || self.log;
      error = error || self.log;
      abort = abort || self.log;

      req.addEventListener( 'load', load, false );
      req.addEventListener( 'progress', progress, false );
      req.addEventListener( 'error', error, false );
      req.addEventListener( 'abort', abort, false );

      req.open( 'GET', url );
      req.send();

    },

    textGets: function ( urlObjs, finish, progress, error, abort ) {

      var responsesObj = { badStatus: false };

      urlObjs.forEach( function (urlObj ) {

        self.get( urlObj.url, function ( evt ) {

          self.load( evt, this, urlObj.key, urlObjs.length, responsesObj, finish );

        }, progress, error, abort );

      });
    }
  };

  return self;

}() );
