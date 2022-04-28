var express = require("express");
var router = express.Router();
const axios = require("axios");
const db = require("../model/db");
const contactModel = require("../model/contact");

/* GET users listing. */
router.get("/", function (req, res, next) {
  const query = "select * from contact";
  const data = [];

  db.all(query, data, (err, response) => {
    if (err) return console.log(err.message);
    res.send(response);
  });
});

router.post("/", async function (req, res, next) {
  let result = await contactModel.addContact(req.body);
  res.send(JSON.stringify(result));
});

router.patch("/", async function (req, res, next) {
  let result = await contactModel.updContact(req.body);
  res.send(JSON.stringify(result));
});

router.delete("/", function (req, res, next) {
  contactModel.delContact(req.body);
  res.send("user deleted");
});

module.exports = router;
