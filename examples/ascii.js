var QRCode = require('../lib/qrcode.js');

var hello = new QRCode("Hello World!");
var modules = hello.qrcode.modules;

var ascii = '';
var length = modules.length;
for (var y = 0; y < length; y++) {
  for (var x = 0; x < length; x++) {
    var module = modules[x][y];
    ascii += (module ? 'x' : ' ');
  }
  ascii += '\r\n';
}
console.log(ascii);