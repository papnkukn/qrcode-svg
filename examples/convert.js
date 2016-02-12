var QRCode = require('../lib/qrcode.js');

var htmlpdf;
try {
  htmlpdf = require('html-pdf');
}
catch (e) {
  console.error("Please run: npm install html-pdf");
  process.exit(1);
}

//Generate PNG image
var svg = new QRCode("Hello from PNG!").svg();
htmlpdf.create(svg, { border: 0, type: 'png' }).toFile('convert.png', function(err, res) {
  if (err) throw err;
  console.log(res);
});

//Generate PDF document
var svg = new QRCode("Hello from PDF!").svg();
htmlpdf.create(svg, { border: 0, type: 'pdf' }).toFile('convert.pdf', function(err, res) {
  if (err) throw err;
  console.log(res);
});

