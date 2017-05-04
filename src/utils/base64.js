// Base64 encode / decode
// @author http://www.webtoolkit.info

var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

var Base64 = {
    decode: function(input) {
        var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

        while (i < input.length) {
            enc1 = keyStr.indexOf(input.charAt(i++));
            enc2 = keyStr.indexOf(input.charAt(i++));
            enc3 = keyStr.indexOf(input.charAt(i++));
            enc4 = keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output.push(String.fromCharCode(chr1));

            if (enc3 !== 64) {
                output.push(String.fromCharCode(chr2));
            }
            if (enc4 !== 64) {
                output.push(String.fromCharCode(chr3));
            }
        }

        output = output.join('');
        return output;
    },

    decodeAsArray: function(input, bytes) {
        bytes = bytes || 1;
        var decoded = Base64.decode(input);
        var len = decoded.length / bytes;
        var array = [];
        var i, j;
        for (i=0; i< len; i++) {
            array[i] = 0;
            for (j = bytes - 1; j >=0; --j) {
                array[i] += decoded.charCodeAt((i * bytes) + j) << (j <<3 );
            }
        }
        return array;
    }
};

module.exports = Base64;
