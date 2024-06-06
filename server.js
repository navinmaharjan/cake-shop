const fs = require("fs");
const http = require("http");
const url = require("url")

const replaceTemplate = (temp, cake) => {
    let output = temp.replace(/{%CAKENAME%}/g, cake.cakeName);
    output = output.replace(/{%IMAGE%}/g, cake.image)
    output = output.replace(/{%DESCRIPTION%}/g, cake.description)
    output = output.replace(/{%PRICE%}/g, cake.price)
    output = output.replace(/{%INGREDIENTS%}/g, cake.ingredients)
    output = output.replace(/{%ID%}/g, cake.id)
    return output
}

const templateHome = fs.readFileSync(`${__dirname}/templates/index.html`, 'utf-8')
const templateCakeDetail = fs.readFileSync(`${__dirname}/templates/cake-detail.html`, 'utf-8')
const templateCards = fs.readFileSync(`${__dirname}/templates/cards.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
   
    const { query, pathname } = url.parse(req.url, true)

    //Home Page
    if (pathname === "/") {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const cardsHtml = dataObj.map(item => replaceTemplate(templateCards, item)).join('')
        const output = templateHome.replace('{%CAKE_CARDS%}', cardsHtml)
        res.end(output)

        //Cake Detail Page
    } else if (pathname === "/product") {
        res.writeHead(200, { 'Content-type': 'text/html' })
        const product = dataObj[query.id]
        const output = replaceTemplate(templateCakeDetail, product)
        res.end(output)

        //API
    } else if (pathname === "/api") {
        res.writeHead(200, { 'Content-type': 'application/json' })
        res.end(data)
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
        })
        res.end("<h1>Page not found</h1>")
    }
});

server.listen(8000, "127.0.0.1", () => {
    console.log("Listening to requests on port 8000");
});
