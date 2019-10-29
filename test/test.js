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

exports["Test containers"] = function(test) {
  test.expect(4);
  
  //QR Code in 'svg' element with 'width' and 'height' attributes
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "svg" });
    if (!/\<svg\s+/g.test(svg)) {
      throw new Error("Missing SVG root element!");
    }
    if (/viewbox=/gi.test(svg)) {
      throw new Error("Unexpected 'viewbox' attribute!");
    }
  }, Error, "Error in 'svg' container!");
  
  //QR Code in 'svg' element with 'viewbox' attribute
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "svg-viewbox" });
    if (!/\<svg\s+/g.test(svg)) {
      throw new Error("Missing SVG root element!");
    }
    if (!/viewbox=/gi.test(svg)) {
      throw new Error("Missing 'viewbox' attribute!");
    }
  }, Error, "Error in 'svg-viewbox' container!");
  
  //QR Code in 'g' element
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "g" });
    if (/\<svg\s+/g.test(svg)) {
      throw new Error("Unexpected SVG root element!");
    }
    if (!/\<g[\s\>]+/g.test(svg)) {
      throw new Error("Missing 'g' element!");
    }
  }, Error, "Error in 'g' container!");
  
  //QR Code modules without the container element
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "none" });
    if (/\<svg\s+/g.test(svg)) {
      throw new Error("Unexpected SVG root element!");
    }
    if (/\<g[\s\>]+/g.test(svg)) {
      throw new Error("Unexpected 'g' element!");
    }
  }, Error, "Error in 'g' container!");
  
  test.done();
};

exports["Test pretty"] = function(test) {
  test.expect(3);
  
  //Prettify XML enabled by default
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "none" });
    if (/$\s+\<rect\s+/g.test(svg)) {
      throw new Error("Unexpected indent before the 'rect' element!");
    }
    if (/$\<rect\s+/g.test(svg)) {
      throw new Error("Missing 'rect' element!");
    }
  }, Error, "Error in the indent!");
  
  //Prettify XML within a SVG container
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "svg-viewbox" });
    if (!/[\r\n]+\s+\<rect\s+/g.test(svg)) {
      throw new Error("Missing indent before the 'rect' element!");
    }
  }, Error, "Error in the indent!");
  
  //Turn of prettify XML
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test", pretty: false }).svg({ container: "svg-viewbox" });
    if (/[\r\n]+\s+\<rect\s+/g.test(svg)) {
      throw new Error("Unexpected indent before the 'rect' element!");
    }
  }, Error, "Error in the indent!");
  
  test.done();
};

exports["Test other options"] = function(test) {
  test.expect(3);
  
  //Element 'rect' as the default option
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test" }).svg({ container: "none" });
    if (svg.split(/\<rect\s+/g).length < 20) { //There must be at least few 'rect' elements
      throw new Error("Missing 'rect' element!");
    }
  }, Error, "Error in 'rect' modules!");
  
  //Element 'path' for joined modules
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test", join: true }).svg({ container: "none" });
    if (svg.split(/\<rect\s+/g).length - 1 != 1) { //Exactly one 'rect' for background
      throw new Error("Unexpected 'rect' modules!");
    }
    if (!/\<path\s+[^\>]+d=/g.test(svg)) {
      throw new Error("Missing 'path' element with 'd' attribute!");
    }
  }, Error, "Error in SVG path!");
  
  //Element 'defs' and 'use' for populating with a predefined module shape
  test.doesNotThrow(function() {
    var svg = new QRCode({ content: "test", predefined: true }).svg({ container: "none" });
    if (svg.split(/\<rect\s+/g).length - 1 != 1) { //Exactly one 'rect' for background
      throw new Error("Unexpected 'rect' modules!");
    }
    if (!/\<defs[\s\>]/g.test(svg)) {
      throw new Error("Missing 'defs' element!");
    }
    if (!/\<use\s+[^\>]+href=/g.test(svg)) {
      throw new Error("Missing 'use' element with 'href' attribute!");
    }
  }, Error, "Error in predefined shape!");
  
  test.done();
};

exports["Test by generating samples"] = function(test) {
  test.expect(5);
  
  var fs = require('fs');
  var path = require('path');
  
  var folder = "samples";
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
  
  test.doesNotThrow(function() {
    new QRCode({ content: "test" })
    .save(path.join(folder, "sample_default.svg"));
  }, Error, "Should generate a QR Code file!");
  
  test.doesNotThrow(function() {
    new QRCode({
      content: "test",
      background: "beige",
      color: "blue",
      join: true
    })
    .save(path.join(folder, "sample_path_data.svg"));
  }, Error, "Should generate a QR Code file!");
  
  test.doesNotThrow(function() {
    new QRCode({
      content: "test",
      background: "beige",
      color: "maroon",
      predefined: true
    })
    .save(path.join(folder, "sample_defs_use.svg"));
  }, Error, "Should generate a QR Code file!");
  
  test.doesNotThrow(function() {
    new QRCode({
      content: "test",
      background: "white",
      color: "black",
      swap: true
    })
    .save(path.join(folder, "sample_swap_xy.svg"));
  }, Error, "Should generate a QR Code file!");
  
  test.doesNotThrow(function() {
    new QRCode({
      content: "test",
      pretty: false
    })
    .save(path.join(folder, "sample_no_pretty.svg"));
  }, Error, "Should generate a QR Code file!");
  
  setTimeout(function() {
    test.done();
  }, 1000);
};
