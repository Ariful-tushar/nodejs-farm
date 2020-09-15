const fs = require('fs');
const http = require('http');
const url = require('url');
const { dirname } = require('path');

const slugify = require('slugify');

const replaceTemplate = require('./starter/modules/replaceTemplate.js');

// const text = fs.readFileSync('./starter/txt/input.txt', 'utf-8');

// const newText = `This is a new file ${text} \ncreated on ${Date.now()}`;

// fs.writeFileSync('./starter/txt/new.txt', newText)
// console.log ('Done!')

const tempHome = fs.readFileSync(
  `${__dirname}/starter/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/starter/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/starter/templates/template-product.html`,
  'utf-8'
);
const data = fs.readFileSync(
  `${__dirname}/starter/dev-data/data.json`,
  'utf-8'
);
const dataObj = JSON.parse(data);
const slug = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slug);

//Testing pusrose
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  //Home page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-type': 'text/html' });

    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempHome.replace('{%PRODUCT_CARD%}', cardHtml);
    res.end(output);
  }

  //Products page
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  //Api Page
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);
  }

  //Not found page
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world',
    });
    res.end('<h1>The page not found!</h1>');
  }
});

//Listen to server
server.listen(8000, '127.0.0.2', () => {
  console.log('Listen to request on port 8000');
});
