// Copyright © 2015 QuarksCode.  MIT License - see http://opensource.org/licenses/MIT
// Original Author:  aeoril

function simpleCopy(obj) {
    'use strict';
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    return Object.keys(obj).reduce(function (result, key) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            result[key] = simpleCopy(obj[key]);
        } else {
            result[key] = obj[key];
        }
        return result;
    }, Array.isArray(obj) ? [] : {});
}

function simpleCopyBind(obj) {
    'use strict';
    return simpleCopy.bind(null, simpleCopy(obj));
}
