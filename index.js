
const fs = require('fs');
const http = require('http');
const url = require('url');

// SERVER
const replaceTemplate = function (temp, product) {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%ID%}/g, product.id);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    else output = output.replace(/{%NOT_ORGANIC%}/g, '');

    return output;
}

const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true);

    // Overview page
    if (pathname === '/' || pathname === '/overview') {
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const outputHtml = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(outputHtml);

    // Product page
    } else if (pathname === '/product') {
        const product = dataObj[query.id];
        const outputHtml = replaceTemplate(tempProduct, product);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(outputHtml);

    // API page
    } else if (pathname === '/api') {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(data);
        
    // Not Found page
    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-custom-header': 'popsticle'
        })
        res.end('<h1>Page not Found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on requests on port 8000');
})