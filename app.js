var os = require('os');
var fs = require('fs');
var path = require('path');
var QRCode = require("./lib/qrcode.js");

//Default configuration
var config = {
  verbose: process.env.NODE_VERBOSE == "true" || process.env.NODE_VERBOSE == "1"
};

//Command line interface
var args = process.argv.slice(2);
for (var i = 0; i < args.length; i++) {
  switch (args[i]) {
    case "--help":
      help();
      process.exit(0);
      break;
    
    //Padding in number of modules
    case "-p":
    case "--padding":
      config.padding = parseFloat(args[++i]);
      break;
    
    //Width in pixels    
    case "-w":
    case "--width":
      config.width = parseFloat(args[++i]);
      break;
      
    //Height in pixels
    case "-h":
    case "--height":
      config.height = parseFloat(args[++i]);
      break;
    
    //Foreground color    
    case "-fg":
    case "--color":
      config.color = args[++i];
      break;
    
    //Background color
    case "-bg":
    case "--background":
      config.background = args[++i];
      break;
      
    case "--ecl":
      config.ecl = args[++i];
      break;
      
    case "--join":
      config.join = true;
      break;
      
    case "--predefined":
      config.predefined = true;
      break;
      
    case "--viewbox":
      config.container = "svg-viewbox";
      break;
      
    case "--no-prettify":
      config.pretty = false;
      break;
      
    case "--swap-fix":
      config.swap = true;
      break;
      
    case "-f":
    case "--force":
      config.force = true;
      break;
      
    case "-o":
    case "--output":
      config.outputFile = args[++i];
      break;
      
    case "-v":
    case "--version":
      console.log(require('./package.json').version);
      process.exit(0);
      break;
      
    default:
      if (i == args.length - 1) {
        config.content = args[i];
      }
      else {
        console.error("Unknown command line argument: " + args[i]);
        process.exit(2);
      }
      break;
  }
}

//Prints help message
function help() {
  console.log("Usage:");
  console.log("  qrcode-svg [options] <content>");
  console.log("");
  console.log("Options:");
  console.log("  --help                 Print this message");
  console.log("  --version, -v          Print version number");
  console.log("  --padding , -p [value] Offset in number of modules");
  console.log("  --width, -w [px]       Image width in pixels");
  console.log("  --height, -h [px]      Image height in pixels");
  console.log("  --color, -fg [color]   Foreground color, hex or name");
  console.log("  --background [color]   Background color, hex or name");
  console.log("  --ecl [value]          Error correction level: L, M, H, Q");
  console.log("  --join                 Join modules into one SVG path, i.e. for crisp rendering");
  console.log("  --predefined           Use 'defs' and 'use' elements in SVG, i.e. for compact output");
  console.log("  --no-prettify          Avoid indenting and new lines in SVG, i.e. for compact output");
  console.log("  --viewbox              Use 'viewBox' instead of 'width' and 'height' attributes");
  console.log("  --swap-fix             Swap X and Y modules to fix issues with some QR readers");
  console.log("  --output, -o [file]    Output file name");
  console.log("  --force, -f            Force overwrite");
  console.log("");
  console.log("Examples:");
  console.log("  qrcode-svg http://github.com");
  console.log("  qrcode-svg -f -o hello.svg \"Hello World\"");
  console.log("  qrcode-svg -p 4 -w 256 -h 256 --join --viewbox \"Responsive...\"");
  console.log("  qrcode-svg --padding 2 --width 120 --height 120 \"Little fox...\"");
  console.log("  qrcode-svg --color blue --background #ececec \"...jumps over\"");
}

if (args.length == 0) {
  help();
  process.exit(0);
}

if (typeof config.content != "string" || config.content.length == 0) {
  console.error("Content is missing!");
  process.exit(2);
}

var qrcode = new QRCode(config);
var svg = qrcode.svg();

if (typeof config.outputFile == "string" && config.outputFile.length > 0) {
  if (!config.force && fs.existsSync(config.outputFile)) {
    console.error("File already exists: " + config.outputFile);
    process.exit(2);
  }

  fs.writeFileSync(config.outputFile, svg);
  console.log("Done!");
}
else {
  console.log(svg);
}
