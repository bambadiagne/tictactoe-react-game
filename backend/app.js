const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "..", "frontend", "build")));
console.log(
  "frontend build directory",
  path.join(__dirname, "..", "frontend", "build")
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
if(process.env.NODE_ENV === 'production') {
app.get("*", (req, res) => {
  console.log("sending index.html", req.url);
  res.sendFile(path.join(__dirname, "..", "frontend", "build", "index.html"));
});
}
module.exports = app;
