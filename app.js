const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

app.set('view engine', 'ejs');
require('dotenv').config();

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.password,
  database: 'bank',
  multipleStatements: true
});
let obj;
connection.connect();
app.get("/", function(req, res) {
  res.render("home")
});
app.get("/customers", function(req, res) {
  connection.query("SELECT * FROM customers", function(error, results, fields) {
    if (error) throw error;
    // console.log(results);
    res.render("customers", {
      data: results
    })
  })
});
app.get("/customers/:id", function(req, res) {
  var sql = 'SELECT * FROM customers where id=?; SELECT * FROM customers';
  connection.query(sql, [req.params.id], function(error, results, fields) {
    if (error) throw error;
    names = results[1].filter(function(x) {
      return x.name !== results[0][0].name
    })
    res.render("cust", {
      data: results[0],
      fullData: names
    })
  })
});

app.post("/transfer", function(req, res) {
  console.log(req.body);
  if (Number(req.body.balance) > Number(req.body.amt)) {
    var newAmt;
    var balance = Number(req.body.balance) - Number(req.body.amt);
    var withdraw = Number(req.body.withdraw) + Number(req.body.amt);
    connection.query("UPDATE customers set amount=?, withdraw=? where id=?", [balance, withdraw, req.body.id], function(error, results, fields) {
      if (error) throw error;
    });
    connection.query("SELECT * FROM customers where name=?", [req.body.transferName], function(error, results, fields) {
      if (error) throw error;
      newAmt = Number(results[0].amount) + Number(req.body.amt);
      connection.query("UPDATE customers set amount=? where name=?", [newAmt, req.body.transferName], function(error, results, fields) {
        if (error) throw error;
        res.redirect("/customers");
      })
    })
  } else
    setInterval(function() {
      res.redirect("/customers/" + req.body.id);
    }, 3000);
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
