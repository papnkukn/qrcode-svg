## Introduction

This library has been written to generate a SVG image of QR Code in Node.js, goals:
* pure JavaScript
* no browser requirement
* no external dependencies
* generate SVG output

## Getting Started

Install the package:
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
  ecl: "M",
});
qrcode.save("sample.svg", function(error) {
  if (error) throw error;
  console.log("Done!");
});
```

## Options

**List of options:**
* **content** - QR Code content, the only **required** parameter
* **padding** - white space padding, `4` modules by default, `0` for no border
* **width** - QR Code width in pixels
* **height** - QR Code height in pixels
* **color** - color of modules (squares), color name or hex string, e.g. `#000000`
* **background** - color of background, color name or hex string, e.g. `white`
* **ecl** - error correction level: `L`, `M`, `H`, `Q`
* **join** - join modules (squares) into one shape, into the SVG `path` element, **recommended** for web and responsive use, default: `false`
* **predefined** - to create a squares as pattern, then populate the canvas, default: `false`, see the output examples below
* **pretty** - apply indents and new lines, default: `true`
* **swap** - swap X and Y modules, only if you have issues with some QR readers, default: `false`
* **xmlDeclaration** - prepend XML declaration to the SVG document, i.e. `<?xml version="1.0" standalone="yes"?>`, default: `true`
* **container** - wrapping element, default: `svg`, see below

**Container options:**
* **svg** - populate squares in a SVG document with `width` and `height` attriute, recommended for converting to raster images or PDF where QR Code is being static (exact size)
* **svg-viewbox** - populate squares in a SVG document with `viewBox` attriute, **recommended** for responsive web pages
* **g** - put squares in `g` element, useful when you need to put multiple QR Codes in a single SVG document
* **none** - no wrapper

## SVG output

### Editable squares

This mode is useful for designers to manipulate with particular squares.
Thus, one can open the QR Code in an editor, select particular modules, move around, change color, etc.
However, some old SVG viewers may generate minor gaps between the squares - the side effect when rendering an image at certain zoom level.

Default options
```javascript
var qrcode = new QRCode({
  content: "Pretty Fox",
  join: false,
  predefined: false
});
```

Output with `rect` elements
```xml
<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="256" height="256">
  <rect x="0" y="0" width="256" height="256" style="fill:#ffffff;shape-rendering:crispEdges;"/>
  <rect x="16" y="16" width="8" height="8" style="fill:#000000;shape-rendering:crispEdges;"/>
  <rect x="24" y="16" width="8" height="8" style="fill:#000000;shape-rendering:crispEdges;"/>
  <rect x="32" y="16" width="8" height="8" style="fill:#000000;shape-rendering:crispEdges;"/>
  ...
</svg>
```

### Responsive web page

Squares joined into one `path` shape produce a compact file size, i.e. 4-5x reduced compared with `rect` elements.
A single `path` element will result in an optimized rendering, thus not producing any minor gaps between the squares.
Also using the container with `viewBox` attribute may contribute to the responsive scaling on the web.

Set `join` to `true`
```javascript
var qrcode = new QRCode({
  content: "Pretty Fox",
  join: true,
  container: "svg-viewbox" //Useful but not required
});
```

Output with `path` element
```xml
<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256">
  <rect x="0" y="0" width="256" height="256" style="fill:beige;shape-rendering:crispEdges;"/>
  <path x="0" y="0" style="fill:blue;shape-rendering:crispEdges;" d="M35.31,35.31 V44.14 H44.14 V35.31 H35.31 Z..." />
</svg>
```

### Predefined pattern

Algorithm defines the square pattern once before populating a canvas. Useful if you want to generate QR Code with candies.
However, some SVG software and converters do not support `defs` or `use` elements.

Set `predefined` to `true`
```javascript
var qrcode = new QRCode({
  content: "Pretty Fox",
  predefined: true
});
```

