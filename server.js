// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const rp = require('request-promise');
const express = require("express");
const app = express();
const keepalive = require('express-glitch-keepalive');
const history = require('connect-history-api-fallback');
const tabletojson = require('tabletojson').Tabletojson;
const countrys = require('country-list-js'); 

const homepage = "https://www.worldometers.info/coronavirus";
let $ = require('cheerio');
let countries = [];
let his = null;

app.use(keepalive);

//app.use(history());

app.use(express.static("client/dist"));

app.get("/", function (request, response) {
    response.sendFile(__dirname + "/client/dist/index.html");
});

app.get("/api/countries", (req, res, next) => {
    if (countries.length == 0) {
        start();
    }
    res.json(countries.map(x => x.name));
})

app.get('/api', (req, res, next) => {
    res.send("/countries <br>/country/[country]<br>/history")
})

app.get('/api/country/all', (req, res, next) => {
    res.json(countries);
})


app.get("/api/country/:name", (req, res, next) => {
    let item = countries.find(x => x.name === req.params.name.toLowerCase().capitalize());
    if (item) {
        res.json(item);
    }
    else {
        res.send("Nic nenalezeno <img src='https://pbs.twimg.com/profile_images/935623760664846336/l2umB3qo.jpg'></img>");
    }
})

app.get('/api/history', (req, res, next) => {
    if (his == null) {
        start();
    }
    res.json(his);

})


async function start() {
    console.log("Getting Data");
    countries = [];
    let html = await rp(homepage);
    $ = $.load(html);
    $('#main_table_countries_today tr').each((i, e) => {
        countries.push(new Country($(e).children("td:nth-child(1)").text().trim(), $(e).children("td:nth-child(2)").text().trim(), $(e).children("td:nth-child(3)").text().trim(), $(e).children("td:nth-child(4)").text().trim(), $(e).children("td:nth-child(5)").text().trim(), $(e).children("td:nth-child(6)").text().trim()));
    })
    countries.shift();
    console.log("Data recieved");
    tabletojson.convertUrl(
        'https://en.wikipedia.org/wiki/2020_coronavirus_pandemic_in_the_Czech_Republic#cite_note-:0-1',
        function (tablesAsJson) {
            his = tablesAsJson[3]
        }
    );

}

class Country {
    constructor(name, totalC, newC, totalD, newD, totalR) {
        this.name = name;
        this.totalC = totalC;
        this.newC = newC;
        this.totalD = totalD;
        this.newD = newD;
        this.totalR = totalR;
    }
}

start();

const listener = app.listen(process.env.PORT || 3001, () => {
    console.log("Your app is listening on port " + listener.address().port);
});

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

setInterval(async () => {
    start();
}, 5 * 60 * 1000);



