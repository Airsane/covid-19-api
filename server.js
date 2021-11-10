const express = require("express");
const app = express();
const cors = require('cors');
const tabletojson = require('tabletojson').Tabletojson;
const {Chart} = require('./util');

const homepage = "https://www.worldometers.info/coronavirus";
let $ = require('cheerio');
const axios = require("axios");
let countries = [];
let his = null;

app.use(express.static("client/dist"));
app.use(cors());

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

app.get('/api/graph',async (req,res,next)=>{
    if(his == null)
    {
        start();
    }
    let chart = new Chart(1280,720);
    let data = await chart.generateChart1(his.map((d => d.Total.replace(',','').replace('>',''))),his.map((d => d.Total_2.replace(',','').replace('>',''))),his.map((d => d.Total_3.replace(',','').replace('>',''))),his.length);
    res.send(data);
})

app.get('/api/graph2',async (req,res,next)=>{
    if(his == null)
    {
        start();
    }
    let chart = new Chart(1280,720);
    let data = await chart.generateChart2(his.map(d => d["28 March"].replace('>','')),his.length)
    res.send(data);
})


async function start() {
    console.log("Getting Data");
    countries = [];
    let html = (await axios.get(homepage)).data;
    $ = $.load(html);
    $('table#main_table_countries_today > tbody > tr:not(.row_continent)').each((i, e) => {
        countries.push(new Country($(e).children("td:nth-child(2)").text().trim(), $(e).children("td:nth-child(3)").text().trim(), $(e).children("td:nth-child(4)").text().trim(), $(e).children("td:nth-child(5)").text().trim(), $(e).children("td:nth-child(6)").text().trim(), $(e).children("td:nth-child(7)").text().trim()));
    })
    countries.shift();
    console.log(countries[0]);
    console.log("Data recieved");
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



