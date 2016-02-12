var QRCode = require('../lib/qrcode.js');

function generateRandomString(length) {
  var result = "";
  var charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (var i = 0, n = charset.length; i < length; ++i) {
    result += charset.charAt(Math.floor(Math.random() * n));
  }
  return result;
}

exports["Test SVG output"] = function(test) {
  test.expect(6);
  
  var qrcode = new QRCode("Hello World!");
  test.ok(typeof qrcode == "object", "Expected object as the result!");
  test.ok(typeof qrcode.svg == "function", "Missing 'svg' function!");
  test.ok(typeof qrcode.save == "function", "Missing 'save' function!");
  
  var svg = qrcode.svg();
  test.ok(typeof svg == "string", "Expected string as the result!");
  test.ok(/\<svg[\s\S]+\<\/svg\>/g.test(svg), "Missing 'svg' tags!");
  test.ok(/\<rect[\s\S]+/g.test(svg), "Missing 'rect' tags!");
  
  test.done();
};

exports["Test padding options"] = function(test) {
  test.expect(3);
  
  test.doesNotThrow(function() { new QRCode({ content: "test", padding: 0 }).svg(); }, Error, "Padding value should be supported!");
  test.doesNotThrow(function() { new QRCode({ content: "test", padding: 4 }).svg(); }, Error, "Padding value should be supported!");
  test.throws(function() { new QRCode({ content: "test", padding: -1 }).svg(); }, Error, "Padding value must be non-negative!");
  
  test.done();
};

exports["Test width and height options"] = function(test) {
  test.expect(5);
  
  test.doesNotThrow(function() { new QRCode({ content: "test", width: 1, height: 1 }).svg(); }, Error, "Options 'width' and 'height' should be allowed!");
  test.doesNotThrow(function() { new QRCode({ content: "test", width: 1000, height: 1000 }).svg(); }, Error, "Options 'width' and 'height' should be allowed!");
  test.throws(function() { new QRCode({ content: "test", width: 0, height: 0 }).svg(); }, Error, "Options 'width' and 'height' must higher than zero!");
  test.throws(function() { new QRCode({ content: "test", width: -1 }).svg(); }, Error, "Option 'width' must higher than zero!");
  test.throws(function() { new QRCode({ content: "test", height: -1 }).svg(); }, Error, "Option 'height' must higher than zero!");
  
  test.done();
};

exports["Test ECL options"] = function(test) {
  test.expect(6);
  
  test.doesNotThrow(function() { new QRCode({ content: "test", ecl: "L" }); }, Error, "Error correction level L should be supported!");
  test.doesNotThrow(function() { new QRCode({ content: "test", ecl: "M" }); }, Error, "Error correction level M should be supported!");
  test.doesNotThrow(function() { new QRCode({ content: "test", ecl: "Q" }); }, Error, "Error correction level Q should be supported!");
  test.doesNotThrow(function() { new QRCode({ content: "test", ecl: "H" }); }, Error, "Error correction level H should be supported!");
  test.throws(function() { new QRCode({ content: "test", ecl: "m" }); }, Error, "Error correction level should be case sensitive!");
  test.throws(function() { new QRCode({ content: "test", ecl: "N" }); }, Error, "Unknown error correction level!");
  
  test.done();
};

exports["Test content length"] = function(test) {
  test.expect(12);
  
  test.throws(function() { new QRCode(); }, Error, "Missing string or options should throw an exception!");
  test.throws(function() { new QRCode({ }); }, Error, "Missing content should throw an exception!");
  test.throws(function() { new QRCode(""); }, Error, "Empty string should throw an exception!");
  test.doesNotThrow(function() { new QRCode(generateRandomString(1)); }, Error, "1 char should be allowed!");
  
  var reserved = 3; //3 bytes reserved for UTF-8 encoding
  test.doesNotThrow(function() { new QRCode({ content: generateRandomString(2953 - reserved), ecl: "L" }); }, Error, "Should allow 2956 as the max length of Version 40, L, binary!");
  test.throws(function() { new QRCode({ content: generateRandomString(2953 - reserved + 1), ecl: "L" }); }, Error, "2956 is the capacity of Version 40, L, binary!");
  test.doesNotThrow(function() { new QRCode({ content: generateRandomString(2331 - reserved), ecl: "M" }); }, Error, "Should allow 2331 as the max length of Version 40, M, binary!");
  test.throws(function() { new QRCode({ content: generateRandomString(2331 - reserved + 1), ecl: "M" }); }, Error, "2331 is the capacity of Version 40, M, binary!");
  test.doesNotThrow(function() { new QRCode({ content: generateRandomString(1663 - reserved), ecl: "Q" }); }, Error, "Should allow 1663 as the max length of Version 40, Q, binary!");
  test.throws(function() { new QRCode({ content: generateRandomString(1663 - reserved + 1), ecl: "Q" }); }, Error, "1663 is the capacity of Version 40, Q, binary!");
  test.doesNotThrow(function() { new QRCode({ content: generateRandomString(1273 - reserved), ecl: "H" }); }, Error, "Should allow 1273 as the max length of Version 40, H, binary!");
  test.throws(function() { new QRCode({ content: generateRandomString(1273 - reserved + 1), ecl: "H" }); }, Error, "1273 is the capacity of Version 40, H, binary!");
  
  test.done();
};
