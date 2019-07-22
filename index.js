// Imports
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// Data
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

const slugs = dataObj.map(product =>
  slugify(product.productName, { lower: true })
);
console.log(slugs);

// Server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Overview page
  if (pathname === '/' || pathname === '/overview') {
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');

    const output = tempOverview.replace(/{%PRODUCT_CARDS%}/, cardsHtml);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(output);
  }

  // Product page
  else if (pathname === '/product') {
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.end(output);
  }

  // Not found
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  // 404
  else {
    res.writeHead(404, { 'Content-type': 'text/html' });
    res.end('<h1>Page not found!</h1>');
  }
});

// Listening
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
