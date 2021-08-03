const zlib = require('zlib');

const compressData = (data, callback) => {
    zlib.brotliCompress(data, (err, buff) => {
        callback(buff);
    });
}

module.exports.compressData = compressData;
