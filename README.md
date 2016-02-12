Pure JavaScript QR Code generator

## Introduction

This library has been written to generate a SVG image of QR Code in Node.js, goals:
* pure JavaScript
* no browser requirement
* no external dependencies
* generate SVG output

## Getting Started

Run the commands
```bash
npm install qrcode-svg
```

Inline example:
```javascript
var QRCode = require("qrcode-svg");
var svg = new QRCode("Hello World!").svg();
```

More options:
```javascript
var qrcode = new QRCode({
  content: "http://github.com/",
  padding: 4,
  width: 256,
  height: 256,
  color: "#000000",
  background: "#ffffff",
  ecl: "M"
});
qrcode.save("sample.svg");
```

## Options

**List of options:**
* **content** - QR Code content, required
* **padding** - white space padding, `4` modules by default, `0` for no border
* **size** - QR Code width and height in pixels
* **color** - color of modules, color name or hex string, e.g. `#000000`
* **background** - color of background, color name or hex string, e.g. `white`
* **ecl** - error correction level: `L`, `M`, `H`, `Q`

### SVG output

```
<?xml version="1.0" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="256" height="256">
  <rect x="0" y="0" width="256" height="256" style="fill:#ffffff;shape-rendering:crispEdges;"/>
  <rect x="16" y="16" width="8" height="8" style="fill:#000000;shape-rendering:crispEdges;"/>
  <rect x="24" y="16" width="8" height="8" style="fill:#000000;shape-rendering:crispEdges;"/>
  <rect x="32" y="16" width="8" height="8" style="fill:#000000;shape-rendering:crispEdges;"/>
  ...
</svg>
```

## Usage Scenarios

### Convert to other formats

Using [html-pdf](https://www.npmjs.com/package/html-pdf) to convert SVG to PDF (or PNG or JPEG)
```javascript
var QRCode = require('qrcode-svg');
var svg = new QRCode('hello').svg();
...
var pdf = require('html-pdf');
pdf.create(svg, { border: 0, type: 'pdf' }).toFile('output.pdf', function(err, res) {
  ...
});
```

### ASCII modules

QR Code in ASCII to output in a shell
```javascript
var QRCode = require('qrcode-svg');

var hello = new QRCode("Hello World!");
var modules = hello.qrcode.modules;

var ascii = '';
var length = modules.length;
for (var x = 0; x < length; x++) {
  for (var y = 0; y < length; y++) {
    var module = modules[x][y];
    ascii += (module ? 'x' : ' ');
  }
  ascii += '\r\n';
}
console.log(ascii);
```

```


    xxxxxxx x    xxx  xxxxxxx
    x     x   xxx  x  x     x
    x xxx x x   xx    x xxx x
    x xxx x  x x   xx x xxx x
    x xxx x   xx   xx x xxx x
    x     x xx  xxx x x     x
    xxxxxxx x x x x x xxxxxxx
              xxxx           
    x x   xx x xxx xx  x  x x
    xxx xx x x x    x xx xx x
     x    x      xx x  x xx x
     x      xxxx  xxx    x x 
     xx  xx    x xx   x  x  x
      x xx  x x  xx   xx xx x
    xx x  x    x   x  x  xx x
       x x x  x  x     xxx   
    xxx xxxx x xxx xxxxxxx x 
            xx  x   x   xxx  
    xxxxxxx x x xxxxx x x   x
    x     x  xxxx xxx   x    
    x xxx x      xx xxxxxx   
    x xxx x  x   xx x   x    
    x xxx x xx x     x  xxxxx
    x     x   x  x     xxx   
    xxxxxxx xxxxxx xx x x x x


```

### Web browser

Use on a HTML page with JavaScript
```
<!DOCTYPE html>
<html>
<body>
<div id="container"></div>
<script src="lib/qrcode.js"></script>
<script>
var qrcode = new QRCode("Hello World!");
var svg = qrcode.svg();
document.getElementById("container").innerHTML = svg;
</script>
</body>
</html>
```

## Thanks

Thanks to [davidshimjs](https://github.com/davidshimjs/qrcodejs) for the base library.

Thanks to [Kazuhiko Arase](http://www.d-project.com/) for the original QR Code in JavaScript algorithm.

## Legal notice

```
Licensed under the MIT license:
http://www.opensource.org/licenses/mit-license.php

The word "QR Code" is registered trademark of 
DENSO WAVE INCORPORATED
http://www.denso-wave.com/qrcode/faqpatent-e.html
```