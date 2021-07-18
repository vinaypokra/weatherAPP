const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceval = (tempVal, orgVal) => {
  let temperature = tempVal;
  temperature = temperature.replace("{%tempval%}", orgVal.main.temp / 10);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min / 10);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max / 10);
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=kota&appid=4b1c4a84cb02f3a631744114294319ab"
    )
      .on("data", (chunk) => {
        const objectdata = JSON.parse(chunk);
        const arrdata = [objectdata];
        // console.log(arrdata[0].main.temp);

        const realTimedata = arrdata
          .map((val) => replaceval(homeFile, val))
          .join("");
        res.write(realTimedata);
        // console.log(realTimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1");

/* Assignment 1: 
make an api call to "https://api.first.org/data/v1/countries"

and display result in a material table with column names -> country code, country , region

in class component( use componentDidMount function) as well as functional component ( use useEffect hook). */