Output with `defs` and `use` elements
```xml
<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="256" height="256">
  <defs><path id="qrmodule" d="M0 0 h8.827586206896552 v8.827586206896552 H0 z" style="fill:maroon;shape-rendering:crispEdges;" /></defs>
  <rect x="0" y="0" width="256" height="256" style="fill:beige;shape-rendering:crispEdges;"/>
  <use x="35.310344827586206" y="35.310344827586206" href="#qrmodule" />
  <use x="44.13793103448276" y="35.310344827586206" href="#qrmodule" />
  <use x="52.96551724137931" y="35.310344827586206" href="#qrmodule" />
  <use x="61.79310344827586" y="35.310344827586206" href="#qrmodule" />
  <use x="70.62068965517241" y="35.310344827586206" href="#qrmodule" />
  ...
</svg>
```

## Command Line

```
Usage:
  qrcode-svg [options] <content>

Options:
  --help                 Print this message
  --version, -v          Print version number
  --padding , -p [value] Offset in number of modules
  --width, -w [px]       Image width in pixels
  --height, -h [px]      Image height in pixels
  --color, -fg [color]   Foreground color, hex or name
  --background [color]   Background color, hex or name
  --ecl [value]          Error correction level: L, M, H, Q
  --join                 Join modules into one SVG path, i.e. for crisp rendering
  --predefined           Use 'defs' and 'use' elements in SVG, i.e. for compact output
  --no-prettify          Avoid indenting and new lines in SVG, i.e. for compact output
  --viewbox              Use 'viewBox' instead of 'width' and 'height' attributes
  --swap-fix             Swap X and Y modules to fix issues with some QR readers
  --output, -o [file]    Output file name
  --force, -f            Force overwrite

Examples:
  qrcode-svg http://github.com
  qrcode-svg -f -o hello.svg "Hello World"
  qrcode-svg -p 4 -w 256 -h 256 --join --viewbox "Responsive..."
  qrcode-svg --padding 2 --width 120 --height 120 "Little fox..."
  qrcode-svg --color blue --background #ececec "...jumps over" 
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
for (var y = 0; y < length; y++) {
  for (var x = 0; x < length; x++) {
    var module = modules[x][y];
    ascii += (module ? 'x' : ' ');
  }
  ascii += '\r\n';
}
console.log(ascii);
```

```


    xxxxxxx xx    x x xxxxxxx
    x     x  xxxx x x x     x
    x xxx x xx  xx  x x xxx x
    x xxx x       xx  x xxx x
    x xxx x  x   x  x x xxx x
    x     x  x  xx xx x     x
    xxxxxxx x x x x x xxxxxxx
            xx     xx        
    x x  xx    x x   xx   x x
       x x  xx x    xx x xx x
     x  x xx   x x x  xx   xx
     x xx  xxx xx x x  x  x x
     xx  xxxx       xxxx    x
    x x  x xx x xx xx x xx xx
    x    xx   xxxx    xxxx   
    xx xx   x  x  x x xx    x
       xxxx xxxx    xxxxxx  x
                    x   x x  
    xxxxxxx  x  xxx x x x   x
    x     x xxx  x xx   x  x 
    x xxx x        xxxxxxxxxx
    x xxx x  xxxxxxxxx  x xx 
    x xxx x xxx  xx  x    x x
    x     x    x    x     x  
    xxxxxxx xxx xxx   x   x x


```

### Web browser

Use on a HTML page with JavaScript
```html
<!DOCTYPE html>
<html>
<body>
<div id="container"></div>
<script src="dist/qrcode.min.js"></script>
<script>
var qrcode = new QRCode({
  content: "Hello World!",
  container: "svg-viewbox", //Responsive use
  join: true //Crisp rendering and 4-5x reduced file size
});
var svg = qrcode.svg();
document.getElementById("container").innerHTML = svg;
</script>
</body>
</html>
```

## Thanks

Thanks to [davidshimjs](https://github.com/davidshimjs/qrcodejs) for the base library.

Thanks to [Kazuhiko Arase](http://www.d-project.com/) for the original QR Code in JavaScript algorithm.

Thanks to all contributors on the GitHub.

## Legal notice

```
Licensed under the MIT license:
http://www.opensource.org/licenses/mit-license.php

The word "QR Code" is registered trademark of DENSO WAVE INCORPORATED
http://www.denso-wave.com/qrcode/faqpatent-e.html
```