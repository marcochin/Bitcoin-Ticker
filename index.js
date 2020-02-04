const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json({extended: true}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
  console.log(req.body.amount);

  if(req.body.amount === ""){
    req.body.amount = 1;
  }

  // https://www.npmjs.com/package/request#requestoptions-callback
  var options = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: { // qs for queryString params to be appended at end of url
      from: req.body.crypto,
      to: req.body.fiat,
      amount: req.body.amount
    }
  }

  request(options, function(error, response, body){
    var json = JSON.parse(body);

    res.write("<p>The current date is " + json.time + "</p>");
    res.write("<h1>" + req.body.amount + " " + req.body.crypto + " is worth "
      + json.price + " " + req.body.fiat + "</h1>");
    res.send();
  });
});

app.listen(3000, function(){
  console.log("Server running on 3000.");
});
