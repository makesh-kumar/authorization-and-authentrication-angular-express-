const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const api = require("./Router/api");
const cors = require("cors");
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());
app.use("/api", api);

// app.get("/", (req, res) => {
//   res.send("OK");
// });

app.listen(PORT, (req, res) => {
  console.log("server running");
});
